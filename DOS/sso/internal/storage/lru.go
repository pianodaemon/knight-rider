package storage

import (
	"context"
	"os"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/go-redis/redis/v8"
)

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}

// Expires a token by placement of at cache (latter resouce usage)
func Expire(tokenStr string, token *jwt.Token) error {

	return nil
}

func setRedisClientUp(rcli **redis.Client) error {

	var err error = nil
	var cli *redis.Client = nil
	var ctx = context.Background()

	redisAddr := getEnv("REDIS_ADDRS", "localhost:6379")

	cli = redis.NewClient(&redis.Options{
		Addr:     redisAddr,
		Password: "", // no password set
		DB:       0,  // use default DB
	})

	_, err = cli.Ping(ctx).Result()

	if err == nil {
		*rcli = cli
	}

	return err
}
