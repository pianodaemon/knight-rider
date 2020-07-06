package storage

import (
	jwt "github.com/dgrijalva/jwt-go"
)

// Expires a token by placement of at cache (latter resouce usage)
func Expire(tokenStr string, token *jwt.Token) error {

	return nil
}
