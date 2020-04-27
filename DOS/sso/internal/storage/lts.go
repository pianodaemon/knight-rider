package storage

import (
	"github.com/kelseyhightower/envconfig"
)

type (
	User struct {
		UUID      string `json:"uuid" form:"-"`
		Username  string `json:"username" form:"username"`
		IsActive  bool   `json:"isActive" form:"is_active"`
		CreatedAt int64  `json:"createdAt" form:"created_at"`
	}

	PgSqlSettings struct {
		Host     string `default:"rdbms_obs"`
		Db       string `default:"soa"`
		User     string `default:"postgres"`
		Password string `default:"postgres"`
		port     int    `default:"5432"`
	}
)

var pgSettings PgSqlSettings

func init() {

	envconfig.Process("postgres", &pgSettings)
}

func Authenticate(username, password string) (*User, error) {

	return &User{
		UUID:      "",
		Username:  "",
		IsActive:  true,
		CreatedAt: 12123123,
	}, nil
}
