package internal

import "fmt"

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
	strideEventTypeStart     = strideEventType("START")
	strideEventTypeFinish    = strideEventType("FINISH")
	strideEventTypeSpmUpdate = strideEventType("SPM_UPDATE")
)

type StrideEvent struct {
	Id      int
	UserID  int   `json:"user_id"`
	User    *User `pg:"rel:has-one"`
	Type    strideEventType
	Payload map[string]interface{}
}
