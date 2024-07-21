FROM node:18

# Create app directory

WORKDIR /usr/src/app

COPY . .

# If you are building your code for production
RUN npm ci --only=production

# Build the Client
RUN npm install && npm run build

# Bundle app source


EXPOSE 3000
CMD [ "node","server.js" ]