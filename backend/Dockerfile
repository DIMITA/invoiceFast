FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps --no-audit --no-fund
COPY . .
RUN ./node_modules/.bin/nest build

FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production --legacy-peer-deps --no-audit --no-fund
COPY --from=builder /app/dist ./dist
EXPOSE 3001
CMD ["node", "dist/main"]
