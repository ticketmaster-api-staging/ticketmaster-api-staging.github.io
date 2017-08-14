FROM 889199535989.dkr.ecr.us-east-1.amazonaws.com/ccp-discovery/renderer-base

ADD package.json ./

RUN npm install --only=prod

ARG git_describe
ARG build_date

ENV GIT_DESCRIBE ${git_describe}
ENV BUILD_DATE ${build_date}

ADD static ./static

ENTRYPOINT /usr/bin/node ./server.js

