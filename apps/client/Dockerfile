FROM node:24-alpine AS build

WORKDIR /app

# Copy root workspace files
COPY package.json package-lock.json ./
COPY apps/client/package*.json ./apps/client/

RUN npm ci --ignore-scripts

COPY apps/client/ ./apps/client/

RUN npm run build --workspace=apps/client

FROM nginx:alpine AS production

COPY apps/client/nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/apps/client/dist/client/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
