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
}

type User struct {
	ID        string `json:"id"`
	Playlists []Playlist
	Tracks    []spotify.AnalyzedTrack
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
