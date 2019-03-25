#!/bin/bash

if [ $NODE_ENV == 'prod' ]
then
    pm2-runtime app.js
fi
if [ $NODE_ENV == 'test' ]
then
    # (npm test ; npm run dev&) && npx newman -e auth_service.postman_environment.json run auth_service.postman_collection.json
    npm test
else
    npx nodemon app.js
fi