FROM node:lts

WORKDIR /app

COPY package.json .env ./ 

RUN npm install  
RUN npm run dev

COPY ./ ./
