FROM node:24-alpine AS build

WORKDIR /app

# Copy root workspace files
COPY package.json package-lock.json ./
COPY apps/server/package*.json ./apps/server/

RUN npm ci --ignore-scripts

COPY apps/server/ ./apps/server/

RUN npm run build --workspace=apps/server

FROM node:24-alpine AS production

WORKDIR /app

COPY --from=build /app/apps/server/dist ./dist
COPY apps/server/package*.json ./
RUN npm ci --omit=dev --ignore-scripts

USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --spider http://localhost:3000/

ENTRYPOINT ["node", "dist/main"]
