package token

import (
	"crypto/rsa"
    "time"

	jwt "github.com/dgrijalva/jwt-go"
)

func Generate(privateKey *rsa.PrivateKey, expirationDelta int, userUUID string) (string, error) {

	token := jwt.New(jwt.SigningMethodRS512)

	token.Claims = jwt.MapClaims{
		"exp": time.Now().Add(time.Hour * time.Duration(expirationDelta)).Unix(),
		"iat": time.Now().Unix(),
		"sub": userUUID,
	}

	tokenString, err := token.SignedString(privateKey)

	if err != nil {

		return "", err
	}

	return tokenString, nil
}
