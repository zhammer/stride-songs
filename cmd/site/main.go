package main

import (
	"encoding/json"
	"html/template"
	"io/ioutil"
	"log"
	"net"
	"net/http"
	"net/url"
	"strconv"
	"strings"

	_ "github.com/joho/godotenv/autoload"
	"github.com/kelseyhightower/envconfig"
)

type Config struct {
	Port                int    `default:"3000"`
	RedirectURI         string `default:"http://127.0.0.1:3000/callback"`
	SpotifyClientID     string `envconfig:"spotify_client_id" required:"true"`
	SpotifyClientSecret string `envconfig:"spotify_client_secret" required:"true"`
}

type IndexPage struct {
	SpotifyClientID string
	RedirectURI     string
	Scopes          []string
}

type SpotifyAuthResponse struct {
	AccessToken  string `json:"access_token"`
	TokenType    string `json:"token_type"`
	Scope        string `json:"scope"`
	ExpiresIn    int    `json:"expires_int"`
	RefreshToken string `json:"refresh_token"`
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

		values := url.Values{
			"grant_type":   []string{"authorization_code"},
			"code":         []string{code},
			"redirect_uri": []string{cfg.RedirectURI},
		}
		encoded := values.Encode()
		req, err := http.NewRequest("POST", "https://accounts.spotify.com/api/token", strings.NewReader(encoded))
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		req.Header.Add("content-type", "application/x-www-form-urlencoded")
		req.SetBasicAuth(cfg.SpotifyClientID, cfg.SpotifyClientSecret)

		resp, err := http.DefaultClient.Do(req)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		if resp.StatusCode != http.StatusOK {
			body, _ := ioutil.ReadAll(resp.Body)
			http.Error(w, string(body), http.StatusInternalServerError)
		}

		auth := SpotifyAuthResponse{}
		if err := json.NewDecoder(resp.Body).Decode(&auth); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		if err := tmpl.ExecuteTemplate(w, "authed.html", auth); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
	})

	http.ListenAndServe(net.JoinHostPort("", strconv.Itoa(cfg.Port)), nil)
}
