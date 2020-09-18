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
	playlistTrackStatusPendingAdd = playlistTrackStatus("pending_add")
	playlistTrackStatusAdded      = playlistTrackStatus("added")
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
}
