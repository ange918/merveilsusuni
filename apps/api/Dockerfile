FROM node:20-alpine AS builder

RUN npm install -g pnpm@10

WORKDIR /app

# Copie des manifestes workspace (nécessaires pour pnpm frozen-lockfile)
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml turbo.json ./
COPY apps/api/package.json ./apps/api/package.json
COPY apps/web/package.json ./apps/web/package.json

# Installation des dépendances
RUN pnpm install --frozen-lockfile

# Copie du code source API
COPY apps/api/ ./apps/api/

# Build NestJS
RUN pnpm --filter api build

# ---- Image de production ----
FROM node:20-alpine AS runner

RUN npm install -g pnpm@10

WORKDIR /app

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/api/package.json ./apps/api/package.json
COPY apps/web/package.json ./apps/web/package.json

RUN pnpm install --frozen-lockfile --prod

COPY --from=builder /app/apps/api/dist ./apps/api/dist

EXPOSE 3001

CMD ["node", "apps/api/dist/main"]
