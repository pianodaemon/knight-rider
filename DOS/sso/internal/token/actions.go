package token

import (
	"crypto/rsa"

	jwt "github.com/dgrijalva/jwt-go"
)

func generateToken(pk *rsa.PrivateKey, userUUID string, expirationDelta int) (string, error) {

	token := jwt.New(jwt.SigningMethodRS512)

	token.Claims = jwt.MapClaims{
		"exp": time.Now().Add(time.Hour * time.Duration(expirationDelta)).Unix(),
		"iat": time.Now().Unix(),
		"sub": userUUID,
	}

	tokenString, err := token.SignedString(pk)
	if err != nil {

		return "", err
	}

	return tokenString, nil
}
