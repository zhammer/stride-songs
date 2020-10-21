package main

type EventTriggerPayload struct {
	ID    string `json:"id"`
	Event struct {
		Data struct {
			Old interface{} `json:"old"`
			New interface{} `json:"new"`
		} `json:"data"`
	} `json:"event"`
}

type ActionPayload struct {
	SessionVariables map[string]interface{} `json:"session_variables"`
	Input            interface{}            `json:"input"`
}

type GraphQLError struct {
	Message string `json:"message"`
}

type DemoLoginInput struct {
	Args struct {
		SpotifyAuthorizationCode string `json:"spotify_authorization_code"`
	} `json:args`
}

type DemoLogInOutput struct {
	AccessToken string `json:"access_token"`
}
