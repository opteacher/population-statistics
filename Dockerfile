FROM node:latest

ENV env prod

WORKDIR /app

COPY package.json /app
RUN  npm install --unsafe-perm=true --allow-root
COPY . /app
RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "start" ]

# sudo docker build -t=population-statistics .
# sudo docker run --rm -p 80:3000 -d population-statistics
