FROM mhart/alpine-node:latest

ARG env

WORKDIR /app

COPY package.json /app
RUN apk --update add git \
  && apk --update add curl \
  && apk --update add python2.7 \
  && rm -rf /tmp/* /var/cache/apk/* \
  && npm install --unsafe-perm=true --allow-root \
  && npm run build
COPY . /app

EXPOSE 3000

CMD [ "npm", "run", "start" ]