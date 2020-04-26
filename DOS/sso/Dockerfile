# Building stage
FROM golang:1.13-buster as builder

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
FROM golang:1.13-alpine

LABEL MAINTAINER="Edward Nygma <j4nusx@yahoo.com>"

ENV APP_DIR=/
COPY --from=builder /sso $APP_DIR
COPY scripts/run_service.sh $APP_DIR
WORKDIR $APP_DIR

ENV SLACK_SSO_HTTP_PORT=10070

EXPOSE $SLACK_SSO_HTTP_PORT

CMD ["/run_service.sh"]
