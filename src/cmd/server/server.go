package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net"
	"net/http"
	"strconv"
	"time"

	"stride-songs/src"
	"stride-songs/src/spotify"

	"github.com/dgrijalva/jwt-go"

	"github.com/kelseyhightower/envconfig"
)

const (
	actionBase       = "/hasura/actions"
	eventTriggerBase = "/hasura/events"
)

type Config struct {
	SpotifyClientID     string `envconfig:"spotify_client_id" required:"true"`
	SpotifyClientSecret string `envconfig:"spotify_client_secret" required:"true"`
	SpotifyRedirectURI  string `envconfig:"spotify_redirect_uri" required:"true"`
	JWTSigningKey       string `envconfig:"jwt_signing_key" required:"true"`
	Port                int    `envconfig:"port" default:"5000"`
}

type LoginOutput struct {
	AccessToken string
}

type LoginInput struct {
	SpotifyRefreshToken string
}

type Mutation struct {
	Login LoginOutput
}

type LoginArgs struct {
	Inp LoginInput
}

type LoginActionPayload struct {
	SessionVariables map[string]interface{} `json:"session_variables"`
	Input            LoginArgs              `json:"input"`
}

type GraphQLError struct {
	Message string `json:"message"`
}

type Claims struct {
	UserID int `json:"user_id"`
	jwt.StandardClaims
}

func writeGraphQLError(w http.ResponseWriter, status int, err error) {
	errorObject := GraphQLError{
		Message: err.Error(),
	}
	errorBody, _ := json.Marshal(errorObject)
	w.WriteHeader(status)
	w.Write(errorBody)
}

func makeLoginActionHandler(cfg *Config, strideSongs *src.StrideSongs) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		// set the response header as JSON
		w.Header().Set("Content-Type", "application/json")

		// read request body
		reqBody, err := ioutil.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "invalid payload", http.StatusBadRequest)
			return
		}

		// parse the body as action payload
		var actionPayload LoginActionPayload
		err = json.Unmarshal(reqBody, &actionPayload)
		if err != nil {
			http.Error(w, "invalid payload", http.StatusBadRequest)
			return
		}

		// login user on the app
		user, err := strideSongs.Login(r.Context(), actionPayload.Input.Inp.SpotifyRefreshToken)
		if err != nil {
			writeGraphQLError(w, http.StatusInternalServerError, err)
			return
		}

		// create jwt with user info
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, &Claims{
			UserID: user.ID,
			StandardClaims: jwt.StandardClaims{
				ExpiresAt: time.Now().Add(24 * 30 * time.Hour).Unix(),
			},
		})
		signed, err := token.SignedString(cfg.JWTSigningKey)
		if err != nil {
			writeGraphQLError(w, http.StatusInternalServerError, err)
		}

		// Write the response as JSON
		result := &LoginOutput{
			AccessToken: signed,
		}
		data, _ := json.Marshal(result)
		w.Write(data)
	}
}

func makeTokenAuthHandler(cfg *Config, strideSongs *src.StrideSongs) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// set the response header as JSON
		w.Header().Set("Content-Type", "application/json")

		r.ParseForm()
		code := r.Form["code"]
		if len(code) != 1 {
			fmt.Println("missing code")
			http.Error(w, "missing 'code'", http.StatusBadRequest)
			return
		}

		spotifyAuthResponse, err := strideSongs.SpotifyAuthFlow(r.Context(), code[0])
		if err != nil {
			fmt.Println(err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		json.NewEncoder(w).Encode(spotifyAuthResponse)
		fmt.Printf("%+v\n", *spotifyAuthResponse)
	}
}

func main() {
	cfg := &Config{}
	envconfig.MustProcess("", cfg)

	spotifyClient, err := spotify.NewSpotify(cfg.SpotifyClientID, cfg.SpotifyClientSecret, cfg.SpotifyRedirectURI)
	if err != nil {
		panic(err)
	}
	strideSongs, err := src.NewStrideSongs(spotifyClient, nil)
	if err != nil {
		panic(err)
	}

	mux := http.NewServeMux()
	mux.HandleFunc(actionBase+"/login", makeLoginActionHandler(cfg, strideSongs))
	mux.HandleFunc("/spotify/api/token", makeTokenAuthHandler(cfg, strideSongs))

	http.ListenAndServe(net.JoinHostPort("", strconv.Itoa(cfg.Port)), mux)
}
