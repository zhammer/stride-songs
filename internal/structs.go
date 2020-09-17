package internal

import "github.com/zhammer/stride-songs/pkg/spotify"

type SPMPlaylist struct {
	SPM    int                     `json:"spm"`
	Tracks []spotify.AnalyzedTrack `json:"tracks"`
}
