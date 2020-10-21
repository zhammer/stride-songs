// +build integration

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

// spotify tracks
var (
	// bebey - theopilus london
	bebey = spotify.AnalyzedTrack{Track: spotify.Track{ID: "7EZ8HvyKfad2vUIOivqjN5"}, Tempo: 164.044}
	// cheat code - dap the contract
	cheatCode = spotify.AnalyzedTrack{Track: spotify.Track{ID: "4buERRuDerqKP2g0GAOg4V"}, Tempo: 166.084}
	// marilyn - mount kimbie
	marilyn = spotify.AnalyzedTrack{Track: spotify.Track{ID: "5jJPcImQkogKdwsVS36zH7"}, Tempo: 179.826}
	// if you call - angie mcmahon
	ifYouCall = spotify.AnalyzedTrack{Track: spotify.Track{ID: "7J29qM3iwzKv83ZnTLdZ0v"}, Tempo: 106.704}
)

// spotify userIDs
var (
	zach        = "zach"
	strideSongs = "stridesongs"
)

type Cuke struct {
	mockSpotify       *spotify.MockSpotify
	mockSpotifyServer *httptest.Server
	db                *pg.DB
	t                 *testing.T
	backgroundFn      *func(c *Cuke)
}

func (c *Cuke) before() (func(), error) {
	// setup mock spotify server
	// need 0.0.0.0 binding for CI
	l, err := net.Listen("tcp", "0.0.0.0:6000")
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

func (c *Cuke) Run(name string, f func(*testing.T, *Cuke)) {
	c.t.Run(name, func(t *testing.T) {
		cuke := c.WithT(t)
		cuke.beforeEach()
		if c.backgroundFn != nil {
			(*c.backgroundFn)(cuke)
		}
		f(t, cuke)
	})
}

func (c *Cuke) background(f func(c *Cuke)) {
	c.backgroundFn = &f
}

func (c *Cuke) beforeEach() error {
	if err := database.Clear(c.db); err != nil {
		return err
	}

	c.mockSpotify.Clear()

	return nil
}

func (c *Cuke) noErr(f func() error) {
	assert.NoError(c.t, f())
}

func (c *Cuke) theFollowingUserExists(user *internal.User) {
	c.noErr(func() error {
		if _, err := c.db.Model(user).Insert(); err != nil {
			return err
		}
		for i := range user.Playlists {
			playlist := &user.Playlists[i]
			playlist.UserID = user.ID
			if _, err := c.db.Model(playlist).Insert(); err != nil {
				return err
			}
		}
		return nil
	})
}

func (c *Cuke) theFollowSpotifyUsersExist(userIDs []string) {
	for _, id := range userIDs {
		c.mockSpotify.AddUser(id)
	}
}

func (c *Cuke) theUserSetsTheirRefreshToken(user *internal.User, refreshToken string) {
	c.noErr(func() error {
		user.SpotifyRefreshToken = refreshToken
		if _, err := c.db.Model(user).WherePK().Update(); err != nil {
			return err
		}
		return nil
	})
}

func (c *Cuke) theUserWaitsForLibrarySyncToSucceed(user *internal.User) {
	c.noErr(func() error {
		success := make(chan bool, 1)
		errCh := make(chan error, 1)
		go func() {
			for {
				if err := c.db.Model(user).WherePK().Select(); err != nil {
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
		case <-time.After(10 * time.Second):
			return fmt.Errorf("timed out waiting for state")
		}
	})
}

func (c *Cuke) theUserHasTheFollowingPlaylists(user *internal.User, expectedPlaylists *[]internal.Playlist) {
	var playlists []internal.Playlist
	assert.NoError(c.t,
		c.db.Model(&playlists).
			Where("user_id = ?", user.ID).
			// order by playlist_track.created_at so that our tests pass. this is just based
			// on the internals of our mock spotify server (which returns the user's library
			// in the order we set in our code) and our library sync implementation that adds
			// the tracks from the library into the DB in the order that they came from spotify.
			// basically: this may break and the better approach is that both arrays are sorted
			// by spotify_id before comparing.
			Relation("Tracks", internal.WithOrderBy("playlist_track.created_at")).
			Select(),
	)

	assert.Equal(c.t, len(*expectedPlaylists), len(playlists))

	for i, playlist := range playlists {
		expectedPlaylist := (*expectedPlaylists)[i]
		assert.Equal(c.t, playlist.SPM, expectedPlaylist.SPM)
		// we manually set the id of a new playlist in our mock spotify service
		// to be "IDFOR:" + the provided name
		assert.Equal(c.t, "IDFOR:"+expectedPlaylist.Name(), playlist.SpotifyID)

		assert.Equal(c.t, len(expectedPlaylist.Tracks), len(playlist.Tracks))
		for i, track := range playlist.Tracks {
			expectedTrack := expectedPlaylist.Tracks[i]

			assert.Equal(c.t, expectedTrack.SpotifyID, track.SpotifyID)
			assert.Equal(c.t, expectedTrack.Status, track.Status)
		}
	}
}

func (c *Cuke) theFollowingSpotifyTracksExist(tracks *[]spotify.AnalyzedTrack) {
	c.mockSpotify.AddTracks(*tracks)
}

func (c *Cuke) theSpotifyUserHasTheFollowingTracks(userID string, trackIDs []string) {
	assert.NoError(c.t, c.mockSpotify.AddUserTracks(userID, trackIDs))
}

func (c *Cuke) theSpotifyUserHasTheFollowingPlaylists(userID string, expectedPlaylists *[]internal.Playlist) {
	user, ok := c.mockSpotify.User(userID)
	assert.True(c.t, ok)

	assert.Equal(c.t, len(user.Playlists), len(*expectedPlaylists))
	for i, playlist := range user.Playlists {
		expectedPlaylist := (*expectedPlaylists)[i]

		assert.Equal(c.t, expectedPlaylist.Name(), playlist.Name)

		assert.Equal(c.t, len(playlist.Tracks), len(expectedPlaylist.Tracks))
		for i, track := range playlist.Tracks {
			expectedTrack := expectedPlaylist.Tracks[i]

			assert.Equal(c.t, expectedTrack.SpotifyID, track.ID)
		}
	}
}

func (c *Cuke) theUserEmitsTheFollowingStrideEvents(user *internal.User, events *[]internal.StrideEvent) {
	for _, event := range *events {
		event.UserID = user.ID
		_, err := c.db.Model(&event).Insert()
		assert.NoError(c.t, err)

		// this is a bit flaky. when we insert stride events to the db, hasura sends off an event trigger
		// that handles responding to the stride events. given there's no mechanism at the moment to make sure
		// those are processed serially, i'm adding a brief sleep between events. ideally event triggers will
		// be fully processed w/in this time frame.
		time.Sleep(1000 * time.Millisecond)
	}
}

func (c *Cuke) theUserHasTheFollowingPlaybackState(userID string, expected *spotify.CurrentPlayback) {
	user, ok := c.mockSpotify.User(userID)
	assert.True(c.t, ok, "user not found")

	assert.Equal(c.t, *expected, user.CurrentPlayback)
}

func (c *Cuke) theUserWaitsFor(duration time.Duration) {
	time.Sleep(duration)
}

func (c *Cuke) WithT(t *testing.T) *Cuke {
	next := *c
	next.t = t
	return &next
}

func (c *Cuke) given() *Cuke {
	return c
}
func (c *Cuke) when() *Cuke {
	return c
}
func (c *Cuke) then() *Cuke {
	return c
}
func (c *Cuke) and() *Cuke {
	return c
}

func TestLibrarySync(t *testing.T) {
	cuke := Cuke{t: t}
	after, err := cuke.before()
	assert.NoError(t, err)
	defer after()

	cuke.background(func(cuke *Cuke) {
		cuke.given().theFollowSpotifyUsersExist([]string{strideSongs})
	})

	// note: at the moment cuke doesn't take the new `t *testing.T` on a t.Run...
	// i'm not sure at the moment since we only have one test so for now i'm
	// gonna leave it.
	cuke.Run("user syncs their library with stride songs", func(t *testing.T, cuke *Cuke) {
		cuke.given().theFollowSpotifyUsersExist([]string{zach})
		cuke.and().theFollowingSpotifyTracksExist(&[]spotify.AnalyzedTrack{bebey, cheatCode, marilyn, ifYouCall})
		cuke.and().theSpotifyUserHasTheFollowingTracks(zach, []string{bebey.ID, cheatCode.ID, marilyn.ID, ifYouCall.ID})

		user := internal.User{
			LibrarySyncStatus: internal.LibrarySyncStatusPendingRefreshToken,
			SpotifyUserID:     zach,
		}
		cuke.and().theFollowingUserExists(&user)

		cuke.when().theUserSetsTheirRefreshToken(&user, zach+":refresh-token")

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

		cuke.and().theSpotifyUserHasTheFollowingPlaylists("stridesongs", &expectedPlaylists)

	})
}

func TestStrideEvents(t *testing.T) {
	cuke := Cuke{t: t}
	after, err := cuke.before()
	assert.NoError(t, err)
	defer after()

	cuke.background(func(cuke *Cuke) {
		cuke.given().theFollowSpotifyUsersExist([]string{strideSongs, zach})
		user := internal.User{
			SpotifyRefreshToken: zach + ":refresh-token",
			SpotifyUserID:       zach,
			LibrarySyncStatus:   internal.LibrarySyncStatusSucceeded,
			Playlists: []internal.Playlist{
				{
					SPM:       125,
					SpotifyID: "spm-playlist-125",
				},
				{
					SPM:       130,
					SpotifyID: "spm-playlist-130",
				},
			},
		}
		cuke.given().theFollowingUserExists(&user)
	})

	scenarios := []struct {
		name             string
		strideEvents     []internal.StrideEvent
		expectedPlayback spotify.CurrentPlayback
	}{
		{
			name: "start a stride",
			strideEvents: []internal.StrideEvent{
				{Type: internal.StrideEventTypeStart, Payload: map[string]interface{}{"spm": 125}},
			},
			expectedPlayback: spotify.CurrentPlayback{
				IsPlaying:    true,
				ShuffleState: true,
				RepeatState:  spotify.RepeatModeContext,
				Context: spotify.SpotifyContext{
					URI: "spotify:playlist:spm-playlist-125",
				},
			},
		},
		{
			name: "update spm",
			strideEvents: []internal.StrideEvent{
				{Type: internal.StrideEventTypeStart, Payload: map[string]interface{}{"spm": 125}},
				{Type: internal.StrideEventTypeSpmUpdate, Payload: map[string]interface{}{"spm": 130}},
			},
			expectedPlayback: spotify.CurrentPlayback{
				IsPlaying:    true,
				ShuffleState: true,
				RepeatState:  spotify.RepeatModeContext,
				Context: spotify.SpotifyContext{
					URI: "spotify:playlist:spm-playlist-130",
				},
			},
		},
		{
			name: "update to unsupported spm",
			strideEvents: []internal.StrideEvent{
				{Type: internal.StrideEventTypeStart, Payload: map[string]interface{}{"spm": 125}},
				// the user doesn't have a playlist for spm=70
				{Type: internal.StrideEventTypeSpmUpdate, Payload: map[string]interface{}{"spm": 70}},
			},
			expectedPlayback: spotify.CurrentPlayback{
				IsPlaying:    true,
				ShuffleState: true,
				RepeatState:  spotify.RepeatModeContext,
				Context: spotify.SpotifyContext{
					URI: "spotify:playlist:spm-playlist-125",
				},
			},
		},
	}

	for _, scenario := range scenarios {
		cuke.Run(scenario.name, func(t *testing.T, cuke *Cuke) {
			var user internal.User
			assert.NoError(cuke.t, cuke.db.Model(&user).Select())

			cuke.when().theUserEmitsTheFollowingStrideEvents(&user, &scenario.strideEvents)

			// flaky: could use something like assert.Eventually for the state assertions
			// here. also could wait for hasura queue to be finished.
			cuke.then().theUserHasTheFollowingPlaybackState(zach, &scenario.expectedPlayback)
		})
	}
}
