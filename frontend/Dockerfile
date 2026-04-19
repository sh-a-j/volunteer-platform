# ─────────────────────────────────────────────────────────────
# Stage 1: BUILD — Node builds the Vite/React app
# ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json ./

# Install fresh (avoids Windows lockfile / platform mismatch issues)
RUN npm install

# VITE_API_URL build arg:
#   Docker local  → /api  (set via .env.docker)
#   Render cloud  → https://your-backend.onrender.com (passed as build arg)
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# If no build arg passed, fall back to .env.docker
# COPY .env.docker .env

COPY . .

RUN npm run build

# ─────────────────────────────────────────────────────────────
# Stage 2: SERVE — nginx serves the static build
# ─────────────────────────────────────────────────────────────
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
