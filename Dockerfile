# How to run the docker image:
# docker run -p3333:3333 -e "PORT=3333" artfair
# -p to specify which port from inside the container should map to a port on your computer
#    NOTE: Make sure the ports you specify match the port being used by the container.
# -e to specify environment variables. If omitted, the default PORT value will be 3333
FROM node
WORKDIR /app

# Environment Variables
ENV PORT=3333

# Prepare dependencies
COPY package.json .
COPY yarn.lock .
COPY packages/client ./packages/client
COPY packages/common ./packages/common
COPY packages/server ./packages/server
RUN yarn install

# Build Each Package
WORKDIR /app/packages/client
RUN yarn build
WORKDIR /app/packages/common
RUN yarn build
WORKDIR /app/packages/server
RUN yarn build

# Build App
WORKDIR /app
COPY . /app 
CMD node ./packages/server/dist/index.js
EXPOSE $PORT

### Output from running 'yarn full-start' #############################
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