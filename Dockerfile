FROM node:10.13-alpine
WORKDIR /usr/src/app
COPY package*.json ./
COPY src ./src
COPY tsconfig.json ./
COPY yarn.lock ./
RUN yarn --prod
CMD [ "yarn", "start" ]
