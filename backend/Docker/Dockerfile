FROM node:12

RUN mkdir -p /app

WORKDIR /app

# COPY package*.json /app
COPY package*.json ./

RUN npm install

COPY . /app

EXPOSE 5000

RUN nodemon index.js

CMD ["npm", "dev"]