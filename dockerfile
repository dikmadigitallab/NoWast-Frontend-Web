# =========================
# 1. Etapa base
# =========================
FROM node:20-alpine AS base

# Instalar dependências básicas
RUN apk add --no-cache libc6-compat

WORKDIR /app

# =========================
# 2. Etapa de dependências
# =========================
FROM base AS deps

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

RUN \
  if [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm install; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm install --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# =========================
# 3. Etapa de build
# =========================
FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Garantir permissão de execução do binário
RUN chmod +x ./node_modules/.bin/next && npx next build

# =========================
# 4. Etapa final de produção
# =========================
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Copiar apenas o necessário
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.* ./
COPY --from=builder /app/tsconfig.json ./tsconfig.json

# Criar usuário não-root
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs \
    && chown -R nextjs:nodejs /app
USER nextjs

# Configuração da porta
EXPOSE 18649
ENV PORT=18649
ENV HOSTNAME="0.0.0.0"

# Iniciar aplicação
CMD ["npm", "run", "start"]

#docker run -d -p 9003:9003 --name nowaste-front-end nowaste-front-end
