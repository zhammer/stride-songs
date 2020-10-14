package internal

import (
	"github.com/go-pg/pg/v10"
	"github.com/zhammer/stride-songs/pkg/spotify"
)

type StrideSongsOption func(s *StrideSongs)

type StrideSongs struct {
	spotify                  *spotify.Client
	db                       *pg.DB
	strideSongsSpotifyUserID string
}

func (s *StrideSongs) LibrarySyncMachine() *LibrarySyncMachine {
	return &LibrarySyncMachine{s}
}

func (s *StrideSongs) StrideMachine() *StrideMachine {
	return &StrideMachine{s}
}

func WithSpotify(spotify *spotify.Client) StrideSongsOption {
	return func(s *StrideSongs) {
		s.spotify = spotify
	}
}

func WithDB(db *pg.DB) StrideSongsOption {
	return func(s *StrideSongs) {
		s.db = db
	}
}

func WithStrideSongsSpotifyUserID(id string) StrideSongsOption {
	return func(s *StrideSongs) {
		s.strideSongsSpotifyUserID = id
	}
}

func NewStrideSongs(opts ...StrideSongsOption) (*StrideSongs, error) {
	ss := &StrideSongs{}
	for _, opt := range opts {
		opt(ss)
	}
	return ss, nil
}
