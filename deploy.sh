#!/bin/bash
set -e

APP_DIR="$HOME/companies/watchns"
APP_NAME="watchns"
PORT=3001

echo "==> Deploying WatchNS..."

cd "$APP_DIR"

echo "==> Pulling latest changes..."
git pull origin main

echo "==> Installing dependencies..."
npm install --production=false

echo "==> Pushing database migrations..."
npx drizzle-kit push

echo "==> Building app..."
npm run build

echo "==> (Re)starting pm2 process..."
if pm2 describe "$APP_NAME" > /dev/null 2>&1; then
  pm2 restart "$APP_NAME" --update-env
else
  PORT="$PORT" pm2 start npm --name "$APP_NAME" -- start
  pm2 save
fi

echo "==> Done. WatchNS deployed successfully."
pm2 status "$APP_NAME"
