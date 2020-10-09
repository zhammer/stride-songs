#!/bin/bash

# i believe it's a bug that docker-compose complains about not being able
# to find .env. .env is overriden by .env.test in the override yml file.
# for the sake of CI passing, we create an empty .env file if it doesnt exist.
touch .env

# if we're running this in github actions, update our env file to support
# linux docker routing
# i _do_ think host.docker.internal support has landed in linux, i just don't
# know how to set it up at the moment
# https://stackoverflow.com/questions/48546124/what-is-linux-equivalent-of-host-docker-internal/48547074#48547074
if ! [ -z "$GITHUB_ACTIONS" ]; then
  echo "running in github actions, updating files"
  sed -i 's/host.docker.internal/localhost/' .env.test
  sed -i 's/# network_mode/network_mode/' docker-compose.test.yml
fi

docker-compose -f docker-compose.yml -f docker-compose.test.yml up -d
