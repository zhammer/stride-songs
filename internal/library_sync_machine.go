package internal

import (
	"context"
	"fmt"

	"github.com/go-pg/pg/v10"
	"github.com/zhammer/stride-songs/pkg/spotify"
)

type librarySyncStatus string

const (
	LibrarySyncStatusPendingRefreshToken = librarySyncStatus("pending_refresh_token")
	LibrarySyncStatusCreatingPlaylists   = librarySyncStatus("creating_playlists")
	LibrarySyncStatusScanningLibrary     = librarySyncStatus("scanning_library")
	LibrarySyncStatusAddingTracks        = librarySyncStatus("adding_tracks")
	LibrarySyncStatusSucceeded           = librarySyncStatus("succeeded")
)

type LibrarySyncMachine struct {
	*StrideSongs
}

func (sm *LibrarySyncMachine) HandleStateUpdate(ctx context.Context, old User, new User) error {
	switch new.LibrarySyncStatus {
	case LibrarySyncStatusPendingRefreshToken:
		return nil
	case LibrarySyncStatusCreatingPlaylists:
		return sm.createPlaylists(ctx, old, new)
	case LibrarySyncStatusScanningLibrary:
		return sm.scanLibrary(ctx, old, new)
	case LibrarySyncStatusAddingTracks:
		return sm.addTracks(ctx, old, new)
	case LibrarySyncStatusSucceeded:
		return nil
	default:
		return fmt.Errorf("unrecognized library sync status: %s", new.LibrarySyncStatus)
	}
}

func (sm *LibrarySyncMachine) createPlaylists(ctx context.Context, old User, new User) error {
	ctx, err := sm.spotify.WithUserAccessToken(ctx, new.SpotifyRefreshToken)
	if err != nil {
		return err
	}

	ctx, err = sm.spotify.WithStrideSongsAccessToken(ctx)
	if err != nil {
		return err
	}

	playlists := createInitialPlaylists(new)

	for i := range playlists {
		playlist := &playlists[i]
		inp := spotify.CreatePlaylistRequest{
			Name:          playlist.Name(),
			Public:        false,
			Collaborative: false,
			UserID:        sm.strideSongsSpotifyUserID,
		}
		spotifyPlaylist, err := sm.spotify.CreatePlaylist(ctx, inp, spotify.WithStrideSongsAccessToken())
		if err != nil {
			return err
		}

		playlist.SpotifyID = spotifyPlaylist.ID
	}

	if err := sm.db.RunInTransaction(ctx, func(tx *pg.Tx) error {

		if _, err := tx.Model(&playlists).Insert(); err != nil {
			return err
		}

		if _, err := tx.Model(&new).
			Set("library_sync_status = ?", LibrarySyncStatusScanningLibrary).
			WherePK().
			Update(); err != nil {
			return err
		}

		return nil
	}); err != nil {
		return err
	}

	return nil
}

func (sm *LibrarySyncMachine) scanLibrary(ctx context.Context, old User, new User) error {
	ctx, err := sm.spotify.WithUserAccessToken(ctx, new.SpotifyRefreshToken)
	if err != nil {
		return err
	}

	userTracks, err := sm.spotify.AllUserTracks(ctx)
	if err != nil {
		return nil
	}

	analyzedTracks, err := sm.spotify.AnalyzedTracks(ctx, userTracks)
	if err != nil {
		return err
	}

	var playlists []Playlist
	if err := sm.db.Model(&playlists).Where("user_id = ?", new.ID).Select(); err != nil {
		return err
	}

	groupTracks(playlists, analyzedTracks)

	if err := sm.db.RunInTransaction(ctx, func(tx *pg.Tx) error {
		for _, playlist := range playlists {
			if len(playlist.Tracks) == 0 {
				continue
			}
			if _, err := tx.Model(&playlist.Tracks).Insert(); err != nil {
				return err
			}
		}

		if _, err := tx.Model(&new).
			Set("library_sync_status = ?", LibrarySyncStatusAddingTracks).
			WherePK().
			Update(); err != nil {
			return err
		}
		return nil
	}); err != nil {
		return err
	}

	return nil
}

func (sm *LibrarySyncMachine) addTracks(ctx context.Context, old User, new User) error {
	var playlists []Playlist
	if err := sm.db.Model(&playlists).
		Where("user_id = ?", new.ID).
		Relation("Tracks", withWhere("status = ?", PlaylistTrackStatusPendingAdd)).
		Select(); err != nil {
		return err
	}

	ctx, err := sm.spotify.WithStrideSongsAccessToken(ctx)
	if err != nil {
		return err
	}

	for _, playlist := range playlists {
		request := spotify.AddTracksToPlaylistRequest{
			PlaylistID: playlist.SpotifyID,
			Tracks:     toSpotifyTracks(playlist.Tracks),
		}
		if err := sm.spotify.AddTracksToPlaylist(ctx, request, spotify.WithStrideSongsAccessToken()); err != nil {
			return err
		}
	}

	err = sm.db.RunInTransaction(ctx, func(tx *pg.Tx) error {
		for _, playlist := range playlists {
			if len(playlist.Tracks) == 0 {
				continue
			}
			_, err := tx.Model(&playlist.Tracks).Set("status = ?", PlaylistTrackStatusAdded).Update()
			if err != nil {
				return err
			}
		}

		if _, err := tx.Model(&new).
			Set("library_sync_status = ?", LibrarySyncStatusSucceeded).
			WherePK().
			Update(); err != nil {
			return err
		}

		return nil
	})
	if err != nil {
		return err
	}

	return nil
}

func toSpotifyTracks(tracks []PlaylistTrack) []spotify.Track {
	spotifyTracks := make([]spotify.Track, len(tracks))

	for i, track := range tracks {
		spotifyTracks[i] = spotify.Track{ID: track.SpotifyID}
	}

	return spotifyTracks
}
