package storage

import (
	"crypto/sha256"
	"database/sql"
	"fmt"

	"github.com/kelseyhightower/envconfig"
	_ "github.com/lib/pq"
)

type (
	User struct {
		UID       string `json:"uid"`
		Username  string `json:"username"`
		IsActive  bool   `json:"is_active"`
		CreatedAt int64  `json:"created_at"`
	}

	PgSqlSettings struct {
		Host     string `default:"rdbms_obs"`
		Db       string `default:"soa"`
		User     string `default:"postgres"`
		Password string `default:"postgres"`
		Port     int    `default:"5432"`
	}

	LoginError struct {
		What string
	}
)

var pgSettings PgSqlSettings

func init() {

	envconfig.Process("postgres", &pgSettings)
}

func (e *LoginError) Error() string {
	return e.What
}

func shapeConnStr() string {

	// SSL mode disable to use in containers
	return fmt.Sprintf("user=%s password=%s host=%s port=%d dbname=%s sslmode=disable",
		pgSettings.User,
		pgSettings.Password,
		pgSettings.Host,
		pgSettings.Port,
		pgSettings.Db)
}

func Authenticate(username, password string) (*User, error) {

	var usr *User

	dbinfo := shapeConnStr()

	db, err := sql.Open("postgres", dbinfo)

	if err != nil {

		return nil, fmt.Errorf("Issues when connecting to the long term storage")
	}

	defer db.Close()

	{
		var uid, passwordHash, username_ string
		var disabled bool

		err := db.QueryRow("SELECT id::character varying as uid, username, passwd, disabled FROM users WHERE username = $1",
			username).Scan(&uid, &username_, &passwordHash, &disabled)

		if err != nil {

			return nil, err
		}

		h := sha256.New()
		h.Write([]byte(password))
		hashed := fmt.Sprintf("%x", h.Sum(nil))

		if passwordHash != hashed {

			return nil, &LoginError{"Verify your credentials"}
		}

		usr = &User{
			UID:       uid,
			Username:  username_,
			IsActive:  !disabled,
			CreatedAt: 12123123,
		}
	}

	return usr, nil
}
