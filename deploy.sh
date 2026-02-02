#!/bin/bash

set -e -x

yarn install
yarn build

rsync -av .vitepress/dist/ web-g6:web/vhosts/today.ideamans.com/html/