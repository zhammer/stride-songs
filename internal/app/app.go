package app

import (
	"context"

	"github.com/zhammer/stride-songs/pkg/spotify"
)

type StrideSongsOption func(s *StrideSongs)

type StrideSongs struct {
	spotify *spotify.Client
}

func (s *StrideSongs) GeneratePlaylists(ctx context.Context, refreshToken string) ([]SPMPlaylist, error) {
	ctx, err := s.spotify.WithRefreshTokenAuth(ctx, refreshToken)
	if err != nil {
		return nil, err
	}

	userTracks, err := s.spotify.AllUserTracks(ctx)
	if err != nil {
		return nil, err
	}

	analyzedTracks, err := s.spotify.AnalyzedTracks(ctx, userTracks)
	if err != nil {
		return nil, err
	}

	playlists := groupPlaylists(analyzedTracks)

	return playlists, nil
}

func WithSpotify(spotify *spotify.Client) StrideSongsOption {
	return func(s *StrideSongs) {
		s.spotify = spotify
	}
}

func NewStrideSongs(opts ...StrideSongsOption) (*StrideSongs, error) {
	ss := &StrideSongs{}
	for _, opt := range opts {
		opt(ss)
	}
	return ss, nil
}
