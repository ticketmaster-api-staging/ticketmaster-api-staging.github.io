FROM 889199535989.dkr.ecr.us-east-1.amazonaws.com/ccp-discovery/renderer-base

ADD package.json ./

RUN npm install --only=prod

ARG git_describe
ARG build_date

ENV GIT_DESCRIBE ${git_describe}
ENV BUILD_DATE ${build_date}

COPY env /app/env
ADD extracted_queries.json ./
ADD src ./src
ADD data ./data

ENTRYPOINT /usr/bin/node ./server.js

# docker build -f ./docker/deploy.dockerfile --build-arg --build-arg git_describe=`git describe --all --long` build_date=`date -u +%Y-%m-%dT%H:%M:%SZ` --tag controller .