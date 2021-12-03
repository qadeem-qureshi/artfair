# See the Docker section of README.md for help
FROM node

# Add Work Directory
WORKDIR /app

# Install App Dependencies
COPY package.json .
COPY yarn.lock .
COPY packages ./packages
RUN yarn install

# Start App
EXPOSE 3000
CMD [ "yarn", "full-start"]
