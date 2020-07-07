# Building stage
FROM golang:1.14-alpine as builder

LABEL MAINTAINER="Edward Nygma <j4nusx@yahoo.com>"

WORKDIR /go/src/immortalcrab.com/sso

COPY Makefile go.sum go.mod ./

RUN go mod download

COPY pkg pkg

COPY internal internal

COPY cmd cmd

RUN apk add make
RUN make clean build

# Final image
FROM alpine:latest

LABEL MAINTAINER="Edward Nygma <j4nusx@yahoo.com>"

ENV APP_DIR=/
COPY --from=builder /sso $APP_DIR
COPY scripts/run_service.sh $APP_DIR
WORKDIR $APP_DIR

EXPOSE 10090

CMD ["/run_service.sh"]
