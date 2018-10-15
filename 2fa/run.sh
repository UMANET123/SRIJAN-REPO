#!/bin/bash

if [ $NODE_ENV == 'prod' ]
then
    pm2-runtime index.js
fi
if [ $NODE_ENV == 'test' ]
then
    npm test
else
    npx nodemon index.js
fi