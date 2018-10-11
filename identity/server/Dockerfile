FROM node:10

LABEL maintainer="Srijan Techology"

WORKDIR /usr/src/install

COPY package.json ./

RUN npm i --verbose

ENV NODE_PATH=/usr/src/install/node_modules

WORKDIR /usr/src/app

VOLUME ["/usr/src/app"]

COPY . ./

EXPOSE 4000

RUN npm i -g nodemon

RUN apt-get update && apt-get install build-essential

CMD  npm run dev