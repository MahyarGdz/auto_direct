FROM node:21.7.3-alpine3.20 as base

RUN corepack enable && corepack prepare pnpm@latest --activate

FROM base as deps
WORKDIR /temp-deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --loglevel info


FROM base as builder
WORKDIR /build
COPY . ./
COPY --from=deps /temp-deps/node_modules ./node_modules
RUN pnpm run build && pnpm install --prod --frozen-lockfile --loglevel info


FROM base as runner
WORKDIR /app
ENV NODE_ENV production

COPY --from=builder /build/dist ./dist
COPY --from=builder /build/.husky ./.husky
COPY --from=builder /build/db ./db
COPY --from=builder /build/node_modules ./node_modules
COPY --from=builder /build/package.json ./

EXPOSE 3000

CMD ["node", "--trace-sigint", "--trace-uncaught", "dist/server.js"]
