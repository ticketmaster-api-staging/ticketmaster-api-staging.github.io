FROM 889199535989.dkr.ecr.us-east-1.amazonaws.com/ccp-discovery/renderer-base

ADD package.json ./

RUN npm install --only=prod

ADD _site ./_site

ADD server.js ./

ENTRYPOINT /usr/bin/node ./server.js

# docker build -f ./docker/deploy.dockerfile --build-arg --build-arg git_describe=`git describe --all --long` build_date=`date -u +%Y-%m-%dT%H:%M:%SZ` --tag controller .