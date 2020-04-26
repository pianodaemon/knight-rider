package storage

import (
	jwt "github.com/dgrijalva/jwt-go"
)

func ExpireToken(tokenStr string, token *jwt.Token) error {

	return nil
}

type User struct {
	UUID      string `json:"uuid" form:"-"`
	Username  string `json:"username" form:"username"`
	IsActive  bool   `json:"isActive" form:"is_active"`
	CreatedAt int64  `json:"createdAt" form:"created_at"`
}

func Authenticate(username, password string) (*User, error) {

	return &User{
		UUID:      "",
		Username:  "",
		IsActive:  true,
		CreatedAt: 12123123,
	}, nil
}
