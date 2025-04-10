FROM --platform=linux/amd64 node:18
# FROM node:11.12.0-alpine

# create an app directory and use it as working directory
RUN mkdir -p /ui
WORKDIR /ui

# setting up directory for node_modules to bin path so that containers folder can be used
ENV PATH /ui/node_modules/.bin:$PATH

COPY package.json ./

RUN npm install --force
# COPY package-lock.json /tasks/package-lock.json

# # RUN apk add --no-cache --virtual .gyp

# # RUN apk add --no-cache --virtual python

# # RUN apk add --no-cache --virtual make

# # RUN apk add --no-cache --virtual g++

# # RUN apk add --no-cache autoconf automake

# RUN apk add --no-cache nasm pkgconfig libtool build-base zlib-dev

# RUN npm install        

RUN npm install pm2@latest -g

COPY . .

# allow port 2001 to be publicly available
EXPOSE 2001

# run command
CMD pm2 start pm2-dev.json && tail -f /dev/null
