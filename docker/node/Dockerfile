FROM node:16-alpine

WORKDIR /app

COPY package.json .
COPY yarn.lock .
COPY nest-cli.json .
COPY ormconfig.js .
COPY tsconfig.json .
COPY tsconfig.build.json .

RUN npm i -g typeorm

RUN yarn install

