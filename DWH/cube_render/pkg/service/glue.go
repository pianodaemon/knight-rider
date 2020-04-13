package service

import (
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/kelseyhightower/envconfig"
	"github.com/sirupsen/logrus"

	"agnux.com/cuberender/internal/rsapi"
)

// Engages the RESTful API
func Engage(logger *logrus.Logger) error {

	var apiSettings rsapi.RestAPISettings
	envconfig.Process("rsapi", &apiSettings)

	/* The connection of both components occurs through
	   the router glue and its adaptive functions */
	glue := func(api *rsapi.RestAPI) *mux.Router {

		router := mux.NewRouter()

		v1 := router.PathPrefix("/v1").Subrouter()

		mgmt := v1.PathPrefix("/cuberender").Subrouter()

		mgmt.HandleFunc("", func(w http.ResponseWriter, r *http.Request) {
			fmt.Fprintf(w, "Hello, you've requested: %s\n", r.URL.Path)
		})
		return router
	}

	api := rsapi.NewRestAPI(logger, &apiSettings, glue)

	api.PowerOn()

	return nil
}
