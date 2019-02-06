FROM node:10

LABEL maintainer="Srijan Technologies"

WORKDIR /usr/src/install

COPY package.json ./

RUN npm i

ENV NODE_PATH=/usr/src/install/node_modules

WORKDIR /usr/src/app

VOLUME ["/usr/src/app"]

COPY . ./

EXPOSE 4000

RUN npm i -g nodemon

RUN apt-get update && apt-get install build-essential

CMD chmod +x run.sh && ./run.sh