package app

import (
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

func groupPlaylists(tracks []spotify.AnalyzedTrack) []SPMPlaylist {
	playlists := make([]SPMPlaylist, len(spms))
	for i, spm := range spms {
		playlists[i] = SPMPlaylist{SPM: spm}
	}

	wg := sync.WaitGroup{}
	wg.Add(len(playlists))
	for i := range playlists {
		go func(playlist *SPMPlaylist) {
			for _, track := range tracks {
				// track's tempo must be close to the playlist's SPM
				if math.Abs(float64(playlist.SPM)-track.Tempo) < 1 {
					playlist.Tracks = append(playlist.Tracks, track)
				}
			}
			wg.Done()
		}(&playlists[i])
	}
	wg.Wait()

	return playlists
}
