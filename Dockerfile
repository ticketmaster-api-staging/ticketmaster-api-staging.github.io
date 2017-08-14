FROM node:slim

ADD package.json ./

RUN npm i
# RUN npm install -g nodemon

ADD .env ./
ADD .babelrc ./
ADD ./extracted_queries.json ./

ADD data ./data
ADD server.js ./

ENTRYPOINT ./node_modules/.bin/babel-node  ./server.js


# docker run -i -t -p 8081:8081 graphql-poc
