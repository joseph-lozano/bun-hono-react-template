FROM oven/bun:1.0.22-debian as builder

WORKDIR /app

COPY package.json .
COPY packages/api/package.json ./packages/api/package.json
COPY packages/web/package.json ./packages/web/package.json

RUN bun install

COPY . .

RUN bun run build

FROM oven/bun:1.0.22-slim as runner

WORKDIR /app

COPY --from=builder /app/packages/web/dist ./packages/web/dist
COPY packages/api ./packages/api
COPY package.json ./package.json

CMD bun run start
