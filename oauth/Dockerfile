FROM node:10

LABEL maintainer="Srijan Techology"

WORKDIR /usr/src/install

COPY package.json ./

RUN npm i --verbose

ENV NODE_PATH=/usr/src/install/node_modules

WORKDIR /usr/src/app

VOLUME ["/usr/src/app"]

COPY . ./

EXPOSE 3333

RUN npm i -g nodemon

ENV PORT=3333

CMD  npm run dev