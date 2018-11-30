#!/bin/bash

if [ $NODE_ENV == 'prod' ]
then
    pm2-runtime app.js
fi
if [ $NODE_ENV == 'test' ]
then
    (npm test ; npm run dev&) && npx newman -e Globe.2FA.Development.postman_environment.json run globe.2FA.postman_collection.json
else
    npx nodemon app.js
fi