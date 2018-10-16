FROM node:10

LABEL maintainer="Srijan Technologies"

WORKDIR /usr/src/app

VOLUME ["/usr/src/app"]

COPY . ./

EXPOSE 5555

RUN npm i -g http-server

CMD  http-server -p 5555