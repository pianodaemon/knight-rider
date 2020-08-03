package storage

import (
	"context"
	"os"
	"time"

	ton "immortalcrab.com/sso/internal/token"

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

	remValidity := time.Second * time.Duration(ton.RemainingValidity(token))

	var ctx = context.Background()
	var cli *redis.Client

	if err := setRedisClientUp(&cli); err != nil {

		return err
	}

	defer cli.Close()

	if err := cli.Set(ctx, tokenStr, tokenStr, remValidity).Err(); err != nil {

		return err
	}

	return nil
}

// Sets up a steady redis connection
func setRedisClientUp(rcli **redis.Client) error {

	var err error = nil
	var cli *redis.Client
	var ctx = context.Background()

	host := getEnv("REDIS_HOST", "localhost")
	port := getEnv("REDIS_PORT", "6379")

	cli = redis.NewClient(&redis.Options{
		Addr:     (host + ":" + port),
		Password: "", // no password set
		DB:       0,  // use default DB
	})

	_, err = cli.Ping(ctx).Result()

	if err == nil {
		*rcli = cli
	}

	return err
}
