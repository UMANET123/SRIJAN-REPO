#!/bin/bash

if [ $NODE_ENV == "prod" ]
then
    echo "I am in production"
elif [ $NODE_ENV == "dev" ]    
then
    echo "I am in develop"
elif [ $NODE_ENV == "test" ]
then
    npm run test
else
    echo "Environment Variable Not Set"
fi