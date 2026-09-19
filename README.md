# Vedik Farm

A2 Gir cow milk products and organic goods - e-commerce site, rebuilt from scratch.

- `backend/` - Spring Boot 3 / Java 17 REST API, MySQL 8, Flyway, JWT auth, Razorpay payments
- `frontend/` - React + Vite storefront and admin panel
- `docker-compose.yml` - runs backend + MySQL together (local dev and production VPS)
- `deploy/` - Caddy reverse-proxy config and VPS setup instructions

## Local development

**Backend + database:**
```bash
cp backend/.env.example .env
# fill in .env - at minimum JWT_SECRET; Razorpay/R2/SMTP can stay blank for local browsing,
# but checkout and image upload need real Razorpay test keys / R2 credentials to work.
docker compose up -d --build
```
Runs the API at `http://localhost:8090`. Flyway applies the schema and seeds the real
product catalog and a bootstrap admin account (`admin@vedikfarm.in` / `ChangeMe123!` -
change this password immediately, see the comment in `V3__seed_admin_user.sql`).

**Frontend:**
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```
Runs at `http://localhost:5174` against the local backend.

## Deploying

- **Frontend** → Cloudflare Pages, connected to this repo's `frontend/` folder
  (build command `npm run build`, output directory `dist`). Free tier, and unlike
  Vercel's Hobby plan, Cloudflare's free tier explicitly allows commercial use.
- **Backend + MySQL** → self-hosted via Docker Compose on an Oracle Cloud "Always Free"
  VM, behind Caddy for automatic HTTPS. Full walkthrough in `deploy/VPS_SETUP.md`.

## Before launch - things that still need real information

These were intentionally left as placeholders because the correct values depend on
information only the business owner has:

1. **Two products have no price** (`Organic Ajwain`, `Organic Jaggery Powder`) - set in
   the admin panel, currently marked inactive so they don't show with a Rs.0 price.
2. **5 more products** were on the live site but weren't visible when this was built
   (pagination hid them) - add them via the admin panel.
3. **GST rate per product** defaults to 0% - confirm the correct rate per product
   (depends on HSN classification, loose vs. packaged) with an accountant, then set it
   per-product in the admin panel.
4. **Shipping fee below the free-shipping threshold** (`SHIPPING_FLAT_FEE`, currently a
   placeholder Rs.49) - the live site only ever stated the free-shipping threshold
   (orders above Rs.999), never the fee below it. Confirm the real number.
5. **Razorpay account** needs to complete KYC (PAN, bank account, GST if registered)
   before it can accept real (non-test) payments.
