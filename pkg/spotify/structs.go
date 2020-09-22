package spotify

import "context"

type requestConfigOption func(r *requestConfig)

type requestConfig struct {
	accessTokenGetter func(ctx context.Context) (string, bool)
}

func defaultRequestOptions() requestConfig {
	return requestConfig{
		accessTokenGetter: userAccessToken,
	}
}

func WithStrideSongsAccessToken() requestConfigOption {
	return func(r *requestConfig) {
		r.accessTokenGetter = strideSongsAccessToken
	}
}

type AuthResponse struct {
	AccessToken  string `json:"access_token"`
	TokenType    string `json:"token_type"`
	Scope        string `json:"scope"`
	ExpiresIn    int    `json:"expires_in"`
	RefreshToken string `json:"refresh_token"`
}

type User struct {
	ID string `json:"id"`
}

type Track struct {
	ID string `json:"id"`
}

type AnalyzedTrack struct {
	Track
	Tempo float64 `json:"tempo"`
}

type CreatePlaylistRequest struct {
	Name          string  `json:"name"`
	Public        bool    `json:"public"`
	Collaborative bool    `json:"collaborative"`
	Description   *string `json:"description"`
	UserID        string  `json:"-"`
}

type Playlist struct {
	ID   string `json:"id"`
	Name string `json:"string"`
}

type AddTracksToPlaylistRequest struct {
	PlaylistID string
	Tracks     []Track
}

type addTracksToPlaylistRequest struct {
	URIs []string `json:"uris"`
}
