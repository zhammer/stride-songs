#!/bin/bash

if [ -z "$REFRESH_TOKEN" ]; then
    echo 'must set $REFRESH_TOKEN'
    exit 1
fi

query="
mutation AddUser {
  insert_users_one(object: {spotify_refresh_token: \"$REFRESH_TOKEN\"}) {
    id
  }
}
"
# remove newlines and escape quotes
query=$(echo $query | tr -d '\n' | sed 's/\"/\\"/g')

curl -X POST -H 'content-type: application/json' \
     -d "{ \"query\": \"$query\" }" \
     http://localhost:8080/v1/graphql

