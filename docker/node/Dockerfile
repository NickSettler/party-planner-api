FROM node:16-alpine

WORKDIR /app

COPY package.json .
COPY yarn.lock .
COPY nest-cli.json .
COPY tsconfig.json .
COPY tsconfig.build.json .

RUN yarn install

