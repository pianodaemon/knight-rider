# Building stage
FROM agnux/go:builder as builder

LABEL MAINTAINER="Gerardo Araujo <garaujo@agnux.com>"

WORKDIR /go/src/agnux.com/docrender

COPY go.sum go.mod ./

RUN go mod download

COPY pkg pkg

COPY internal internal

COPY cmd cmd

RUN go build -o /docrender cmd/http/run.go

# Final image
FROM agnux/alpine:3.10

LABEL MAINTAINER="Gerardo Araujo <garaujo@agnux.com>"

COPY --from=builder /docrender .
COPY scripts/run_service.sh .

ENV DOC_RENDER_HTTP_PORT=10070

EXPOSE $DOC_RENDER_HTTP_PORT

CMD ["/run_service.sh"]
