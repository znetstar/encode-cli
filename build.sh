#!/bin/bash

docker buildx build -f dockerfiles/native.Dockerfile -t znetstar/encode-cli:native --push --platform linux/amd64,linux/arm64 --progress tty .
docker buildx build -f dockerfiles/native.Dockerfile -t znetstar/encode-cli:latest --push --platform linux/amd64,linux/arm64 --progress tty .
docker buildx build -f dockerfiles/slim.Dockerfile -t znetstar/encode-cli:slim --push --platform linux/amd64,linux/arm64 --progress tty .
