package src

import (
	"context"
	"errors"
)

type StrideSongs struct {
	spotify   Spotify
	datastore Datastore
}

type Spotify interface {
	AuthFlow(ctx context.Context, authorizationCode string) (*SpotifyAuthFlowResponse, error)
	WithRefreshTokenAuth(ctx context.Context, refreshToken string) (context.Context, error)
	Me(ctx context.Context) (*SpotifyUser, error)
}

type Datastore interface {
	User(ctx context.Context, spotifyUser SpotifyUser) (*User, error)
	CreateUser(ctx context.Context, spotifyUser SpotifyUser) (*User, error)
}

func (s *StrideSongs) SpotifyAuthFlow(ctx context.Context, authorizationCode string) (*SpotifyAuthFlowResponse, error) {
	resp, err := s.spotify.AuthFlow(ctx, authorizationCode)
	return resp, err
}

// Login returns the Stride Songs user associated with a given spotify user given a
// refresh token for that spotify user (acquired in a spotify oauth flow).
//
// If the spotify user has never logged into Stride Songs before, this creates the
// user.
func (s *StrideSongs) Login(ctx context.Context, spotifyRefreshToken string) (*User, error) {
	ctx, err := s.spotify.WithRefreshTokenAuth(ctx, spotifyRefreshToken)
	if err != nil {
		return nil, err
	}

	spotifyUser, err := s.spotify.Me(ctx)
	if err != nil {
		return nil, err
	}

	user, err := s.datastore.User(ctx, *spotifyUser)
	// found user for spotify user, return found user
	if err == nil {
		return user, nil
	}
	// unknown error finding user, return err
	if !errors.Is(err, ErrNotFound) {
		return nil, err
	}
	// user not found, create user
	user, err = s.datastore.CreateUser(ctx, *spotifyUser)
	return user, err
}

func NewStrideSongs(spotify Spotify, datastore Datastore) (*StrideSongs, error) {
	return &StrideSongs{
		spotify:   spotify,
		datastore: datastore,
	}, nil
}
