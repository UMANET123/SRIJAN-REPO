FROM node:10

LABEL maintainer="Srijan Techology"

WORKDIR /usr/src/app

VOLUME ["/usr/src/app"]

COPY . ./

EXPOSE 4000

RUN npm i && npm i -g nodemon

CMD ["nodemon","index.js"]