FROM node:latest

LABEL maintainer="Srijan Tech" 

WORKDIR /usr/src/app

VOLUME [ "/usr/src/app" ]

COPY . ./

ENV NODE_ENV=dev

ENV PORT_NUMBER=5000

RUN npm install

EXPOSE 5000

CMD ["npx","nodemon", "./index.js"]

