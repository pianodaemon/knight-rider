package controllers

type ApiErrorCode int

const (
	Success ApiErrorCode = 0

	EndPointFailedLogin ApiErrorCode = 1001
)
