@AGENTS.md

## Deployment

- Domain: https://watchns.world (SSL via Let's Encrypt — issue with certbot on the new server once DNS is cut over)
- Server: `ssh -i ~/.ssh/REDACTED-KEY agents@REDACTED-HOST` (DigitalOcean)
- App directory on server: `~/companies/watchns` (`REDACTED-PATH/companies/watchns`)
- Process manager: pm2 (process name: `watchns`, port 3001)
- Reverse proxy: nginx (`/etc/nginx/sites-enabled/watchns.conf`, proxies watchns.world → 127.0.0.1:3001)
- Database: SQLite at `watchns.db` in the app dir (gitignored — not in the repo; upload/back up manually)
- Deploy: push to origin, then `ssh -i ~/.ssh/REDACTED-KEY agents@REDACTED-HOST`, `cd ~/companies/watchns`, run `bash deploy.sh`
