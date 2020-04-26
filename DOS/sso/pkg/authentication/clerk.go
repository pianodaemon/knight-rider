package authentication

import (
	"github.com/sirupsen/logrus"
)

type (

	// Settings for the clerk in charge of the tokens
	TokenClerkSettings struct {
		PrivateKey string
		PublicKey  string
	}

	// Represents a clerk in charge of the tokens
	TokenClerk struct {
		config *TokenClerkSettings
		logger *logrus.Logger
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

	return []byte(""), nil
}
