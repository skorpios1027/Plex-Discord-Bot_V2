FROM node:lts

WORKDIR /home/PlexBot/

COPY package*.json ./

RUN npm install

COPY . .

CMD node plex-bot.js
