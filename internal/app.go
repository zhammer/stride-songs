package internal

import (
	"context"

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

func (s *StrideSongs) DemoLogIn(ctx context.Context, spotifyAuthorizationCode string) (*User, error) {
	auth, err := s.spotify.Auth(ctx, spotifyAuthorizationCode)
	if err != nil {
		return nil, err
	}

	ctx, err = s.spotify.WithUserAccessTokenDirect(ctx, auth.AccessToken)
	if err != nil {
		return nil, err
	}

	me, err := s.spotify.Me(ctx)
	if err != nil {
		return nil, err
	}

	user := User{
		SpotifyRefreshToken: auth.RefreshToken,
		SpotifyUserID:       me.ID,
		LibrarySyncStatus:   LibrarySyncStatusCreatingPlaylists,
	}
	_, err = s.db.Model(&user).
		Where("spotify_user_id = ?spotify_user_id").
		OnConflict("DO NOTHING").
		SelectOrInsert()
	if err != nil {
		return nil, err
	}

	return &user, nil
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
