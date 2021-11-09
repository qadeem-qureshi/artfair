
### Output of 'yarn full-start' #############################
# yarn run v1.22.15
# $ yarn common-build && yarn client-build && yarn server-start
# $ yarn workspace @artfair/common build
# $ tsc
# $ yarn workspace @artfair/client build
# $ yarn clean
# $ rimraf build dist
# $ parcel build src/index.html --no-source-maps --out-dir dist --cache-dir build/cache
# ✨  Built in 7.64s.

# dist/src.d8730abd.js         1010.73 KB    6.86s
# dist/favicon.816406fa.ico       3.78 KB    279ms
# dist/index.html                   516 B    730ms
# $ yarn workspace @artfair/server start
# $ ts-node src/index
# App listening at http://localhost:3000

FROM node
WORKDIR /app

# Prepare dependencies
COPY package.json /app
COPY yarn.lock /app
RUN yarn install

# Build App
COPY . /app 
#CMD yarn workspace @artfair/server build
EXPOSE 3000