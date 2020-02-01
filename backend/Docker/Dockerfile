FROM node:12

RUN mkdir -p /app

WORKDIR /app

# COPY package*.json /app
COPY package*.json ./

RUN npm install

RUN ./node_modules/.bin/web-push generate-vapid-keys
#ENV <KEY>=<VALUE> where VALUE is the vapid key generated

COPY . /app

EXPOSE 5000

RUN nodemon index.js

CMD ["npm", "dev"]