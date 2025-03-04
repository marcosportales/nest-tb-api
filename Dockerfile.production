FROM node:22

WORKDIR /app

COPY package*.json ./

COPY . .
RUN rm .env
RUN mv .env.production .env

RUN npm run build

CMD ["npm", "run", "start:prod"]