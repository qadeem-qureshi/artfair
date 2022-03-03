#!/usr/bin/env bash

# set environment variables
export HOSTNAME=$1
export PORT=$2

# install dependencies
yarn install

# build packages
yarn full-build

# start the server
node packages/server/dist/index.js
