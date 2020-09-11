package src

import "context"

type contextKey string

func (c contextKey) String() string {
	return "stride-songs context key " + string(c)
}

var (
	contextKeySpotifyUserAccessToken = contextKey("spotify-user-access-token")
)

func WithSpotifyUserAccessToken(ctx context.Context, accessToken string) context.Context {
	return context.WithValue(ctx, contextKeySpotifyUserAccessToken, accessToken)
}

func SpotifyUserAccessToken(ctx context.Context) (string, bool) {
	val, ok := ctx.Value(contextKeySpotifyUserAccessToken).(string)
	return val, ok
}
