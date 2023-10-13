FROM node:14.15.4-alpine3.12

WORKDIR /usr/app

COPY ["package.json", "package-lock.json*", "./"]
RUN npm install && npm install typescript -g

RUN mkdir -p /usr/app/uploads

COPY . .

RUN tsc -p tsconfig.build.json