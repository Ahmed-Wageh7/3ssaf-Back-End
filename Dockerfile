FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY config ./config
COPY scripts ./scripts
COPY src ./src

RUN mkdir -p uploads

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "src/main.js"]
