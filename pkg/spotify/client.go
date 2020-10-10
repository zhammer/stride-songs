package spotify

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"strconv"
	"strings"

	"github.com/zhammer/stride-songs/pkg/chunk"

	"github.com/hashicorp/go-retryablehttp"
)

type ClientOption func(c *Client)

type Client struct {
	clientID                string
	clientSecret            string
	redirectURI             string
	httpClient              *http.Client
	strideSongsRefreshToken string

	base     string
	authBase string
}

func (c *Client) refreshTokenAuth(ctx context.Context, refreshToken string) (*AuthResponse, error) {
	values := url.Values{
		"grant_type":    []string{"refresh_token"},
		"refresh_token": []string{refreshToken},
	}
	req, err := http.NewRequest("POST", c.authBase+"/api/token", strings.NewReader(values.Encode()))
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

// note: at some point it may make more sense to have a goroutine that fetches
// a new access token whenever the previous access token expires, and use that
// kept-fresh access token for all requests across the Client.
func (c *Client) WithStrideSongsAccessToken(ctx context.Context) (context.Context, error) {
	auth, err := c.refreshTokenAuth(ctx, c.strideSongsRefreshToken)
	if err != nil {
		return nil, err
	}

	ctx = withStrideSongsAccessToken(ctx, auth.AccessToken)
	return ctx, nil
}

func (c *Client) WithUserAccessToken(ctx context.Context, refreshToken string) (context.Context, error) {
	auth, err := c.refreshTokenAuth(ctx, refreshToken)
	if err != nil {
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
	req, err := http.NewRequest("POST", c.authBase+"/api/token", strings.NewReader(values.Encode()))
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
	nextPage := c.base + "/v1/me/tracks?limit=50&offset=0"

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

		url := c.base + "/v1/audio-features?ids=" + strings.Join(ids, ",")
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

	req, err := http.NewRequest("GET", c.base+"/v1/me", nil)
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

func (c *Client) CreatePlaylist(ctx context.Context, inp CreatePlaylistRequest, opts ...requestConfigOption) (*Playlist, error) {
	cfg := c.requestConfig(opts)
	accessToken, ok := cfg.accessTokenGetter(ctx)
	if !ok {
		return nil, fmt.Errorf("must use context with accessToken")
	}

	buffer := &bytes.Buffer{}
	if err := json.NewEncoder(buffer).Encode(&inp); err != nil {
		return nil, err
	}

	req, err := http.NewRequest("POST", fmt.Sprintf("%s/v1/users/%s/playlists", c.base, inp.UserID), buffer)
	if err != nil {
		return nil, err
	}
	req.Header.Add("authorization", "Bearer "+accessToken)

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, err
	}

	if !(resp.StatusCode == http.StatusOK || resp.StatusCode == http.StatusCreated) {
		return nil, fmt.Errorf("unexpected status code from spotify: %d", resp.StatusCode)
	}

	playlist := Playlist{}
	if err := json.NewDecoder(resp.Body).Decode(&playlist); err != nil {
		return nil, err
	}

	return &playlist, nil
}

func (c *Client) ToggleShuffle(ctx context.Context, shuffle bool, opts ...requestConfigOption) error {
	cfg := c.requestConfig(opts)
	accessToken, ok := cfg.accessTokenGetter(ctx)
	if !ok {
		return fmt.Errorf("must use context with accessToken")
	}

	req, err := http.NewRequest("PUT", c.base+"/v1/me/player/shuffle", nil)
	if err != nil {
		return err
	}
	req.Header.Add("authorization", "Bearer "+accessToken)
	params := url.Values{}
	params.Add("state", strconv.FormatBool(shuffle))
	req.URL.RawQuery = params.Encode()

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return err
	}

	if resp.StatusCode != http.StatusNoContent {
		return fmt.Errorf("unexpected status code from spotify: %d", resp.StatusCode)
	}

	return nil
}

func (c *Client) SetRepeatMode(ctx context.Context, mode repeatMode, opts ...requestConfigOption) error {
	cfg := c.requestConfig(opts)
	accessToken, ok := cfg.accessTokenGetter(ctx)
	if !ok {
		return fmt.Errorf("must use context with accessToken")
	}

	req, err := http.NewRequest("PUT", c.base+"/v1/me/player/repeat", nil)
	if err != nil {
		return err
	}
	req.Header.Add("authorization", "Bearer "+accessToken)
	params := url.Values{}
	params.Add("state", string(mode))
	req.URL.RawQuery = params.Encode()

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return err
	}

	if resp.StatusCode != http.StatusNoContent {
		return fmt.Errorf("unexpected status code from spotify: %d", resp.StatusCode)
	}

	return nil
}

func (c *Client) AddTracksToPlaylist(ctx context.Context, inp AddTracksToPlaylistRequest, opts ...requestConfigOption) error {
	cfg := c.requestConfig(opts)
	accessToken, ok := cfg.accessTokenGetter(ctx)
	if !ok {
		return fmt.Errorf("must use context with accessToken")
	}

	// need to break up the original request input into several requests
	requests := makeAddTracksToPlaylistRequests(inp)
	for _, request := range requests {
		buffer := &bytes.Buffer{}
		if err := json.NewEncoder(buffer).Encode(&request); err != nil {
			return err
		}

		req, err := http.NewRequest("POST", fmt.Sprintf("%s/v1/playlists/%s/tracks", c.base, inp.PlaylistID), buffer)
		if err != nil {
			return err
		}
		req.Header.Add("authorization", "Bearer "+accessToken)

		resp, err := c.httpClient.Do(req)
		if err != nil {
			return err
		}

		if resp.StatusCode != http.StatusCreated {
			return fmt.Errorf("unexpected status code from spotify: %d", resp.StatusCode)
		}
	}

	return nil
}

func makeAddTracksToPlaylistRequests(inp AddTracksToPlaylistRequest) []addTracksToPlaylistRequest {
	// A maximum of 100 items can be added in one request.
	ranges := chunk.Ranges(len(inp.Tracks), 100)
	requests := make([]addTracksToPlaylistRequest, len(ranges))
	for i, trackRange := range ranges {
		tracks := inp.Tracks[trackRange.Start:trackRange.End]

		requests[i] = addTracksToPlaylistRequest{
			URIs: trackURIs(tracks),
		}
	}

	return requests
}

func trackURIs(tracks []Track) []string {
	uris := make([]string, len(tracks))
	for i, track := range tracks {
		uris[i] = "spotify:track:" + track.ID
	}
	return uris
}

func (c *Client) requestConfig(opts []requestConfigOption) requestConfig {
	cfg := defaultRequestOptions()
	for _, opt := range opts {
		opt(&cfg)
	}
	return cfg
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

func WithStrideSongsRefreshToken(refreshToken string) ClientOption {
	return func(c *Client) {
		c.strideSongsRefreshToken = refreshToken
	}
}

func WithBaseUrl(baseURL string) ClientOption {
	fmt.Println("WithBaseUrl should only be used in development environments!")
	return func(c *Client) {
		c.base = baseURL
	}
}

func WithBaseAuthUrl(baseAuthURL string) ClientOption {
	fmt.Println("WithBaseAuthUrl should only be used in development environments!")
	return func(c *Client) {
		c.authBase = baseAuthURL
	}
}

func NewClient(opts ...ClientOption) (*Client, error) {
	client := &Client{
		httpClient: retryablehttp.NewClient().StandardClient(),
		base:       "https://api.spotify.com",
		authBase:   "https://accounts.spotify.com",
	}
	for _, opt := range opts {
		opt(client)
	}
	return client, nil
}
