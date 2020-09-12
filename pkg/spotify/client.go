package spotify

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"strings"
)

const base = "https://api.spotify.com/v1"

type ClientOption func(c *Client)

type Client struct {
	clientID     string
	clientSecret string
	redirectURI  string
	httpClient   http.Client
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
	client := &Client{}
	for _, opt := range opts {
		opt(client)
	}
	return client, nil
}
