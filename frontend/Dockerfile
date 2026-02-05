FROM node:25.5.0-alpine3.22

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD [ "npm", "run", "serve" ]
