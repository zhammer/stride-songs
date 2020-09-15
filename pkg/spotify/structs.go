package spotify

type AuthResponse struct {
	AccessToken  string `json:"access_token"`
	TokenType    string `json:"token_type"`
	Scope        string `json:"scope"`
	ExpiresIn    int    `json:"expires_int"`
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
