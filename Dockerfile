FROM node:20.3-alpine3.17 AS base

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package-lock.json package.json /app/
RUN npm install -g pnpm
RUN pnpm install


FROM base AS builder

WORKDIR /app

COPY --from=base /app/node_modules ./node_modules

COPY . .

COPY ./public/$FAVICON_FILE.ico ./public/favicon.ico

RUN pnpm build


FROM node:20.3-alpine3.17 AS runner

WORKDIR /home/nextjs
RUN npm install -g pnpm

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

COPY ./public/$FAVICON_FILE.ico ./public/favicon.ico
COPY --from=builder --chown=nextjs:nodejs /app/src ./src

USER nextjs

CMD ["pnpm","start"]