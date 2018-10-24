#!/bin/bash

if [ $NODE_ENV == 'prod' ]
then
    pm2-runtime app.js
fi
if [ $NODE_ENV == 'test' ]
then
    npm test
else
    npx nodemon app.js
fi