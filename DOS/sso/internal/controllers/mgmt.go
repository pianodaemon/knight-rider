package controllers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/google/jsonapi"
)

type LoginHandler func(username string, password string) ([]byte, error)

func SignOn(login LoginHandler) func(w http.ResponseWriter, r *http.Request) {

	type Credentials struct {
		Username string `json:"username" form:"username"`
		Password string `json:"password" form:"password"`
	}

	return func(w http.ResponseWriter, r *http.Request) {

		w.Header().Set("Content-Type", "application/json")

		credentials := new(Credentials)
		decoder := json.NewDecoder(r.Body)
		decoder.Decode(&credentials)

		token, err := login(credentials.Username, credentials.Password)

		if err != nil {

			w.WriteHeader(http.StatusNotFound)

			jsonapi.MarshalErrors(w, []*jsonapi.ErrorObject{{
				Code:   strconv.Itoa(int(EndPointFailedLogin)),
				Title:  "Failed Login",
				Detail: err.Error(),
			}})

			return
		}

		w.WriteHeader(http.StatusOK)

		w.Write(token)
	}
}
