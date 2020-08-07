FROM golang:1.14 AS base

WORKDIR /project

COPY go.mod go.sum air.toml ./
COPY src src

RUN go get ./...

FROM base AS dev

RUN go get -u github.com/cosmtrek/air
