#!/bin/bash
abort()
{
    echo >&2 '
***************
*** ABORTED ***
***************
'
    echo "An error occurred. Exiting..." >&2
    exit 1
}
trap 'abort' 0
set -e

if [ -z "$1" ]
then
  echo -n "Project: "
  read PROJECT
else
  echo "Project: $1"
  PROJECT="$1"
fi

if [ -z "$2" ]
then
  echo -n "Mode (local | development | staging | production): "
  read MODE
else
  echo "Mode: $2"
  MODE="$2"
fi


if [ -z "$PROJECT" ]
then
  echo "Project Not Found"
  exit
fi

if [ -z "$MODE" ]
then
  MODE="local"
fi

echo "--- Migration: Started ---"

echo -ne '\n'
echo "=== MIGRATE DB Project ==="
cd ./apps/resources/sql
# Export ENV_PATH so .db.config.js can pick the correct env file
export ENV_PATH=./.env.$MODE
# Map local to development for sequelize environments
SEQUELIZE_ENV=$MODE
if [ "$MODE" = "local" ]; then
  SEQUELIZE_ENV=development
fi
# Run sequelize-cli from the sql folder and point it to the JS config and migrations folder
npx sequelize-cli db:migrate --env $SEQUELIZE_ENV --config .db.config.js --migrations-path ./migrations
cd ../..

echo -ne '\n'
echo "--- Migration: Finished ---"

trap : 0

echo >&2 '
************
*** DONE *** 
************
'