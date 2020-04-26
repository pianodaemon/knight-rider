package authentication

import (
	"crypto/rsa"
	"encoding/json"

	dal "immortalcrab.com/sso/internal/storage"
	ton "immortalcrab.com/sso/internal/token"

	"github.com/sirupsen/logrus"
)

type (

	// Settings for the clerk in charge of the tokens
	TokenClerkSettings struct {
		PrivateKey      *rsa.PrivateKey
		PublicKey       *rsa.PublicKey
		ExpirationDelta int
	}

	// Represents a clerk in charge of the tokens
	TokenClerk struct {
		config *TokenClerkSettings
		logger *logrus.Logger
	}

	TokenAuthentication struct {
		Token string `json:"token" form:"token"`
	}
)

// Spawns an newer instance of the clerk in charge of the tokens
func NewTokenClerk(logger *logrus.Logger,
	config *TokenClerkSettings) *TokenClerk {

	return &TokenClerk{
		config: config,
		logger: logger,
	}
}

func (self *TokenClerk) IssueToken(username, password string) ([]byte, error) {

	user, err := dal.Authenticate(username, password)

	if err != nil {

		return nil, err
	}

	token, err := ton.Generate(self.config.PrivateKey, self.config.ExpirationDelta, user.UUID)

	if err != nil {

		return nil, err
	}

	response, _ := json.Marshal(TokenAuthentication{Token: token})

	return response, nil
}
