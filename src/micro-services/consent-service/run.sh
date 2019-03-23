#!/bin/bash

if [ $NODE_ENV == 'prod' ]
then
    pm2-runtime app.js
fi
if [ $NODE_ENV == 'test' ]
then
    (npm run dev&) && npx newman -e GlobeConsentService.postman_environment.json run GlobeConsentService.postman_collection.json
    npm test
else
    npx nodemon app.js
fi