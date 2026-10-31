#!/usr/bin/env bash
# Deploy em https://restohub.com.br/lista-compras (servidor `oracle` do ~/.ssh/config).
# Uso: deploy/deploy-oracle.sh [api|front]   (sem argumento: os dois)
set -euo pipefail

HOST=oracle
REMOTE=/srv/compras
API_DIR="$(cd "$(dirname "$0")/.." && pwd)"
FRONT_DIR="$API_DIR/../lista-compras"
what="${1:-all}"

if [[ $what == all || $what == api ]]; then
  rsync -az --delete \
    --exclude /node_modules/ --exclude /dist/ --exclude /server --exclude '/.env*' \
    --exclude /.git/ --exclude /prisma/generated/ --exclude /src/generated/ \
    "$API_DIR/" "$HOST:$REMOTE/src/"
  rsync -az "$API_DIR/deploy/docker-compose.yml" "$HOST:$REMOTE/"
  rsync -az "$API_DIR/deploy/compras.conf" "$HOST:$REMOTE/nginx/"
  ssh "$HOST" "cd $REMOTE && docker compose up -d --build && sudo nginx -t && sudo systemctl reload nginx"
fi

if [[ $what == all || $what == front ]]; then
  (cd "$FRONT_DIR" && VITE_API_URL=/compras-api/ bun run build)
  rsync -az --delete "$FRONT_DIR/lista-compras/" "$HOST:$REMOTE/www/lista-compras/"
fi
