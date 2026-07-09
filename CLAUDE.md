@AGENTS.md

## Deployment

Production is a Next.js app behind nginx, managed by pm2 (process `watchns`),
served over HTTPS via Let's Encrypt (auto-renews). The database is SQLite
(`watchns.db`) in the app directory — gitignored, never committed; back it up
and migrate it manually.

**Server connection details** (host, SSH user + key, app path, port) live in
`DEPLOYMENT.local.md`, which is gitignored and intentionally kept out of this
public repo.

**To deploy:**
1. Push changes to `origin/main`.
2. SSH into the server and `cd` to the app directory (see `DEPLOYMENT.local.md`).
3. Run `bash deploy.sh` — pulls `main`, installs deps, runs `drizzle-kit push`,
   builds, and (re)starts the pm2 process.

nginx, SSL, and pm2 boot-persistence changes require root — see `DEPLOYMENT.local.md`.
