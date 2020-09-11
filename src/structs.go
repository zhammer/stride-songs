package src

type User struct {
	ID int
}

type SpotifyUser struct {
	ID           string
	RefreshToken string
}

type SpotifyAuthFlowResponse struct {
	AccessToken  string `json:"access_token"`
	TokenType    string `json:"token_type"`
	ExpiresIn    int    `json:"expires_in"`
	RefreshToken string `json:"refresh_token"`
	Scope        string `json:"scope"`
}
