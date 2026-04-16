#!/bin/bash
set -e

APP_DIR="/var/www/watchns"
APP_NAME="watchns"

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

echo "==> Restarting pm2 process..."
pm2 restart "$APP_NAME"

echo "==> Done. WatchNS deployed successfully."
pm2 status "$APP_NAME"
