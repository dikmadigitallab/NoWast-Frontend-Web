# ========================
# Etapa base
# ========================
FROM node:20-alpine AS base
# Instalando dependências de sistema necessárias
RUN apk add --no-cache libc6-compat openssl3 openssl-dev libssl3


# ========================
# Etapa 1: Dependências
# ========================
FROM base AS deps
WORKDIR /app

# Copia lockfiles (yarn, npm, pnpm)
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

# Instala dependências de acordo com o lockfile detectado
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi


# ========================
# Etapa 2: Build
# ========================
FROM base AS builder
WORKDIR /app

# Copia dependências já instaladas
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Copia variáveis de ambiente específicas para produção
COPY .env.production .env  

# Faz o build da aplicação Next.js
RUN if [ -f yarn.lock ]; then yarn build; \
    elif [ -f package-lock.json ]; then npm run build; \
    elif [ -f pnpm-lock.yaml ]; then pnpm build; \
    else echo "Lockfile not found." && exit 1; \
    fi


# ========================
# Etapa 3: Produção
# ========================
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# Porta padrão do Next.js (corrigido para 3000)
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# 👇 Adicionamos variáveis que ajudam Next.js a gerar URLs corretas
# BASE_URL pode ser usada internamente (API calls, configs)
# NEXT_PUBLIC_BASE_URL é exposta no frontend (navegador)
ENV BASE_URL=https://nowastev2-homologa.dikmadigital.com.br
ENV NEXT_PUBLIC_BASE_URL=https://nowastev2-homologa.dikmadigital.com.br

# Cria usuário não-root para segurança
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Copia arquivos necessários do build
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next

# Ajusta permissões
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expondo a porta correta (3000)
EXPOSE 3000

# Comando de start em produção
CMD ["npm", "run", "start", "--", "-p", "3000"]
