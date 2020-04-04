# Building stage
FROM golang:1.13-buster as builder

LABEL MAINTAINER="Gerardo Araujo <garaujo@agnux.com>"

WORKDIR /go/src/agnux.com/docrender

COPY go.sum go.mod ./

RUN go mod download

COPY pkg pkg

COPY internal internal

COPY cmd cmd

RUN CGO_ENABLED=0 \
    GOOS=linux \
    GOARCH=amd64 \
    go build -ldflags="-w -s" -o /docrender cmd/http/run.go

# Final image
FROM golang:1.13-alpine

LABEL MAINTAINER="Gerardo Araujo <garaujo@agnux.com>"

ENV APP_DIR=/
COPY --from=builder /docrender $APP_DIR
COPY scripts/run_service.sh $APP_DIR
WORKDIR $APP_DIR

ENV DOC_RENDER_HTTP_PORT=10070

EXPOSE $DOC_RENDER_HTTP_PORT

CMD ["/run_service.sh"]
