# Building stage
FROM golang:1.13-buster as builder

LABEL MAINTAINER="Gerardo Araujo <garaujo@agnux.com>"

WORKDIR /go/src/agnux.com/cuberender

COPY go.sum go.mod ./

RUN go mod download

COPY pkg pkg

COPY internal internal

COPY cmd cmd

RUN CGO_ENABLED=0 \
    GOOS=linux \
    GOARCH=amd64 \
    go build -ldflags="-w -s" -o /cuberender cmd/http/run.go

# Final image
FROM golang:1.13-alpine

LABEL MAINTAINER="Gerardo Araujo <garaujo@agnux.com>"

ENV APP_DIR=/
COPY --from=builder /cuberender $APP_DIR
COPY scripts/run_service.sh $APP_DIR
WORKDIR $APP_DIR

ENV CUBE_RENDER_HTTP_PORT=10070

EXPOSE $CUBE_RENDER_HTTP_PORT

CMD ["/run_service.sh"]
