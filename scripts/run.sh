#!/bin/bash

if [ "$1" == "reset" ]; then
    echo "resetting db..."
    docker-compose down -v
fi

docker-compose up -d postgres
sleep 1
docker-compose up -d
