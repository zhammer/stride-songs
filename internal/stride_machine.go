package internal

import (
	"context"
	"fmt"

	"github.com/mitchellh/mapstructure"
	"github.com/zhammer/stride-songs/pkg/spotify"
)

type StrideMachine struct {
	*StrideSongs
}

// event-specific payloads

type startPayload struct {
	// spm to start stride at
	SPM int `mapstructure:"spm"`
}

type spmUpdatePayload struct {
	// new spm
	SPM int `mapstructure:"spm"`
}

func (sm *StrideMachine) HandleStrideEvent(ctx context.Context, event StrideEvent) error {
	// load relations
	if err := sm.db.Model(&event).WherePK().Relation("User").Relation("User.Playlists").Select(); err != nil {
		return err
	}

	if event.User.LibrarySyncStatus != LibrarySyncStatusSucceeded {
		return fmt.Errorf("can't handle stride events until user's library sync has succeeded")
	}

	switch event.Type {
	case strideEventTypeStart:
		return sm.handleStrideEventStart(ctx, event)
	case strideEventTypeFinish:
		return sm.handleStrideEventFinish(ctx, event)
	case strideEventTypeSpmUpdate:
		return sm.handleStrideEventSpmUpdate(ctx, event)
	default:
		return fmt.Errorf("unrecognized stride event type: %s", event.Type)
	}
}

func (sm *StrideMachine) handleStrideEventStart(ctx context.Context, event StrideEvent) error {
	// pluck payload
	payload := startPayload{}
	if err := mapstructure.Decode(&event.Payload, &payload); err != nil {
		return err
	}

	playlist, ok := event.User.PlaylistAtSPM(payload.SPM)
	if !ok {
		return fmt.Errorf("no playlist for user %d found at spm %d", event.User.ID, payload.SPM)
	}

	ctx, err := sm.spotify.WithUserAccessToken(ctx, event.User.SpotifyRefreshToken)
	if err != nil {
		return nil
	}

	if err := sm.spotify.SetRepeatMode(ctx, spotify.RepeatModeContext); err != nil {
		return err
	}
	if err := sm.spotify.ToggleShuffle(ctx, true); err != nil {
		return err
	}
	if err := sm.spotify.Play(ctx, spotify.PlayRequest{
		ItemType: spotify.ItemTypePlaylist,
		ItemID:   playlist.SpotifyID,
	}); err != nil {
		return err
	}

	return nil
}

func (sm *StrideMachine) handleStrideEventFinish(ctx context.Context, event StrideEvent) error {
	// nothing to be done here for now
	return nil
}

func (sm *StrideMachine) handleStrideEventSpmUpdate(ctx context.Context, event StrideEvent) error {
	// pluck payload
	payload := spmUpdatePayload{}
	if err := mapstructure.Decode(&event.Payload, &payload); err != nil {
		return err
	}

	playlist, ok := event.User.PlaylistAtSPM(payload.SPM)
	if !ok {
		return fmt.Errorf("no playlist for user %d found at spm %d", event.User.ID, payload.SPM)
	}

	ctx, err := sm.spotify.WithUserAccessToken(ctx, event.User.SpotifyRefreshToken)
	if err != nil {
		return nil
	}

	if err := sm.spotify.Play(ctx, spotify.PlayRequest{
		ItemType: spotify.ItemTypePlaylist,
		ItemID:   playlist.SpotifyID,
	}); err != nil {
		return err
	}

	return nil
}
