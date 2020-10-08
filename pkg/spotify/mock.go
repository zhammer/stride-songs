package spotify

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/google/uuid"
	gmux "github.com/gorilla/mux"
)

type mockPlaylist struct {
	ID string `json:"id"`
	CreatePlaylistRequest
	Tracks []AnalyzedTrack
}

type mockUser struct {
	ID        string `json:"id"`
	Playlists []mockPlaylist
	Tracks    []AnalyzedTrack
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

type mockSpotify struct {
	Tracks []AnalyzedTrack
	Users  []mockUser
}

func (s *mockSpotify) User(userID string) (*mockUser, bool) {
	for i := range s.Users {
		user := &s.Users[i]
		if user.ID == userID {
			return user, true
		}
	}

	return nil, false
}

func (s *mockSpotify) AddUser(userID string) {
	s.Users = append(s.Users, mockUser{ID: userID})
}

func (s *mockSpotify) Clear() {
	s = &mockSpotify{}
}

func (s *mockSpotify) Mux() http.Handler {
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
			ID:                    uuid.New().String(),
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
		token := r.Header.Get("Authorization")[7:]
		parts := strings.Split(token, ":")
		userID := parts[0]

		user, ok := s.User(userID)
		if !ok {
			fmt.Println("missing user " + userID)
			http.Error(w, "user not found", http.StatusInternalServerError)
			return
		}

		type Item struct {
			Track AnalyzedTrack `json:"track"`
		}
		var data struct {
			Items []Item `json:"items"`
		}
		for _, track := range user.Tracks {
			data.Items = append(data.Items, Item{track})
		}

		if err := json.NewEncoder(w).Encode(&data); err != nil {
			fmt.Println(err.Error())
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	})

	mux.HandleFunc("/v1/audio-features", func(w http.ResponseWriter, r *http.Request) {
		token := r.Header.Get("Authorization")[7:]
		parts := strings.Split(token, ":")
		userID := parts[0]

		_, ok := s.User(userID)
		if !ok {
			fmt.Println("missing user " + userID)
			http.Error(w, "user not found", http.StatusInternalServerError)
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

		token := r.Header.Get("Authorization")[7:]
		parts := strings.Split(token, ":")
		userID := parts[0]
		user, ok := s.User(userID)
		if !ok {
			fmt.Println("missing user " + userID)
			http.Error(w, "user not found", http.StatusInternalServerError)
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

		tracks := make([]AnalyzedTrack, len(data.URIs))
		for i, uri := range data.URIs {
			id := strings.Split(uri, ":")[2]
			for _, track := range user.Tracks {
				if track.ID == id {
					tracks[i] = track
				}
			}
		}

		playlist.Tracks = append(playlist.Tracks, tracks...)
		w.WriteHeader(http.StatusCreated)
	})

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

func NewMockSpotify() *mockSpotify {
	return &mockSpotify{}
}
