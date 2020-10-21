package main

import (
	"context"
	"encoding/json"
	"fmt"
	"html/template"
	"log"
	"net"
	"net/http"
	"strconv"
	"strings"

	"github.com/go-pg/pg/v10"
	_ "github.com/joho/godotenv/autoload"
	"github.com/kelseyhightower/envconfig"

	"github.com/zhammer/stride-songs/internal"
	"github.com/zhammer/stride-songs/pkg/jwt"
	"github.com/zhammer/stride-songs/pkg/spotify"
)

type Config struct {
	Port                    int    `default:"3000"`
	RedirectURI             string `envconfig:"redirect_uri" default:"http://127.0.0.1:3000/callback"`
	DatabaseURL             string `envconfig:"database_url" required:"true"`
	SpotifyClientID         string `envconfig:"spotify_client_id" required:"true"`
	SpotifyClientSecret     string `envconfig:"spotify_client_secret" required:"true"`
	StrideSongsRefreshToken string `envconfig:"stride_songs_refresh_token" required:"true"`
	StrideSongsUserID       string `envconfig:"stride_songs_user_id" required:"true"`
	JWTSecret               string `envconfig:"jwt_secret" required:"true"`

	// test only
	SpotifyOverrideURL string `envconfig:"spotify_override_url"`
}

type IndexPage struct {
	SpotifyClientID string
	RedirectURI     string
	AdminScopes     []string
	UserScopes      []string
}

func (i IndexPage) AdminScope() string {
	return strings.Join(i.AdminScopes, " ")
}

func (i IndexPage) UserScope() string {
	return strings.Join(i.UserScopes, " ")
}

func main() {
	cfg := Config{}
	err := envconfig.Process("", &cfg)
	if err != nil {
		log.Fatal(err)
	}

	mux := makeServer(cfg)
	http.ListenAndServe(net.JoinHostPort("", strconv.Itoa(cfg.Port)), mux)
}

func makeServer(cfg Config) http.Handler {
	mux := http.NewServeMux()

	tmpl := template.Must(template.New("views").Funcs(template.FuncMap{
		"jsonPretty": func(data interface{}) (string, error) {
			bytes, err := json.MarshalIndent(data, "", "  ")
			if err != nil {
				return "", err
			}
			return string(bytes), nil
		},
	}).ParseGlob("templates/*.html"))

	jwtClient := jwt.Client{Secret: []byte(cfg.JWTSecret)}

	spotifyOptions := []spotify.ClientOption{
		spotify.WithClientID(cfg.SpotifyClientID),
		spotify.WithClientSecret(cfg.SpotifyClientSecret),
		spotify.WithRedirectURI(cfg.RedirectURI),
		spotify.WithStrideSongsRefreshToken(cfg.StrideSongsRefreshToken),
	}
	if cfg.SpotifyOverrideURL != "" {
		spotifyOptions = append(spotifyOptions,
			spotify.WithBaseUrl(cfg.SpotifyOverrideURL),
			spotify.WithBaseAuthUrl(cfg.SpotifyOverrideURL),
		)
	}
	spotifyClient, err := spotify.NewClient(spotifyOptions...)
	if err != nil {
		log.Fatal(err)
	}

	opt, err := pg.ParseURL(cfg.DatabaseURL)
	if err != nil {
		log.Fatal(err)
	}

	db := pg.Connect(opt)
	if err := db.Ping(context.Background()); err != nil {
		log.Fatal(err)
	}

	strideSongs, err := internal.NewStrideSongs(
		internal.WithSpotify(spotifyClient),
		internal.WithDB(db),
		internal.WithStrideSongsSpotifyUserID(cfg.StrideSongsUserID),
	)
	if err != nil {
		log.Fatal(err)
	}

	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		indexPage := IndexPage{
			SpotifyClientID: cfg.SpotifyClientID,
			RedirectURI:     cfg.RedirectURI,
			AdminScopes: []string{
				// we create our spm playlists on our admin account
				string(spotify.ScopePlaylistModifyPrivate),
				string(spotify.ScopePlaylistModifyPublic),
			},
			UserScopes: []string{
				// we modify the user's playlist during runs
				string(spotify.ScopeUserModifyPlaybackState),
				// we read the user's library to generate SPM playlists
				string(spotify.ScopeUserLibraryRead),
				// we may eventually want to follow (either publicly or privately)
				// the stride songs playlists created for our user on our user account
				string(spotify.ScopePlaylistModifyPrivate),
				string(spotify.ScopePlaylistModifyPublic),
				// we may eventually want to read the user's playback history.
				// (purpose: check if songs on an spm playlist were skipped during a run
				// so that we can recommend those tracks be deleted)
				string(spotify.ScopeUserReadRecentlyPlayed),
				// we may eventually want to read the user's playback state
				// (purpose: show the currently playing track within the stride songs app,
				// allowing the user to trash it [skip and remove from playlist].)
				string(spotify.ScopeUserReadPlaybackState),
				// we may eventually want to use user's account data
				// (purpose: email verification)
				string(spotify.ScopeUserReadEmail),
				// (purpose: alert that certain spotify API features only available with
				// premium membership)
				string(spotify.ScopeUserReadPrivate),
			},
		}
		if err := tmpl.ExecuteTemplate(w, "index.html", indexPage); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
	})

	mux.HandleFunc("/callback", func(w http.ResponseWriter, r *http.Request) {
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

	mux.HandleFunc("/me", func(w http.ResponseWriter, r *http.Request) {
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

	mux.HandleFunc("/api/event_triggers/library_sync", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != "POST" {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}

		old := internal.User{}
		new := internal.User{}
		data := EventTriggerPayload{}
		data.Event.Data.New = &new
		data.Event.Data.Old = &old

		if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		fmt.Println(old.LibrarySyncStatus + " -> " + new.LibrarySyncStatus)
		if err := strideSongs.LibrarySyncMachine().HandleStateUpdate(r.Context(), old, new); err != nil {
			fmt.Println(err)
		}
	})

	mux.HandleFunc("/api/event_triggers/stride_event", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != "POST" {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}

		new := internal.StrideEvent{}
		data := EventTriggerPayload{}
		data.Event.Data.New = &new

		if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		fmt.Printf("stride event: %+v\n", new)
		if err := strideSongs.StrideMachine().HandleStrideEvent(r.Context(), new); err != nil {
			fmt.Println(err)
		}
	})

	mux.HandleFunc("/api/actions/demo/login", func(w http.ResponseWriter, r *http.Request) {
		data := ActionPayload{}
		input := DemoLoginInput{}
		data.Input = &input
		if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		fmt.Printf("%+v\n", input.Args.SpotifyAuthorizationCode)

		user, err := strideSongs.DemoLogIn(r.Context(), input.Args.SpotifyAuthorizationCode)
		if err != nil {
			graphqlError := GraphQLError{err.Error()}
			body, _ := json.Marshal(graphqlError)
			w.WriteHeader(http.StatusBadRequest)
			w.Write(body)
			return
		}

		accessToken, err := jwtClient.Build(*user)
		if err != nil {
			graphqlError := GraphQLError{err.Error()}
			body, _ := json.Marshal(graphqlError)
			w.WriteHeader(http.StatusBadRequest)
			w.Write(body)
			return
		}

		output := DemoLogInOutput{
			AccessToken: accessToken,
		}

		body, _ := json.Marshal(output)
		w.Write(body)
	})

	mux.HandleFunc("/api/auth_hook", func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("authorization")
		if authHeader == "" {
			data := map[string]string{
				"x-hasura-role": "unauthorized",
			}
			body, _ := json.Marshal(data)
			w.Write(body)
			return
		}

		token := strings.TrimPrefix(authHeader, "Bearer ")
		if token == "" {
			http.Error(w, "invalid bearer token", http.StatusUnauthorized)
			return
		}

		claims, err := jwtClient.Parse(token)
		if err != nil {
			fmt.Println(err)
			http.Error(w, err.Error(), http.StatusUnauthorized)
			return
		}

		data := map[string]string{
			"x-hasura-user-id": strconv.Itoa(claims.XHasuraUserID),
			"x-hasura-role":    claims.XHasuraRole,
		}

		body, _ := json.Marshal(data)
		w.Write(body)
	})

	return mux
}
