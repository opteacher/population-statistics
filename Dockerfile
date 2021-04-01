FROM mhart/alpine-node:latest

ARG env

WORKDIR /app

COPY package.json /app
RUN apk --update add git \
  && apk --update add curl \
  && rm -rf /tmp/* /var/cache/apk/* \
  && npm install
COPY . /app