FROM node:10

LABEL maintainer="Srijan Tech" 

WORKDIR /usr/src/app

VOLUME [ "/usr/src/app" ]

VOLUME [ "/var/log/ "]

COPY . ./

ENV PORT_NUMBER=3000

EXPOSE 3000

RUN npm install && npm install pm2 -g
CMD chmod +x run.sh && ./run.sh