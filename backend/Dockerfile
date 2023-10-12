FROM node:14.15.4-alpine3.12

WORKDIR /usr/app

COPY ["package.json", "package-lock.json*", "./"]
RUN npm install

RUN mkdir -p /usr/app/uploads

COPY dist/ ./

# @todo tsc build instead of copy dist 