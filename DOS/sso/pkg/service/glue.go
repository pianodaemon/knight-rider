package service

import (
	"github.com/gorilla/mux"
	"github.com/kelseyhightower/envconfig"
	"github.com/sirupsen/logrus"

	co "immortalcrab.com/sso/internal/controllers"
	"immortalcrab.com/sso/internal/rsapi"
	ton "immortalcrab.com/sso/internal/token"
	aut "immortalcrab.com/sso/pkg/authentication"
)

// Engages the RESTful API
func Engage(logger *logrus.Logger) error {

	var apiSettings rsapi.RestAPISettings
	envconfig.Process("rsapi", &apiSettings)

	tcSettings := &aut.TokenClerkSettings{ton.GetPrivateKey(""), ton.GetPublicKey(""), 0}
	clerk := aut.NewTokenClerk(logger, tcSettings)

	/* The connection of both components occurs through
	   the router glue and its adaptive functions */
	glue := func(api *rsapi.RestAPI) *mux.Router {

		router := mux.NewRouter()

		v1 := router.PathPrefix("/v1").Subrouter()

		mgmt := v1.PathPrefix("/sso").Subrouter()

		mgmt.HandleFunc("/token-auth", co.SignOn(clerk.IssueToken)).Methods("POST")

		return router
	}

	api := rsapi.NewRestAPI(logger, &apiSettings, glue)

	api.PowerOn()

	return nil
}
