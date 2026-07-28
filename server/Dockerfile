FROM node:24-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci --ignore-scripts

COPY . .
RUN npm run build

FROM node:24-alpine AS production

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts

USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --spider http://localhost:3000/

ENTRYPOINT ["node", "dist/main"]
