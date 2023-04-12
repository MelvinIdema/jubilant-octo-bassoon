FROM node:hydrogen-alpine

WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/

COPY . .
RUN npm install
RUN npm run build
RUN npx prisma generate
RUN chmod +x /app/docker-entrypoint.sh

CMD [ "/bin/sh", "/app/docker-entrypoint.sh" ]
