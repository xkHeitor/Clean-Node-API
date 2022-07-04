#!/bin/bash

if [ "${CIRCLE_BRANCH}" == "development" ]
then
  export NODE_ENV=development
  export MONGODB_URI=${DEVELOPMENT_DB}
  npm run build
elif [ "${CIRCLE_BRANCH}" == "staging" ]
then
  export NODE_ENV=staging
  export MONGODB_URI=${STAGING_DB}
  npm run build
elif [ "${CIRCLE_BRANCH}" == "master" ]
then
  export NODE_ENV=production
  export MONGODB_URI=${PRODUCTION_DB}
  npm run build
else
  export NODE_ENV=development
  export MONGODB_URI=${DEVELOPMENT_DB}
  npm run build
fi

echo "Sucessfull build for environment: ${NODE_ENV}"

exit 0