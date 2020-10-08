package main

import (
	"context"
	"log"
	"net"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/go-pg/pg/v10"
	"github.com/zhammer/stride-songs/internal"
	"github.com/zhammer/stride-songs/pkg/database"
	"github.com/zhammer/stride-songs/pkg/spotify"
)

func TestLibrarySync(t *testing.T) {
	// setup mock spotify server
	l, err := net.Listen("tcp", "127.0.0.1:6000")
	if err != nil {
		t.Fatal(err)
	}
	mockSpotify := spotify.NewMockSpotify()
	mockSpotifyServer := httptest.NewUnstartedServer(mockSpotify.Mux())
	mockSpotifyServer.Listener.Close()
	mockSpotifyServer.Listener = l
	mockSpotifyServer.Start()
	defer mockSpotifyServer.Close()

	// connect to database
	db := pg.Connect(&pg.Options{
		Addr:     "localhost:5432",
		User:     "stridesongs",
		Password: "password",
		Database: "stridesongs",
	})
	if err := db.Ping(context.Background()); err != nil {
		t.Fatal(err.Error())
	}

	// to run before each test case
	beforeEach := func() error {
		if err := database.Clear(db); err != nil {
			return err
		}

		mockSpotify.Clear()

		return nil
	}

	t.Run("happy path", func(t *testing.T) {
		beforeEach()

		// given the following user exists in spotify
		mockSpotify.AddUser("user")
		mockSpotify.AddUser("stridesongs")

		// given a user
		user := internal.User{
			LibrarySyncStatus: internal.LibrarySyncStatusPendingRefreshToken,
		}
		if _, err := db.Model(&user).Insert(); err != nil {
			t.Fatal(err)
		}

		// when we set their refresh token
		user.SpotifyRefreshToken = "user:refresh-token"
		if _, err := db.Model(&user).Where("id = ?id").Update(); err != nil {
			t.Fatal(err)
		}

		success := make(chan bool, 1)
		go func() {
			for {
				t.Log("checking status!")
				user := internal.User{ID: user.ID}
				if err := db.Model(&user).Where("id = ?id").Select(); err != nil {
					t.Log(err)
				}

				switch user.LibrarySyncStatus {
				case internal.LibrarySyncStatusSucceeded:
					success <- true
					return
				default:
					t.Logf("status is %s, will query again", user.LibrarySyncStatus)
					time.Sleep(1 * time.Second)
				}
			}
		}()

		select {
		case <-success:
			break
		case <-time.After(30 * time.Second):
			log.Fatal("timed out")
		}
	})
}
