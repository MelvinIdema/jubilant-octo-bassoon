FROM node:hydrogen-alpine

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

CMD [ "npm", "run", "start" ]