#!/bin/bash
set -e

APP_DIR="$HOME/companies/watchns"
APP_NAME="watchns"
PORT=3005

echo "==> Deploying WatchNS..."

cd "$APP_DIR"

echo "==> Syncing to origin/main..."
# Hard-reset to the remote so the deploy target always matches origin exactly
# (survives force-pushes / history rewrites; only affects tracked files, so the
# gitignored watchns.db and node_modules are untouched).
git fetch origin
git reset --hard origin/main

echo "==> Installing dependencies..."
npm install --production=false

echo "==> Pushing database migrations..."
npx drizzle-kit push

echo "==> Building app..."
npm run build

echo "==> (Re)starting pm2 process..."
# Run the Next.js binary directly (not via `npm start`) so pm2 manages the
# server process itself — otherwise restarts orphan the child and leak the port.
if pm2 describe "$APP_NAME" > /dev/null 2>&1; then
  pm2 restart "$APP_NAME" --update-env
else
  pm2 start node_modules/next/dist/bin/next --name "$APP_NAME" -- start -p "$PORT"
  pm2 save
fi

echo "==> Done. WatchNS deployed successfully."
pm2 status "$APP_NAME"
