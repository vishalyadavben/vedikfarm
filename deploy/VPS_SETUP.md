# One-time VPS setup (Oracle Cloud "Always Free" VM)

Run through this once when setting up the server. Everything after this is just
`git pull && docker compose up -d --build` to deploy an update.

## 1. Provision the VM

1. Create an Oracle Cloud account, create a VM instance using the **Ampere A1 (ARM)** shape
   on the **Always Free** tier (Ubuntu 22.04 or later is the simplest image to start from).
2. Note the VM's public IP address.
3. Open ports 80 and 443 in the VM's security list/network security group (Oracle blocks
   these by default even though the OS firewall allows them - both need to be opened).

## 2. Point DNS at it

In Cloudflare's DNS settings for vedikfarm.in, add an A record:
`api` → `<VPS public IP>`, proxy status **DNS only** (grey cloud) so Caddy can complete
Let's Encrypt's certificate challenge directly - switch it to proxied (orange cloud) afterwards if you want Cloudflare's CDN/DDoS protection in front of the API too.

## 3. Install Docker and Caddy on the VM

```bash
ssh ubuntu@<VPS public IP>

# Docker
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
newgrp docker

# Caddy (installed directly on the host, not in a container, so it can bind :80/:443)
sudo apt update && sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update && sudo apt install -y caddy
```

## 4. Deploy the app

```bash
git clone <your repo URL> vedikfarm
cd vedikfarm
cp backend/.env.example .env
nano .env   # fill in every value - see the comments in the file for where each one comes from
docker compose up -d --build
```

Check it's up: `curl http://localhost:8080/actuator/health` should return `{"status":"UP"}`.

## 5. Configure Caddy

```bash
sudo cp deploy/Caddyfile /etc/caddy/Caddyfile
sudo systemctl restart caddy
```

Caddy will automatically get a certificate for api.vedikfarm.in from Let's Encrypt.
Check `https://api.vedikfarm.in/actuator/health` from your own machine once it's done.

## 6. Point the Razorpay webhook at it

In the Razorpay dashboard: Settings → Webhooks → Add New Webhook.
- URL: `https://api.vedikfarm.in/api/webhooks/razorpay`
- Active events: at minimum `payment.captured`
- Copy the webhook secret it generates into `.env` as `RAZORPAY_WEBHOOK_SECRET`, then
  `docker compose up -d` again to pick it up.

## 7. Deploying updates later

```bash
cd vedikfarm
git pull
docker compose up -d --build
```

Flyway runs any new migrations automatically on backend startup - no manual DB steps needed.

## Backups

MySQL data lives in the `mysql_data` Docker volume. Back it up on a cron job, e.g.:

```bash
docker compose exec -T mysql mysqldump -u root -p"$MYSQL_ROOT_PASSWORD" vedikfarm > backup-$(date +%F).sql
```

Copy these backups off the VM (e.g. to Cloudflare R2 or another remote) - a backup that
only lives on the same machine as the database doesn't protect you from that machine dying.

## If Oracle reclaims the free-tier capacity

Oracle has been inconsistent about enforcing its 2026 free-tier reduction (see the plan's
notes). If this VM ever gets reclaimed or throttled, the fastest fallback is a small paid
VPS (DigitalOcean/Hetzner, ~$5-6/mo) - since everything here runs through Docker Compose,
the migration is: provision the new box, repeat steps 1-3 above, `git clone` + restore the
latest MySQL backup, repeat steps 5-6. No application code changes needed.
