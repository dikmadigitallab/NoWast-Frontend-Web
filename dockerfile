# ========================
# Base comum
# ========================
FROM node:20-alpine AS base

RUN apk add --no-cache \
    libc6-compat \
    dumb-init \
    curl

WORKDIR /app

# ========================
# Etapa 1: Dependências
# ========================
FROM base AS deps

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

RUN \
  if [ -f yarn.lock ]; then \
    yarn --frozen-lockfile --production=false; \
  elif [ -f package-lock.json ]; then \
    npm ci; \
  elif [ -f pnpm-lock.yaml ]; then \
    corepack enable pnpm && pnpm i --frozen-lockfile; \
  else \
    echo "Nenhum lockfile encontrado!" && exit 1; \
  fi

# ========================
# Etapa 2: Build
# ========================
FROM base AS builder

RUN apk add --no-cache python3 make g++

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NODE_ENV=production
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_MINIO_URL
ARG REACT_APP_API_URL
ARG REACT_APP_MINIO_URL

ENV NODE_ENV=$NODE_ENV
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_MINIO_URL=$NEXT_PUBLIC_MINIO_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_MINIO_URL=$REACT_APP_MINIO_URL
ENV GENERATE_SOURCEMAP=false

RUN if grep -q '"next"' package.json; then \
      if [ ! -f next.config.js ]; then \
        echo 'module.exports = { output: "standalone" };' > next.config.js; \
      fi && \
      (yarn build || npm run build || corepack enable pnpm && pnpm build); \
    elif grep -q '"react"' package.json; then \
      (yarn build || npm run build || corepack enable pnpm && pnpm build); \
    else \
      echo "Projeto inválido ou não suportado!" && exit 1; \
    fi

# ========================
# Etapa 3A: Runner Next.js
# ========================
FROM base AS runner-nextjs

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/package.json ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'exec dumb-init node server.js' >> /app/start.sh && \
    chmod +x /app/start.sh && \
    chown nextjs:nodejs /app/start.sh

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
    CMD curl -f http://localhost:3000/ || exit 1

CMD ["/app/start.sh"]

# ========================
# Etapa 3B: Runner React SPA
# ========================
FROM nginx:alpine AS runner-spa

RUN apk add --no-cache curl dumb-init

COPY --from=builder /app/build /usr/share/nginx/html

# Configuração do NGINX
COPY <<EOF /etc/nginx/conf.d/default.conf
server {
    listen 8080;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files \$uri /index.html;
    }

    location /health {
        return 200 "OK";
    }
}
EOF

RUN addgroup -g 1001 -S appuser && \
    adduser -S appuser -u 1001 -G appuser

RUN chown -R appuser:appuser /usr/share/nginx/html /var/cache/nginx /var/log/nginx /etc/nginx/conf.d && \
    mkdir -p /var/run/nginx && \
    chown -R appuser:appuser /var/run/nginx

USER appuser
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

CMD ["dumb-init", "nginx", "-g", "daemon off;"]

# ========================
# Targets
# ========================
# Para Next.js: docker build --target runner-nextjs -t app:next .
# Para React SPA: docker build --target runner-spa -t app:spa .
