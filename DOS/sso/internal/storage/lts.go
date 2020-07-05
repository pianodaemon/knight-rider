package storage

import (
	"database/sql"
	"fmt"

	"github.com/kelseyhightower/envconfig"
	_ "github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
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
)

var pgSettings PgSqlSettings

func init() {

	envconfig.Process("postgres", &pgSettings)
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
		var uid, passwordHash, username string
		var disabled bool

		err := db.QueryRow("SELECT id::string as uid, username, passwd, disabled FROM users WHERE username = $1",
			username).Scan(&uid, &username, &passwordHash, &disabled)

		if err != nil {

			return nil, err
		}

		err = bcrypt.CompareHashAndPassword([]byte(passwordHash), []byte(password))

		if err != nil {

			return nil, err
		}

		usr = &User{
			UID:       uid,
			Username:  username,
			IsActive:  !disabled,
			CreatedAt: 12123123,
		}
	}

	return usr, nil
}
