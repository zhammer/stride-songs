package internal

import (
	"fmt"

	"github.com/mitchellh/mapstructure"
)

type Playlist struct {
	ID        int
	SPM       int `json:"spm"`
	UserID    int
	SpotifyID string
	Tracks    []PlaylistTrack `pg:"rel:has-many"`
}

func (p *Playlist) Name() string {
	return fmt.Sprintf("%dspm - Stride Songs", p.SPM)
}

type playlistTrackStatus string

const (
	PlaylistTrackStatusPendingAdd = playlistTrackStatus("pending_add")
	PlaylistTrackStatusAdded      = playlistTrackStatus("added")
)

type PlaylistTrack struct {
	PlaylistID int    `pg:",pk"`
	SpotifyID  string `pg:",pk"`
	Status     playlistTrackStatus
}

type User struct {
	ID                  int               `json:"id"`
	SpotifyRefreshToken string            `json:"spotify_refresh_token"`
	LibrarySyncStatus   librarySyncStatus `json:"library_sync_status"`
	Playlists           []Playlist        `pg:"rel:has-many"`
}

func (u *User) PlaylistAtSPM(spm int) (*Playlist, bool) {
	for i := range u.Playlists {
		playlist := &u.Playlists[i]
		if playlist.SPM == spm {
			return playlist, true
		}
	}

	return nil, false
}

type strideEventType string

const (
	StrideEventTypeStart     = strideEventType("START")
	StrideEventTypeFinish    = strideEventType("FINISH")
	StrideEventTypeSpmUpdate = strideEventType("SPM_UPDATE")
)

type StrideEvent struct {
	ID      int
	UserID  int   `json:"user_id"`
	User    *User `pg:"rel:has-one"`
	Type    strideEventType
	Payload map[string]interface{}
}

// event-specific payloads

type StartPayload struct {
	// spm to start stride at
	SPM int `mapstructure:"spm"`
}

type SPMUpdatePayload struct {
	// new spm
	SPM int `mapstructure:"spm"`
}

func (s *StrideEvent) StartPayload() (StartPayload, error) {
	payload := StartPayload{}
	if s.Type != StrideEventTypeStart {
		return payload, fmt.Errorf("invalid type for StartPayload: %s", s.Type)
	}

	if err := mapstructure.Decode(&s.Payload, &payload); err != nil {
		return payload, err
	}

	return payload, nil
}

func (s *StrideEvent) SPMUpdatePayload() (SPMUpdatePayload, error) {
	payload := SPMUpdatePayload{}
	if s.Type != StrideEventTypeSpmUpdate {
		return payload, fmt.Errorf("invalid type for SPMUpdatePayload: %s", s.Type)
	}

	if err := mapstructure.Decode(&s.Payload, &payload); err != nil {
		return payload, err
	}

	return payload, nil
}
