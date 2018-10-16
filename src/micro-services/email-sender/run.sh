#!/bin/bash

if [ $NODE_ENV == "prod" ]
then
    npm run dev
elif [ $NODE_ENV == "dev" ]    
then
    npm run dev
elif [ $NODE_ENV == "test" ]
then
    npm run test
else
    echo "Environment Variable Not Set"
fi