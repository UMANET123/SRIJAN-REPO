FROM node:10

LABEL maintainer="Srijan Technologies" 

WORKDIR /usr/src/app

VOLUME [ "/usr/src/app" ]

VOLUME [ "/var/log/" ]

COPY . ./

ENV PORT_NUMBER=5000

EXPOSE 5000

RUN npm install && npm install pm2 -g
CMD chmod +x run.sh && ./run.sh

