FROM node:22

WORKDIR /app

COPY package*.json ./

COPY docker .
RUN rm .env
RUN mv .env.production.local .env

RUN npm run build

CMD ["npm", "run", "start:prod"]
