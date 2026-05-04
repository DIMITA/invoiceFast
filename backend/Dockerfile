FROM node:20 AS builder
WORKDIR /app
RUN npm install -g typescript@5 --no-audit --no-fund
COPY package*.json ./
RUN npm install --legacy-peer-deps --no-audit --no-fund
COPY . .
RUN tsc -p tsconfig.json

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm install --only=production --legacy-peer-deps --no-audit --no-fund
COPY --from=builder /app/dist ./dist
EXPOSE 3001
CMD ["node", "dist/main"]
