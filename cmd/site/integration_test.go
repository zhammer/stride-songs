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

type tester struct {
	mockSpotify       *spotify.MockSpotify
	mockSpotifyServer *httptest.Server
	db                *pg.DB
}

func (t *tester) before() (func(), error) {
	// setup mock spotify server
	l, err := net.Listen("tcp", "127.0.0.1:6000")
	if err != nil {
		return nil, err
	}
	t.mockSpotify = spotify.NewMockSpotify()
	t.mockSpotifyServer = httptest.NewUnstartedServer(t.mockSpotify.Mux())
	t.mockSpotifyServer.Listener.Close()
	t.mockSpotifyServer.Listener = l
	t.mockSpotifyServer.Start()

	// setup db
	t.db = pg.Connect(&pg.Options{
		Addr:     "localhost:5432",
		User:     "stridesongs",
		Password: "password",
		Database: "stridesongs",
	})
	if err := t.db.Ping(context.Background()); err != nil {
		return nil, err
	}

	return func() {
		t.mockSpotifyServer.Close()
	}, nil
}

func (t *tester) beforeEach() error {
	if err := database.Clear(t.db); err != nil {
		return err
	}

	t.mockSpotify.Clear()

	return nil
}

func (t *tester) theFollowingUserExists(user *internal.User) error {
	if _, err := t.db.Model(user).Insert(); err != nil {
		return err
	}
	return nil
}

func (t *tester) theFollowSpotifyUsersExist(userIDs []string) error {
	for _, id := range userIDs {
		t.mockSpotify.AddUser(id)
	}
	return nil
}

func (t *tester) theUserSetsTheirRefreshToken(user *internal.User, refreshToken string) error {
	user.SpotifyRefreshToken = "zach:refresh-token"
	if _, err := t.db.Model(user).Where("id = ?id").Update(); err != nil {
		return err
	}
	return nil
}

func (t *tester) theUserWaitsForLibrarySyncToSucceed(user *internal.User) error {
	success := make(chan bool, 1)
	errCh := make(chan error, 1)
	go func() {
		for {
			if err := t.db.Model(user).Where("id = ?id").Select(); err != nil {
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
}

func (t *tester) given() *tester {
	return t
}
func (t *tester) when() *tester {
	return t
}
func (t *tester) then() *tester {
	return t
}
func (t *tester) and() *tester {
	return t
}

func TestLibrarySync(t *testing.T) {
	tester := tester{}
	after, err := tester.before()
	assert.NoError(t, err)
	defer after()

	t.Run("happy path", func(t *testing.T) {
		assert.NoError(t, tester.beforeEach())

		assert.NoError(t, tester.given().theFollowSpotifyUsersExist([]string{"zach", "stridesongs"}))

		user := internal.User{
			LibrarySyncStatus: internal.LibrarySyncStatusPendingRefreshToken,
		}
		assert.NoError(t, tester.and().theFollowingUserExists(&user))

		assert.NoError(t, tester.when().theUserSetsTheirRefreshToken(&user, "zach:refresh-token"))

		assert.NoError(t, tester.and().theUserWaitsForLibrarySyncToSucceed(&user))

	})
}
