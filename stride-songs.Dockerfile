FROM golang:1.14 AS base

WORKDIR /project

COPY go.mod go.sum ./
COPY src src

RUN go get ./...

FROM base AS dev

COPY air.toml air.toml

RUN go get -u github.com/cosmtrek/air
