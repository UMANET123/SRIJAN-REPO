#!/bin/bash

if [ $NODE_ENV == 'prod' ]
then
    pm2-runtime index.js
fi
if [ $NODE_ENV == 'test' ]
then
    echo 'I Reach here'
    npm test
else
    echo 'I am in dev'
    npx nodemon index.js
fi