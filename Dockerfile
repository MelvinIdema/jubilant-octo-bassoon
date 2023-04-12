FROM node:hydrogen-alpine

WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/

COPY . .
RUN npm install
RUN npm run build
RUN npx prisma generate

CMD [ "sh", "-c", "/app/docker-entrypoint.sh" ]
