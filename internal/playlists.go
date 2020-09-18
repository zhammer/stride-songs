package internal

import (
	"fmt"
	"math"
	"sync"

	"github.com/zhammer/stride-songs/pkg/spotify"
)

var spms = []int{
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
	playlists := make([]Playlist, len(spms))
	for i, spm := range spms {
		playlists[i] = Playlist{
			SPM:       spm,
			UserID:    user.ID,
			SpotifyID: fmt.Sprintf("TODO-%d", spm),
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
						Status:     playlistTrackStatusPendingAdd,
					})
				}
			}
			wg.Done()
		}(&playlists[i])
	}
	wg.Wait()
}
