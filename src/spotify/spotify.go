package spotify

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"stride-songs/src"
	"strings"
)

type Spotify struct {
	clientID        string
	clientSecret    string
	authRedirectURI string
}

func (s *Spotify) WithRefreshTokenAuth(ctx context.Context, refreshToken string) (context.Context, error) {
	return nil, fmt.Errorf("not implemented")
}

func (s *Spotify) Me(ctx context.Context) (*src.SpotifyUser, error) {
	return nil, fmt.Errorf("not implemented")
}

func (s *Spotify) AuthFlow(ctx context.Context, authorizationCode string) (*src.SpotifyAuthFlowResponse, error) {
	payload := url.Values{
		"grant_type":   {"authorization_code"},
		"code":         {authorizationCode},
		"redirect_uri": {s.authRedirectURI},
	}
	req, err := http.NewRequest("POST", "https://accounts.spotify.com/api/token", strings.NewReader(payload.Encode()))
	if err != nil {
		return nil, err
	}
	req.SetBasicAuth(s.clientID, s.clientSecret)

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}

	out := &src.SpotifyAuthFlowResponse{}
	err = json.NewDecoder(resp.Body).Decode(out)
	return out, err
}

func NewSpotify(clientID string, clientSecret string, authRedirectURI string) (*Spotify, error) {
	return &Spotify{
		clientID:        clientID,
		clientSecret:    clientSecret,
		authRedirectURI: authRedirectURI,
	}, nil
}
