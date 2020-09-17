package main

import (
	"encoding/json"
	"html/template"
	"log"
	"net"
	"net/http"
	"strconv"
	"strings"

	_ "github.com/joho/godotenv/autoload"
	"github.com/kelseyhightower/envconfig"

	"github.com/zhammer/stride-songs/internal"
	"github.com/zhammer/stride-songs/pkg/spotify"
)

type Config struct {
	Port                    int    `default:"3000"`
	RedirectURI             string `default:"http://127.0.0.1:3000/callback"`
	SpotifyClientID         string `envconfig:"spotify_client_id" required:"true"`
	SpotifyClientSecret     string `envconfig:"spotify_client_secret" required:"true"`
	StrideSongsRefreshToken string `envconfig:"stride_songs_refresh_token" required:"true"`
}

type IndexPage struct {
	SpotifyClientID string
	RedirectURI     string
	Scopes          []string
}

func (i IndexPage) Scope() string {
	return strings.Join(i.Scopes, " ")
}

func main() {
	cfg := Config{}
	err := envconfig.Process("", &cfg)
	if err != nil {
		log.Fatal(err)
	}

	tmpl := template.Must(template.New("views").Funcs(template.FuncMap{
		"jsonPretty": func(data interface{}) (string, error) {
			bytes, err := json.MarshalIndent(data, "", "  ")
			if err != nil {
				return "", err
			}
			return string(bytes), nil
		},
	}).ParseGlob("templates/*.html"))

	spotifyClient, err := spotify.NewClient(
		spotify.WithClientID(cfg.SpotifyClientID),
		spotify.WithClientSecret(cfg.SpotifyClientSecret),
		spotify.WithRedirectURI(cfg.RedirectURI),
		spotify.WithStrideSongsRefreshToken(cfg.StrideSongsRefreshToken),
	)
	if err != nil {
		log.Fatal(err)
	}
	strideSongs, err := internal.NewStrideSongs(internal.WithSpotify(spotifyClient))
	if err != nil {
		log.Fatal(err)
	}

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		indexPage := IndexPage{
			SpotifyClientID: cfg.SpotifyClientID,
			RedirectURI:     cfg.RedirectURI,
			Scopes: []string{
				"user-read-playback-state",
				"user-modify-playback-state",
				"playlist-modify-public",
				"user-library-read",
			},
		}
		if err := tmpl.ExecuteTemplate(w, "index.html", indexPage); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
	})

	http.HandleFunc("/callback", func(w http.ResponseWriter, r *http.Request) {
		params := r.URL.Query()
		if errorMessage := params.Get("error"); errorMessage != "" {
			http.Error(w, errorMessage, http.StatusInternalServerError)
			return
		}

		code := params.Get("code")
		if code == "" {
			http.Error(w, "expected 'code' param", http.StatusInternalServerError)
			return
		}

		auth, err := spotifyClient.Auth(r.Context(), code)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		if err := tmpl.ExecuteTemplate(w, "authed.html", auth); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
	})

	http.HandleFunc("/me", func(w http.ResponseWriter, r *http.Request) {
		refreshToken := r.URL.Query().Get("refresh_token")
		if refreshToken == "" {
			http.Error(w, "expected 'refresh_token' param", http.StatusBadRequest)
			return
		}

		ctx, err := spotifyClient.WithUserAccessToken(r.Context(), refreshToken)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		me, err := spotifyClient.Me(ctx)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		if err := tmpl.ExecuteTemplate(w, "authed.html", me); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
	})

	http.HandleFunc("/tracks", func(w http.ResponseWriter, r *http.Request) {
		refreshToken := r.URL.Query().Get("refresh_token")
		if refreshToken == "" {
			http.Error(w, "expected 'refresh_token' param", http.StatusBadRequest)
			return
		}

		ctx, err := spotifyClient.WithUserAccessToken(r.Context(), refreshToken)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		tracks, err := strideSongs.GeneratePlaylists(ctx, refreshToken)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		if err := tmpl.ExecuteTemplate(w, "authed.html", tracks); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
	})

	http.ListenAndServe(net.JoinHostPort("", strconv.Itoa(cfg.Port)), nil)
}
