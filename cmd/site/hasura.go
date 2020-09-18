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
