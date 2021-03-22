FROM node:10

# Create app directory
WORKDIR /usr/src/api

# Bundle app source
ADD . .

# Instal deps
RUN yarn
