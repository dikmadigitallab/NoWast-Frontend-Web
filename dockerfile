# Etapa base
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat openssl3 openssl-dev libssl3

# ========================
# Etapa 1: Dependências
# ========================
FROM base AS deps
WORKDIR /app
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
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
COPY --from=deps /app/node_modules ./node_modules
COPY . .
COPY .env.production .env  
# garante que NEXT_PUBLIC_API_URL seja usado no build
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
ENV PORT=3001

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next

RUN chown -R nextjs:nodejs /app
USER nextjs

#EXPOSE 3001
# Porta
<<<<<<< HEAD
EXPOSE 3000
ENV PORT=3000
=======
EXPOSE 18649
#EXPOSE 3001
ENV PORT=18649
>>>>>>> 119c802ec92bb01c23ae3ec2c950284b2a523b29
ENV HOSTNAME="0.0.0.0"

CMD ["npx", "next", "start", "-p", "3000", "-H", "0.0.0.0"]
# Inicia o Next.js
#CMD ["npm", "run", "start"]


# docker build -t meu-app .

#docker run -p 18649:18649 --name meu-app-container meu-app