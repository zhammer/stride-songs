package spotify

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"strings"

	"github.com/zhammer/stride-songs/pkg/chunk"

	"github.com/hashicorp/go-retryablehttp"
)

const base = "https://api.spotify.com/v1"

type ClientOption func(c *Client)

type Client struct {
	clientID     string
	clientSecret string
	redirectURI  string
	httpClient   *http.Client
}

func (c *Client) WithRefreshTokenAuth(ctx context.Context, refreshToken string) (context.Context, error) {
	values := url.Values{
		"grant_type":    []string{"refresh_token"},
		"refresh_token": []string{refreshToken},
	}
	req, err := http.NewRequest("POST", "https://accounts.spotify.com/api/token", strings.NewReader(values.Encode()))
	if err != nil {
		return nil, err
	}
	req.Header.Add("content-type", "application/x-www-form-urlencoded")
	req.SetBasicAuth(c.clientID, c.clientSecret)

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("unexpected status code from spotify: %d", resp.StatusCode)
	}

	auth := AuthResponse{}
	if err := json.NewDecoder(resp.Body).Decode(&auth); err != nil {
		return nil, err
	}

	ctx = withUserAccessToken(ctx, auth.AccessToken)
	return ctx, nil
}

func (c *Client) Auth(ctx context.Context, authorizationCode string) (*AuthResponse, error) {
	values := url.Values{
		"grant_type":   []string{"authorization_code"},
		"code":         []string{authorizationCode},
		"redirect_uri": []string{c.redirectURI},
	}
	req, err := http.NewRequest("POST", "https://accounts.spotify.com/api/token", strings.NewReader(values.Encode()))
	if err != nil {
		return nil, err
	}
	req.Header.Add("content-type", "application/x-www-form-urlencoded")
	req.SetBasicAuth(c.clientID, c.clientSecret)

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("unexpected status code from spotify: %d", resp.StatusCode)
	}

	auth := AuthResponse{}
	if err := json.NewDecoder(resp.Body).Decode(&auth); err != nil {
		return nil, err
	}

	return &auth, nil
}

// https://developer.spotify.com/documentation/web-api/reference/library/get-users-saved-tracks/
func (c *Client) AllUserTracks(ctx context.Context) ([]Track, error) {
	accessToken, ok := userAccessToken(ctx)
	if !ok {
		return nil, fmt.Errorf("must use context with accessToken")
	}

	var tracks []Track
	nextPage := base + "/me/tracks?limit=50&offset=0"

	for nextPage != "" {
		req, err := http.NewRequest("GET", nextPage, nil)
		if err != nil {
			return nil, err
		}
		req.Header.Add("authorization", "Bearer "+accessToken)

		resp, err := c.httpClient.Do(req)
		if err != nil {
			return nil, err
		}

		if resp.StatusCode != http.StatusOK {
			return nil, fmt.Errorf("unexpected status code from spotify: %d", resp.StatusCode)
		}

		data := struct {
			Items []struct {
				Track Track `json:"track"`
			} `json:"items"`
			Next string `json:"next"`
		}{}
		if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
			return nil, err
		}

		for _, item := range data.Items {
			tracks = append(tracks, item.Track)
		}

		nextPage = data.Next
	}

	return tracks, nil
}

func (c *Client) AnalyzedTracks(ctx context.Context, tracks []Track) ([]AnalyzedTrack, error) {
	// note: this doesn't technically have to use user's auth
	accessToken, ok := userAccessToken(ctx)
	if !ok {
		return nil, fmt.Errorf("must use context with accessToken")
	}

	var analyzedTracks []AnalyzedTrack
	for _, trackRange := range chunk.Ranges(len(tracks), 100) {
		trackChunk := tracks[trackRange.Start:trackRange.End]
		ids := []string{}
		for _, track := range trackChunk {
			ids = append(ids, track.ID)
		}

		url := base + "/audio-features?ids=" + strings.Join(ids, ",")
		req, err := http.NewRequest("GET", url, nil)

		if err != nil {
			return nil, err
		}
		req.Header.Add("authorization", "Bearer "+accessToken)

		resp, err := c.httpClient.Do(req)
		if err != nil {
			return nil, err
		}

		if resp.StatusCode != http.StatusOK {
			return nil, fmt.Errorf("unexpected status code from spotify: %d", resp.StatusCode)
		}

		data := struct {
			AudioFeatures []AnalyzedTrack `json:"audio_features"`
		}{}

		if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
			return nil, err
		}

		analyzedTracks = append(analyzedTracks, data.AudioFeatures...)
	}

	return analyzedTracks, nil
}

func (c *Client) Me(ctx context.Context) (*User, error) {
	accessToken, ok := userAccessToken(ctx)
	if !ok {
		return nil, fmt.Errorf("must use context with accessToken")
	}

	req, err := http.NewRequest("GET", base+"/me", nil)
	if err != nil {
		return nil, err
	}
	req.Header.Add("authorization", "Bearer "+accessToken)

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("unexpected status code from spotify: %d", resp.StatusCode)
	}

	user := User{}
	if err := json.NewDecoder(resp.Body).Decode(&user); err != nil {
		return nil, err
	}

	return &user, nil
}

func WithClientID(clientID string) ClientOption {
	return func(c *Client) {
		c.clientID = clientID
	}
}

func WithClientSecret(clientSecret string) ClientOption {
	return func(c *Client) {
		c.clientSecret = clientSecret
	}
}

func WithRedirectURI(redirectURI string) ClientOption {
	return func(c *Client) {
		c.redirectURI = redirectURI
	}
}

func NewClient(opts ...ClientOption) (*Client, error) {
	client := &Client{
		httpClient: retryablehttp.NewClient().StandardClient(),
	}
	for _, opt := range opts {
		opt(client)
	}
	return client, nil
}
