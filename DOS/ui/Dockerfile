FROM mhart/alpine-node:11 AS builder
MAINTAINER miriam.physics@gmail.com

ARG NODE_ENV
ARG REACT_APP_HOST_API

WORKDIR /app
COPY . .
RUN npm install react-scripts -g --silent
RUN yarn install
RUN yarn run build

FROM mhart/alpine-node
RUN yarn global add serve
WORKDIR /app
COPY --from=builder /app/build .
CMD ["serve", "-p", "80", "-s", "."]doc
