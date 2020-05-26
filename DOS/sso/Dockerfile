# Building stage
FROM golang:1.14-alpine as builder

LABEL MAINTAINER="Edward Nygma <j4nusx@yahoo.com>"

WORKDIR /go/src/immortalcrab.com/sso

COPY go.sum go.mod ./

RUN go mod download

COPY pkg pkg

COPY internal internal

COPY cmd cmd

RUN CGO_ENABLED=0 \
    GOOS=linux \
    GOARCH=amd64 \
    go build -ldflags="-w -s" -o /sso cmd/http/run.go

# Final image
FROM alpine:latest

LABEL MAINTAINER="Edward Nygma <j4nusx@yahoo.com>"

ENV APP_DIR=/
COPY --from=builder /sso $APP_DIR
COPY scripts/run_service.sh $APP_DIR
WORKDIR $APP_DIR

EXPOSE 10090

CMD ["/run_service.sh"]
