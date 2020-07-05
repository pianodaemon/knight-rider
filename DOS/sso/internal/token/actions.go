package token

import (
	"crypto/rsa"
	"net/http"
	"time"

	jwt "github.com/dgrijalva/jwt-go"
	request "github.com/dgrijalva/jwt-go/request"
)

// Extracts token from a http resquest by involving public key
func ExtractFromReq(publicKey *rsa.PublicKey, req *http.Request) (*jwt.Token, error) {

	tokenRequest, err := request.ParseFromRequest(
		req,
		request.OAuth2Extractor,
		func(token *jwt.Token) (interface{}, error) {
			return publicKey, nil
		})

	if err != nil {
		return nil, err
	}

	return tokenRequest, err
}

// Generates a token along with its claims by signing with private key
func Generate(privateKey *rsa.PrivateKey, expirationDelta int, userUID string) (string, error) {

	token := jwt.New(jwt.SigningMethodRS512)

	token.Claims = jwt.MapClaims{
		"exp": time.Now().Add(time.Hour * time.Duration(expirationDelta)).Unix(),
		"iat": time.Now().Unix(),
		"sub": userUID,
	}

	tokenString, err := token.SignedString(privateKey)

	if err != nil {

		return "", err
	}

	return tokenString, nil
}
