package controllers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/google/jsonapi"
)

type LogInHandler func(username string, password string) ([]byte, error)

func SignOn(logIn LogInHandler) func(w http.ResponseWriter, r *http.Request) {

	type Credentials struct {
		Username string `json:"username" form:"username"`
		Password string `json:"password" form:"password"`
	}

	return func(w http.ResponseWriter, r *http.Request) {

		w.Header().Set("Content-Type", "application/json")

		credentials := new(Credentials)
		decoder := json.NewDecoder(r.Body)
		decoder.Decode(&credentials)

		token, err := logIn(credentials.Username, credentials.Password)

		if err != nil {

			w.WriteHeader(http.StatusNotFound)

			jsonapi.MarshalErrors(w, []*jsonapi.ErrorObject{{
				Code:   strconv.Itoa(int(EndPointFailedLogIn)),
				Title:  "Failed Log in",
				Detail: err.Error(),
			}})

			return
		}

		w.WriteHeader(http.StatusOK)

		w.Write(token)
	}
}

type LogOutHandler func(req *http.Request) error

func SingOff(logOut LogOutHandler) func(w http.ResponseWriter, r *http.Request) {

	return func(w http.ResponseWriter, r *http.Request) {

		err := logOut(r)

		w.Header().Set("Content-Type", "application/json")

		if err != nil {

			w.WriteHeader(http.StatusNotFound)

			jsonapi.MarshalErrors(w, []*jsonapi.ErrorObject{{
				Code:   strconv.Itoa(int(EndPointFailedLogOut)),
				Title:  "Failed Log out",
				Detail: err.Error(),
			}})

			return

		}

		w.WriteHeader(http.StatusOK)
	}
}
