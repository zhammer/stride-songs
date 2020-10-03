package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net"
	"net/http"
	"strconv"
	"strings"

	"github.com/google/uuid"
	gmux "github.com/gorilla/mux"
	"github.com/kelseyhightower/envconfig"
	"github.com/zhammer/stride-songs/pkg/spotify"
)

type Playlist struct {
	ID string `json:"id"`
	spotify.CreatePlaylistRequest
	Tracks []spotify.AnalyzedTrack
}

type User struct {
	ID        string `json:"id"`
	Playlists []Playlist
	Tracks    []spotify.AnalyzedTrack
}

func (u *User) Playlist(playlistID string) (*Playlist, bool) {
	for i := range u.Playlists {
		playlist := &u.Playlists[i]
		if playlist.ID == playlistID {
			return playlist, true
		}
	}
	return nil, false
}

type State struct {
	Tracks []spotify.AnalyzedTrack
	Users  []User
}

func (s *State) User(userID string) (*User, bool) {
	for i := range s.Users {
		user := &s.Users[i]
		if user.ID == userID {
			return user, true
		}
	}

	return nil, false
}

type Config struct {
	Port int `default:"7000"`
}

func main() {
	cfg := Config{}
	err := envconfig.Process("", &cfg)
	if err != nil {
		log.Fatal(err)
	}

	state := State{}
	mux := gmux.NewRouter()

	/*
	 * API ROUTES
	 */
	mux.HandleFunc("/v1/users/{userID}/playlists", func(w http.ResponseWriter, r *http.Request) {
		userID := gmux.Vars(r)["userID"]
		user, ok := state.User(userID)
		if !ok {
			fmt.Println("missing user " + userID)
			http.Error(w, "user not found", http.StatusInternalServerError)
			return
		}

		data := spotify.CreatePlaylistRequest{}
		if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
			fmt.Println(err.Error())
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		playlist := Playlist{
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

		user, ok := state.User(userID)
		if !ok {
			fmt.Println("missing user " + userID)
			http.Error(w, "user not found", http.StatusInternalServerError)
			return
		}

		type Item struct {
			Track spotify.AnalyzedTrack `json:"track"`
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

		_, ok := state.User(userID)
		if !ok {
			fmt.Println("missing user " + userID)
			http.Error(w, "user not found", http.StatusInternalServerError)
			return
		}

		var data struct {
			AudioFeatures []spotify.AnalyzedTrack `json:"audio_features"`
		}

		idList := strings.Split(r.URL.Query().Get("ids"), ",")
		ids := make(map[string]bool, len(idList))
		for _, id := range idList {
			ids[id] = true
		}

		for _, track := range state.Tracks {
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
		user, ok := state.User(userID)
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

		var data struct {
			URIs []string `json:"uris"`
		}
		if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
			fmt.Println(err.Error())
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		tracks := make([]spotify.AnalyzedTrack, len(data.URIs))
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
		user, ok := state.User(userID)
		if !ok {
			fmt.Println("missing user " + userID)
			http.Error(w, "user not found", http.StatusInternalServerError)
			return
		}

		data := spotify.AuthResponse{
			AccessToken: user.ID + ":" + "access-token",
		}
		if err := json.NewEncoder(w).Encode(&data); err != nil {
			fmt.Println(err.Error())
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	})

	/*
	 * TEST ROUTES
	 */
	mux.HandleFunc("/_test/users", func(w http.ResponseWriter, r *http.Request) {
		var data struct {
			Users []User `json:"users"`
		}
		if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		state.Users = append(state.Users, data.Users...)
	}).Methods("PUT")

	mux.HandleFunc("/_test/clear", func(w http.ResponseWriter, r *http.Request) {
		state = State{}
	})

	mux.HandleFunc("/_test/user_tracks", func(w http.ResponseWriter, r *http.Request) {
		var data struct {
			UserID string `json:"user_id"`
			Tracks []spotify.AnalyzedTrack
		}
		if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
			fmt.Println(err.Error())
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		user, ok := state.User(data.UserID)
		if !ok {
			fmt.Println("missing user " + data.UserID)
			http.Error(w, "user not found", http.StatusInternalServerError)
			return
		}

		user.Tracks = data.Tracks
		state.Tracks = append(state.Tracks, user.Tracks...)

	}).Methods("PUT")

	http.ListenAndServe(net.JoinHostPort("", strconv.Itoa(cfg.Port)), mux)
}
