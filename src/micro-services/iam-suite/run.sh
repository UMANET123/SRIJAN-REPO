#!/bin/bash

if [ $NODE_ENV == "prod" ]
then
    npm run dev
elif [ $NODE_ENV == "dev" ]    
then
    npm run dev
elif [ $NODE_ENV == "test" ]
then
    (npm run test ; npm run dev&) && newman -e globe-identity-development.postman_environment.json run --delay-request 200 globe-identity.postman_collection.json;
else
    echo "Environment Variable Not Set"
fi