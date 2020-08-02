package storage

import (
	"context"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/go-redis/redis/v8"
)

// Expires a token by placement of at cache (latter resouce usage)
func Expire(tokenStr string, token *jwt.Token) error {

	return nil
}

func setRedisClientUp(rcli **redis.Client) error {

	var err error = nil
	var cli *redis.Client = nil
	var ctx = context.Background()

	cli = redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "", // no password set
		DB:       0,  // use default DB
	})

	_, err = cli.Ping(ctx).Result()

	if err == nil {
		*rcli = cli
	}

	return err
}
