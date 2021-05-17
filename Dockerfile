FROM node:latest

ENV env prod

WORKDIR /app

COPY package.json /app
RUN  npm install --unsafe-perm=true --allow-root
COPY . /app
RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "start" ]

# docker build -t population-statistics .
# docker run --rm -p 127.0.0.1:3000:3000 --network server-package_databases -d population-statistics
