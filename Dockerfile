FROM node:18.12.1

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

ENV PORT=3000

EXPOSE 3000
CMD [ "npm", "start" ]