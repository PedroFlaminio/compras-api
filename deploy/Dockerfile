# Imagem de produção (servidor Oracle, ARM64): instala deps e gera o Prisma Client no build.
FROM oven/bun:1-slim

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

COPY package.json bun.lock ./
RUN bun install

COPY prisma.config.ts tsconfig.json ./
COPY prisma ./prisma
COPY src ./src
RUN bunx prisma generate && chown -R bun:bun /app

USER bun
ENV NODE_ENV=production
EXPOSE 8080

CMD ["bun", "src/index.ts"]
