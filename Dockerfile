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