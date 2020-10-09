package internal

import (
	"math"
	"sync"

	"github.com/zhammer/stride-songs/pkg/spotify"
)

var SPMs = []int{
	125,
	130,
	135,
	140,
	145,
	150,
	155,
	160,
	165,
	170,
	175,
	180,
	185,
	190,
	195,
	200,
}

func spread(list []interface{}) []interface{} {
	return list
}

func createInitialPlaylists(user User) []Playlist {
	playlists := make([]Playlist, len(SPMs))
	for i, spm := range SPMs {
		playlists[i] = Playlist{
			SPM:    spm,
			UserID: user.ID,
		}
	}
	return playlists
}

func groupTracks(playlists []Playlist, tracks []spotify.AnalyzedTrack) {
	wg := sync.WaitGroup{}
	wg.Add(len(playlists))
	for i := range playlists {
		go func(playlist *Playlist) {
			for _, track := range tracks {
				// track's tempo must be close to the playlist's SPM
				if math.Abs(float64(playlist.SPM)-track.Tempo) < 1 {
					playlist.Tracks = append(playlist.Tracks, PlaylistTrack{
						PlaylistID: playlist.ID,
						SpotifyID:  track.ID,
						Status:     PlaylistTrackStatusPendingAdd,
					})
				}
			}
			wg.Done()
		}(&playlists[i])
	}
	wg.Wait()
}
