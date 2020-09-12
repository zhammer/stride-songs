package spotify

import "context"

type contextKey string

func (c contextKey) String() string {
	return "spotify context key " + string(c)
}

var (
	contextKeyUserAccessToken = contextKey("user-access-token")
)

func withUserAccessToken(ctx context.Context, accessToken string) context.Context {
	return context.WithValue(ctx, contextKeyUserAccessToken, accessToken)
}

func userAccessToken(ctx context.Context) (string, bool) {
	val, ok := ctx.Value(contextKeyUserAccessToken).(string)
	return val, ok
}
