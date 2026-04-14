# ─────────────────────────────────────────────────────────────
# Stage 1: BUILD — compile the React/Vite app
# ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package.json ./

# Install fresh (no lockfile) — avoids Windows-generated lockfile
# platform mismatch that causes @rollup/rollup-linux-x64-musl error
RUN npm install

# Copy env for Docker build (sets VITE_API_URL=/api for nginx proxy)
COPY .env.docker .env

# Copy all source files
COPY . .

# Build production bundle → outputs to /app/dist
RUN npm run build

# ─────────────────────────────────────────────────────────────
# Stage 2: SERVE — nginx serves the built static files
# ─────────────────────────────────────────────────────────────
FROM nginx:alpine

# Copy built React app into nginx html directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config (handles React Router + API proxy)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]