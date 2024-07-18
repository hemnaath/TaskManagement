FROM node:21-alpine

WORKDIR /Users/hemnaathsurya/Documents/TaskManagement

COPY package.json /Users/hemnaathsurya/Documents/TaskManagement

RUN npm install -g forever && npm install

COPY .  /Users/hemnaathsurya/Documents/TaskManagement

CMD ["forever", "start", "-c", "node", "app.js"]