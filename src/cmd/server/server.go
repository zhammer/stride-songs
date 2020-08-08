package main

import (
	"fmt"
	"net"
	"net/http"
	"strconv"

	"github.com/kelseyhightower/envconfig"
)

type Config struct {
	SpotifyClientID     string `envconfig:"spotify_client_id" required:"true"`
	SpotifyClientSecret string `envconfig:"spotofy_client_secret" required:"true"`
	Port                int    `envconfig:"port" default:"5000"`
}

func main() {
	cfg := Config{}
	envconfig.MustProcess("", &cfg)

	mux := http.NewServeMux()
	mux.HandleFunc("/ping", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "pong")
	})

	http.ListenAndServe(net.JoinHostPort("", strconv.Itoa(cfg.Port)), mux)
}
