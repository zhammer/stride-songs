package main

import (
	"context"
	"fmt"
	"net"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/go-pg/pg/v10"
	"github.com/stretchr/testify/assert"
	"github.com/zhammer/stride-songs/internal"
	"github.com/zhammer/stride-songs/pkg/database"
	"github.com/zhammer/stride-songs/pkg/spotify"
)

type cuke struct {
	mockSpotify       *spotify.MockSpotify
	mockSpotifyServer *httptest.Server
	db                *pg.DB
	t                 *testing.T
}

func (c *cuke) before() (func(), error) {
	// setup mock spotify server
	l, err := net.Listen("tcp", "127.0.0.1:6000")
	if err != nil {
		return nil, err
	}
	c.mockSpotify = spotify.NewMockSpotify()
	c.mockSpotifyServer = httptest.NewUnstartedServer(c.mockSpotify.Mux())
	c.mockSpotifyServer.Listener.Close()
	c.mockSpotifyServer.Listener = l
	c.mockSpotifyServer.Start()

	// setup db
	c.db = pg.Connect(&pg.Options{
		Addr:     "localhost:5432",
		User:     "stridesongs",
		Password: "password",
		Database: "stridesongs",
	})
	if err := c.db.Ping(context.Background()); err != nil {
		return nil, err
	}

	return func() {
		c.mockSpotifyServer.Close()
	}, nil
}

func (c *cuke) beforeEach() error {
	if err := database.Clear(c.db); err != nil {
		return err
	}

	c.mockSpotify.Clear()

	return nil
}

func (c *cuke) noErr(f func() error) {
	assert.NoError(c.t, f())
}

func (c *cuke) theFollowingUserExists(user *internal.User) {
	c.noErr(func() error {
		if _, err := c.db.Model(user).Insert(); err != nil {
			return err
		}
		return nil
	})
}

func (c *cuke) theFollowSpotifyUsersExist(userIDs []string) {
	for _, id := range userIDs {
		c.mockSpotify.AddUser(id)
	}
}

func (c *cuke) theUserSetsTheirRefreshToken(user *internal.User, refreshToken string) {
	c.noErr(func() error {
		user.SpotifyRefreshToken = "zach:refresh-token"
		if _, err := c.db.Model(user).Where("id = ?id").Update(); err != nil {
			return err
		}
		return nil
	})
}

func (c *cuke) theUserWaitsForLibrarySyncToSucceed(user *internal.User) {
	c.noErr(func() error {
		success := make(chan bool, 1)
		errCh := make(chan error, 1)
		go func() {
			for {
				if err := c.db.Model(user).Where("id = ?id").Select(); err != nil {
					errCh <- err
					return
				}

				switch user.LibrarySyncStatus {
				case internal.LibrarySyncStatusSucceeded:
					success <- true
					return
				default:
					time.Sleep(1 * time.Second)
				}
			}
		}()

		select {
		case <-success:
			return nil
		case err := <-errCh:
			return err
		case <-time.After(30 * time.Second):
			return fmt.Errorf("timed out waiting for state")
		}
	})
}

func (c *cuke) theUserHasTheFollowingPlaylists(user *internal.User, expectedPlaylists *[]internal.Playlist) {
	var playlists []internal.Playlist
	assert.NoError(c.t,
		c.db.Model(&playlists).
			Where("user_id = ?", user.ID).
			Relation("Tracks").
			Select(),
	)

	assert.Equal(c.t, len(*expectedPlaylists), len(playlists))

	for i, playlist := range playlists {
		expectedPlaylist := (*expectedPlaylists)[i]
		assert.Equal(c.t, playlist.SPM, expectedPlaylist.SPM)

		assert.Equal(c.t, len(expectedPlaylist.Tracks), len(playlist.Tracks))
		for i, track := range playlist.Tracks {
			expectedTrack := expectedPlaylist.Tracks[i]

			assert.Equal(c.t, expectedTrack.SpotifyID, track.SpotifyID)
			assert.Equal(c.t, expectedTrack.Status, track.Status)
		}
	}
}

func (c *cuke) theFollowingSpotifyTracksExist(tracks *[]spotify.AnalyzedTrack) {
	c.mockSpotify.AddTracks(*tracks)
}

func (c *cuke) theSpotifyUserHasTheFollowingTracks(userID string, trackIDs []string) {
	assert.NoError(c.t, c.mockSpotify.AddUserTracks(userID, trackIDs))
}

func (c *cuke) given() *cuke {
	return c
}
func (c *cuke) when() *cuke {
	return c
}
func (c *cuke) then() *cuke {
	return c
}
func (c *cuke) and() *cuke {
	return c
}

func TestLibrarySync(t *testing.T) {
	// spotify tracks
	var (
		// bebey - theopilus london
		bebey = spotify.AnalyzedTrack{Track: spotify.Track{ID: "7EZ8HvyKfad2vUIOivqjN5"}, Tempo: 164.044}
		// cheat code - dap the contract
		cheatCode = spotify.AnalyzedTrack{Track: spotify.Track{ID: "4buERRuDerqKP2g0GAOg4V"}, Tempo: 166.084}
		// marilyn - mount kimbie
		marilyn = spotify.AnalyzedTrack{Track: spotify.Track{ID: "5jJPcImQkogKdwsVS36zH7"}, Tempo: 179.826}
	)
	cuke := cuke{t: t}
	after, err := cuke.before()
	assert.NoError(t, err)
	defer after()

	t.Run("happy path", func(t *testing.T) {
		cuke.beforeEach()

		cuke.given().theFollowSpotifyUsersExist([]string{"zach", "stridesongs"})
		cuke.and().theFollowingSpotifyTracksExist(&[]spotify.AnalyzedTrack{bebey, cheatCode, marilyn})
		cuke.and().theSpotifyUserHasTheFollowingTracks("zach", []string{bebey.ID, cheatCode.ID, marilyn.ID})

		user := internal.User{
			LibrarySyncStatus: internal.LibrarySyncStatusPendingRefreshToken,
		}
		cuke.and().theFollowingUserExists(&user)

		cuke.when().theUserSetsTheirRefreshToken(&user, "zach:refresh-token")

		cuke.and().theUserWaitsForLibrarySyncToSucceed(&user)

		expectedPlaylists := make([]internal.Playlist, len(internal.SPMs))
		for i, spm := range internal.SPMs {
			playlist := &expectedPlaylists[i]
			playlist.SPM = spm

			switch spm {
			case 165:
				playlist.Tracks = []internal.PlaylistTrack{
					{SpotifyID: bebey.ID, Status: internal.PlaylistTrackStatusAdded},
					{SpotifyID: cheatCode.ID, Status: internal.PlaylistTrackStatusAdded},
				}
			case 180:
				playlist.Tracks = []internal.PlaylistTrack{
					{SpotifyID: marilyn.ID, Status: internal.PlaylistTrackStatusAdded},
				}
			}

		}
		cuke.then().theUserHasTheFollowingPlaylists(&user, &expectedPlaylists)

	})
}
