# ========================
# Base comum otimizada
# ========================
FROM node:20-alpine AS base

# Instalar apenas dependências essenciais
RUN apk add --no-cache \
    libc6-compat \
    dumb-init \
    curl

WORKDIR /app

# ========================
# Etapa 1: Dependências
# ========================
FROM base AS deps

# Copiar arquivos de dependências
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

# Instalar dependências com melhor detecção
RUN \
  if [ -f yarn.lock ]; then \
    echo "Instalando com Yarn..." && \
    yarn --frozen-lockfile --production=false; \
  elif [ -f package-lock.json ]; then \
    echo "Instalando com NPM..." && \
    npm ci; \
  elif [ -f pnpm-lock.yaml ]; then \
    echo "Instalando com PNPM..." && \
    corepack enable pnpm && pnpm i --frozen-lockfile; \
  else \
    echo "Nenhum lockfile encontrado!" && exit 1; \
  fi

# ========================
# Etapa 2: Build Inteligente
# ========================
FROM base AS builder

# Instalar dependências de build apenas se necessário
RUN apk add --no-cache python3 make g++

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build arguments para diferentes ambientes
ARG NODE_ENV=production
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_MINIO_URL
ARG REACT_APP_API_URL
ARG REACT_APP_MINIO_URL

# Configurar variáveis de ambiente
ENV NODE_ENV=$NODE_ENV
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_MINIO_URL=$NEXT_PUBLIC_MINIO_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_MINIO_URL=$REACT_APP_MINIO_URL
ENV GENERATE_SOURCEMAP=false

# Detectar tecnologia e fazer build apropriado
RUN echo "Detectando tecnologia..." && \
    if grep -q '"next"' package.json; then \
      echo "Next.js detectado"; \
      echo "Configurando output standalone..."; \
      if [ ! -f next.config.js ]; then \
        echo 'const nextConfig = { output: "standalone" }; module.exports = nextConfig;' > next.config.js; \
      fi && \
      echo " Building Next.js..." && \
      if [ -f yarn.lock ]; then yarn build; \
      elif [ -f package-lock.json ]; then npm run build; \
      elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm build; \
      else npm run build; fi; \
    elif [ -d "src" ] && grep -q '"react"' package.json; then \
      echo "React SPA detectado"; \
      echo " Building React SPA..." && \
      if [ -f yarn.lock ]; then yarn build; \
      elif [ -f package-lock.json ]; then npm run build; \
      elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm build; \
      else npm run build; fi; \
    else \
      echo "Tecnologia não suportada ou package.json inválido!" && exit 1; \
    fi

# Verificar se build foi criado corretamente
RUN if grep -q '"next"' package.json; then \
      test -d .next || (echo "Build Next.js falhou!" && exit 1); \
      echo "Build Next.js criado com sucesso"; \
    else \
      test -d build || (echo "Build React falhou!" && exit 1); \
      echo "Build React criado com sucesso"; \
    fi

# ========================
# Etapa 3A: Next.js Runner (Porta 3000 - Compatível com proxy HML)
# ========================
FROM base AS runner-nextjs

WORKDIR /app

# Configurar ambiente
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Criar usuário não-root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copiar arquivos necessários do build Next.js
COPY --from=builder /app/package.json ./package.json

# Copiar build standalone do Next.js
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Criar script de inicialização
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'echo "NoWast Frontend (Next.js) iniciando..."' >> /app/start.sh && \
    echo 'echo "Porta: $PORT"' >> /app/start.sh && \
    echo 'echo "Ambiente: $NODE_ENV"' >> /app/start.sh && \
    echo 'echo "API URL: $NEXT_PUBLIC_API_URL"' >> /app/start.sh && \
    echo 'echo "MinIO URL: $NEXT_PUBLIC_MINIO_URL"' >> /app/start.sh && \
    echo 'exec dumb-init node server.js' >> /app/start.sh && \
    chmod +x /app/start.sh && \
    chown nextjs:nodejs /app/start.sh

USER nextjs

# CORRIGIDO: Porta consistente (era 3001)
EXPOSE 3000

# Health check robusto
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || curl -f http://localhost:3000/ || exit 1

# Labels para metadados
LABEL maintainer="NoWast Team"
LABEL version="1.0"
LABEL description="NoWast Frontend - Next.js"
LABEL port="3000"

CMD ["/app/start.sh"]

# ========================
# Etapa 3B: React SPA Runner (Porta 8080 - Para build estático)
# ========================
FROM nginx:alpine AS runner-spa

# Instalar dependências
RUN apk add --no-cache curl dumb-init

# Copiar build do React
COPY --from=builder /app/build /usr/share/nginx/html

# Configuração NGINX otimizada
COPY <<EOF /etc/nginx/conf.d/default.conf
# NoWast Frontend - React SPA

# Configuração de compressão
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_comp_level 6;
gzip_types
    text/plain
    text/css
    text/xml
    text/javascript
    application/javascript
    application/xml+rss
    application/json
    application/xml
    image/svg+xml;

server {
    listen 8080;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Security headers
    add_header X-Content-Type-Options nosniff always;
    add_header X-Frame-Options DENY always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Cache para arquivos estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|webp|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Vary "Accept-Encoding";
    }

    # SPA - todas as rotas para index.html
    location / {
        try_files \$uri \$uri/ /index.html;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
        add_header Expires "0";
    }

    # Health check
    location /health {
        access_log off;
        return 200 "NoWast Frontend SPA OK\\n";
        add_header Content-Type text/plain;
    }

    # Logs
    access_log /var/log/nginx/nowast-frontend.access.log;
    error_log /var/log/nginx/nowast-frontend.error.log warn;
}
EOF

# Criar usuário não-root
RUN addgroup -g 1001 -S appuser && \
    adduser -S appuser -u 1001 -G appuser

# Ajustar permissões
RUN chown -R appuser:appuser /usr/share/nginx/html /var/cache/nginx /var/log/nginx && \
    mkdir -p /var/run/nginx && \
    chown -R appuser:appuser /var/run/nginx

# Script de inicialização
RUN echo '#!/bin/sh' > /docker-entrypoint.sh && \
    echo 'echo "NoWast Frontend (React SPA) iniciando..."' >> /docker-entrypoint.sh && \
    echo 'echo "Porta: 8080"' >> /docker-entrypoint.sh && \
    echo 'echo "Ambiente: $NODE_ENV"' >> /docker-entrypoint.sh && \
    echo 'echo "API URL: $REACT_APP_API_URL"' >> /docker-entrypoint.sh && \
    echo 'echo "MinIO URL: $REACT_APP_MINIO_URL"' >> /docker-entrypoint.sh && \
    echo 'exec dumb-init nginx -g "daemon off;"' >> /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh

USER appuser
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

# Labels para metadados
LABEL maintainer="NoWast Team"
LABEL version="1.0"
LABEL description="NoWast Frontend - React SPA"
LABEL port="8080"

CMD ["/docker-entrypoint.sh"]

# ========================
# Targets para build específico
# ========================
# Para Next.js: docker build --target runner-nextjs
# Para React SPA: docker build --target runner-spa
# Padrão (auto-detect): docker build (detecta automaticamente)

