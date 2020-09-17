#!/bin/bash

docker-compose up -d postgres
sleep 1
docker-compose up -d
