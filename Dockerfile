FROM node:16-alpine

WORKDIR /usr/apps/clean-node-api

COPY ./package.json .

RUN npm install --omit=dev