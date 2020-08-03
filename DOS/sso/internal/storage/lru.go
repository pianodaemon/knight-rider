package storage

import (
	"context"
	"os"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/go-redis/redis/v8"
)

// Fetches trivially an enviroment variable
func getEnv(key, fallback string) string {

	if value, ok := os.LookupEnv(key); ok {

		return value
	}
	return fallback
}

// Expires a token by placement of at cache (latter resouce usage)
func Expire(tokenStr string, token *jwt.Token) error {

	/*	var cli *redis.Client

		if err := setRedisClientUp(cli); err != nil {

			return err
		}
	*/

	return nil
}

// Sets up a steady redis connection
func setRedisClientUp(rcli **redis.Client) error {

	var err error = nil
	var cli *redis.Client
	var ctx = context.Background()

	cli = redis.NewClient(&redis.Options{
		Addr:     getEnv("REDIS_ADDRS", "localhost:6379"),
		Password: "", // no password set
		DB:       0,  // use default DB
	})

	_, err = cli.Ping(ctx).Result()

	if err == nil {
		*rcli = cli
	}

	return err
}
