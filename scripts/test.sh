#!/bin/bash

# i believe it's a bug that docker-compose complains about not being able
# to find .env. .env is overriden by .env.test in the override yml file.
# for the sake of CI passing, we create an empty .env file if it doesnt exist.
touch .env

# we need docker version at least 18.03 to use host.docker.internal on linux
docker -v

docker-compose -f docker-compose.yml -f docker-compose.test.yml up -d
