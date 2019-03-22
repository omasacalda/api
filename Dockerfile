FROM node:10

RUN mkdir /usr/src/api
WORKDIR /usr/src/api

# Install app dependencies
COPY package.json /usr/src/api
COPY . /usr/src/api
RUN cd /usr/src/api && yarn
