FROM node:16-alpine

WORKDIR /usr/app

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 5050

CMD ["npm", "dev"]