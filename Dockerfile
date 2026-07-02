FROM oven/bun:1-slim

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/* \
    && mkdir -p /app/prisma/generated \
    && chown -R bun:bun /app

USER bun

EXPOSE 8080

CMD ["bun", "run", "start"]
