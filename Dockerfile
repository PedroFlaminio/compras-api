FROM oven/bun:1-slim

WORKDIR /app

COPY package.json .

RUN bun install --frozen-lockfile
RUN apt-get update -y && apt-get install -y openssl

COPY prisma ./prisma

RUN bun run prisma generate

COPY src ./src

USER bun

EXPOSE 3000

CMD ["bun", "src/index.ts"]