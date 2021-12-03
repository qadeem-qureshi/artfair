# See the Docker section of README.md for help
FROM node

# Environment Variables
ENV PORT=3000

# Add Work Directory
WORKDIR /app

# Install App Dependencies
COPY package.json .
COPY yarn.lock .
COPY packages/client ./packages/client
COPY packages/common ./packages/common
COPY packages/server ./packages/server
RUN yarn install

# Build App
WORKDIR /app
EXPOSE $PORT
CMD [ "yarn", "full-start"]