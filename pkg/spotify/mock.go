package spotify

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"strings"

	gmux "github.com/gorilla/mux"
)

type mockPlaylist struct {
	ID string `json:"id"`
	CreatePlaylistRequest
	Tracks []*AnalyzedTrack
}

type mockUser struct {
	ID              string `json:"id"`
	Playlists       []mockPlaylist
	Tracks          []*AnalyzedTrack
	CurrentPlayback CurrentPlayback
}

func (u *mockUser) Playlist(playlistID string) (*mockPlaylist, bool) {
	for i := range u.Playlists {
		playlist := &u.Playlists[i]
		if playlist.ID == playlistID {
			return playlist, true
		}
	}
	return nil, false
}

type MockSpotify struct {
	Tracks []AnalyzedTrack
	Users  []mockUser
}

func (s *MockSpotify) User(userID string) (*mockUser, bool) {
	for i := range s.Users {
		user := &s.Users[i]
		if user.ID == userID {
			return user, true
		}
	}

	return nil, false
}

func (s *MockSpotify) Track(trackID string) (*AnalyzedTrack, bool) {
	for i := range s.Tracks {
		track := &s.Tracks[i]
		if track.ID == trackID {
			return track, true
		}
	}
	return nil, false
}

func (s *MockSpotify) AddUser(userID string) {
	s.Users = append(s.Users, mockUser{ID: userID})
}

func (s *MockSpotify) AddTracks(tracks []AnalyzedTrack) {
	s.Tracks = append(s.Tracks, tracks...)
}

func (s *MockSpotify) AddUserTracks(userID string, trackIDs []string) error {
	user, ok := s.User(userID)
	if !ok {
		return fmt.Errorf("user %s not found", userID)
	}

	for _, trackID := range trackIDs {
		track, ok := s.Track(trackID)
		if !ok {
			return fmt.Errorf("track %s not found", trackID)
		}
		user.Tracks = append(user.Tracks, track)
	}

	return nil
}

func (s *MockSpotify) Clear() {
	s = &MockSpotify{}
}

func (s *MockSpotify) userFromRequest(r *http.Request) (*mockUser, error) {
	token := r.Header.Get("Authorization")[7:]
	parts := strings.Split(token, ":")
	userID := parts[0]
	user, ok := s.User(userID)
	if !ok {
		return nil, fmt.Errorf("user not found")
	}
	return user, nil
}

func (s *MockSpotify) Mux() http.Handler {
	mux := gmux.NewRouter()

	mux.HandleFunc("/_status", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("OK!\n"))
	})

	/*
	 * API ROUTES
	 */
	mux.HandleFunc("/v1/users/{userID}/playlists", func(w http.ResponseWriter, r *http.Request) {
		userID := gmux.Vars(r)["userID"]
		user, ok := s.User(userID)
		if !ok {
			fmt.Println("missing user " + userID)
			http.Error(w, "user not found", http.StatusInternalServerError)
			return
		}

		data := CreatePlaylistRequest{}
		if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
			fmt.Println(err.Error())
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		playlist := mockPlaylist{
			ID:                    fmt.Sprintf("IDFOR:%s", data.Name),
			CreatePlaylistRequest: data,
		}
		user.Playlists = append(user.Playlists, playlist)

		if err := json.NewEncoder(w).Encode(&playlist); err != nil {
			fmt.Println(err.Error())
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}).Methods("POST")

	mux.HandleFunc("/v1/me/tracks", func(w http.ResponseWriter, r *http.Request) {
		user, err := s.userFromRequest(r)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		type Item struct {
			Track AnalyzedTrack `json:"track"`
		}
		var data struct {
			Items []Item `json:"items"`
		}
		for _, track := range user.Tracks {
			data.Items = append(data.Items, Item{*track})
		}

		if err := json.NewEncoder(w).Encode(&data); err != nil {
			fmt.Println(err.Error())
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	})

	mux.HandleFunc("/v1/audio-features", func(w http.ResponseWriter, r *http.Request) {
		_, err := s.userFromRequest(r)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		var data struct {
			AudioFeatures []AnalyzedTrack `json:"audio_features"`
		}

		idList := strings.Split(r.URL.Query().Get("ids"), ",")
		ids := make(map[string]bool, len(idList))
		for _, id := range idList {
			ids[id] = true
		}

		for _, track := range s.Tracks {
			if _, ok := ids[track.ID]; ok {
				data.AudioFeatures = append(data.AudioFeatures, track)
			}
		}

		if err := json.NewEncoder(w).Encode(&data); err != nil {
			fmt.Println(err.Error())
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	})

	mux.HandleFunc("/v1/playlists/{playlistID}/tracks", func(w http.ResponseWriter, r *http.Request) {
		playlistID := gmux.Vars(r)["playlistID"]

		user, err := s.userFromRequest(r)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		playlist, ok := user.Playlist(playlistID)
		if !ok {
			fmt.Println("can't find playlist " + playlistID)
			http.Error(w, "can't find playlist", http.StatusInternalServerError)
			return
		}

		var data addTracksToPlaylistRequest
		if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
			fmt.Println(err.Error())
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		tracks := make([]*AnalyzedTrack, len(data.URIs))
		for i, uri := range data.URIs {
			id := strings.Split(uri, ":")[2]
			if track, ok := s.Track(id); ok {
				tracks[i] = track
			}
		}

		playlist.Tracks = append(playlist.Tracks, tracks...)
		w.WriteHeader(http.StatusCreated)
	})

	mux.HandleFunc("/v1/me/player/play", func(w http.ResponseWriter, r *http.Request) {
		user, err := s.userFromRequest(r)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		var data playRequest
		if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
			fmt.Println(err.Error())
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		user.CurrentPlayback.IsPlaying = true
		user.CurrentPlayback.Context.URI = data.ContextURI

		w.WriteHeader(http.StatusNoContent)
	}).Methods("PUT")

	mux.HandleFunc("/v1/me/player/repeat", func(w http.ResponseWriter, r *http.Request) {
		user, err := s.userFromRequest(r)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		state := repeatMode(r.URL.Query().Get("state"))
		if state == "" {
			http.Error(w, "missing 'state' query param", http.StatusBadRequest)
			return
		}

		user.CurrentPlayback.RepeatState = state

		w.WriteHeader(http.StatusNoContent)
	}).Methods("PUT")

	mux.HandleFunc("/v1/me/player/shuffle", func(w http.ResponseWriter, r *http.Request) {
		user, err := s.userFromRequest(r)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		state, err := strconv.ParseBool(r.URL.Query().Get("state"))
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		user.CurrentPlayback.ShuffleState = state

		w.WriteHeader(http.StatusNoContent)
	}).Methods("PUT")

	/*
	 * AUTH ROUTES
	 */
	mux.HandleFunc("/api/token", func(w http.ResponseWriter, r *http.Request) {
		if err := r.ParseForm(); err != nil {
			fmt.Println(err.Error())
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		refreshToken := r.FormValue("refresh_token")
		parts := strings.Split(refreshToken, ":")
		if len(parts) != 2 || parts[1] != "refresh-token" {
			fmt.Println("invalid refresh token " + refreshToken)
			http.Error(w, refreshToken, http.StatusInternalServerError)
			return
		}

		userID := parts[0]
		user, ok := s.User(userID)
		if !ok {
			fmt.Println("missing user " + userID)
			http.Error(w, "user not found", http.StatusInternalServerError)
			return
		}

		data := AuthResponse{
			AccessToken: user.ID + ":" + "access-token",
		}
		if err := json.NewEncoder(w).Encode(&data); err != nil {
			fmt.Println(err.Error())
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	})

	return mux
}

func NewMockSpotify() *MockSpotify {
	return &MockSpotify{}
}
