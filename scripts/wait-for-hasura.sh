#!/bin/bash

# from: https://stackoverflow.com/a/50583452

attempt_counter=0
max_attempts=20

until $(curl --output /dev/null --silent --fail http://localhost:8080/healthz); do
    if [ ${attempt_counter} -eq ${max_attempts} ];then
      echo "Max attempts reached"
      exit 1
    fi

    printf '.'
    attempt_counter=$(($attempt_counter+1))
    sleep 5
done
