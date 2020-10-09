#!/bin/bash

# i believe it's a bug that docker-compose complains about not being able
# to find .env. .env is overriden by .env.test in the override yml file.
# for the sake of CI passing, we create an empty .env file if it doesnt exist.
touch .env

# if we're running this in github actions, update our env file to support
# linux docker routing
if ! [ -z "$GITHUB_ACTIONS" ]; then
  IP_ADDRESSES=$(ip addr show | grep "\binet\b.*\bdocker0\b" | awk '{print $2}' | cut -d '/' -f 1)
  echo "running in github actions, host.docker.internal to $IP_ADDRESSES"
  sed -i "s/host.docker.internal/$IP_ADDRESSES/" .env.test
fi

docker-compose -f docker-compose.yml -f docker-compose.test.yml up -d
