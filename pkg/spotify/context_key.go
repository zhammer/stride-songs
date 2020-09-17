package spotify

import "context"

type contextKey string

func (c contextKey) String() string {
	return "spotify context key " + string(c)
}

var (
	contextKeyUserAccessToken        = contextKey("user-access-token")
	contextKeyStrideSongsAccessToken = contextKey("stride-songs-access-token")
)

func withUserAccessToken(ctx context.Context, accessToken string) context.Context {
	return context.WithValue(ctx, contextKeyUserAccessToken, accessToken)
}

func userAccessToken(ctx context.Context) (string, bool) {
	val, ok := ctx.Value(contextKeyUserAccessToken).(string)
	return val, ok
}

func withStrideSongsAccessToken(ctx context.Context, accessToken string) context.Context {
	return context.WithValue(ctx, contextKeyStrideSongsAccessToken, accessToken)
}

func strideSongsAccessToken(ctx context.Context) (string, bool) {
	val, ok := ctx.Value(contextKeyStrideSongsAccessToken).(string)
	return val, ok
}
