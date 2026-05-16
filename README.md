# Sila Studios — Website
**silastudios.store** | *Where Elegance Fits*

---

## Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Run locally
npm run dev

# Open: http://localhost:3000
```

---

## Before Going Live — Things to Update

Search for `TODO` in the project to find all the spots you need to update.

### 1. WhatsApp Number
In all files, replace `923XXXXXXXXXX` with your actual number.
Format: `923001234567` (country code + number, no + sign, no spaces)

Files to update:
- `app/page.js`
- `app/collections/page.js`
- `app/contact/page.js`
- `components/Navbar.js`
- `components/WhatsAppButton.js`
- `components/AnnouncementBar.js`
- `components/Footer.js`

### 1b. Site URL (for tracking links)
Set this so WhatsApp messages include a correct tracking link:
- `NEXT_PUBLIC_SITE_URL=https://silastudios.store`

### 2. Products: naming + URLs (important)
Products have:
- **Product Name**: what customers see (e.g. “Embroidered Lawn Set”)
- **Internal Code / URL Handle**: what you use internally + in URLs (e.g. `lawn-set-beige-floral-01`)

In Admin → Products, set the **Internal Code / URL Handle** so your product URLs look like:
- `/products/lawn-set-beige-floral-01`

### 3. Update Announcement Bar
In `components/AnnouncementBar.js`, update the scrolling text items.

---

## Deploying to Vercel (Free)

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial Sila Studios website"
# Create a repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/sila-studios.git
git push -u origin main
```

### Step 2: Deploy on Vercel
1. Go to https://vercel.com and sign up with GitHub
2. Click "Add New Project"
3. Import your `sila-studios` repository
4. Click Deploy — it's live in 60 seconds ✅

### Step 3: Connect your Hostinger Domain
On Vercel, go to your project → Settings → Domains → Add `silastudios.store`

Vercel will show you two DNS records to add. Then:
1. Log into Hostinger
2. Go to Domains → silastudios.store → DNS / Nameservers
3. Add the two records Vercel gives you (type A and CNAME)
4. Wait 10–30 minutes for DNS propagation

That's it — your domain is live!

---

## Project Structure

```
sila-studios/
├── app/
│   ├── globals.css        ← All styles (design system)
│   ├── layout.js          ← Root layout (fonts, metadata)
│   ├── page.js            ← Homepage
│   ├── collections/
│   │   └── page.js        ← Collections page
│   ├── about/
│   │   └── page.js        ← About / Our Story
│   └── contact/
│       └── page.js        ← Contact page
├── components/
│   ├── Navbar.js          ← Navigation (sticky, mobile menu)
│   ├── Footer.js          ← Footer
│   ├── AnnouncementBar.js ← Top scrolling bar
│   └── WhatsAppButton.js  ← Floating WhatsApp button
└── public/
    ├── logo.png
    ├── logo_social.png
    └── sila_banner.png
```

---

## Phase 2 Roadmap (When Ready)
- Add/extend product schema (handles, pricing)
- Extend order management (courier integrations, templates)
- Integrate PostEx COD API
- Add Safepay/PostEx payment gateway

---

## Orders (Hybrid flow)
Flow:
1. Customer clicks **Order Now**
2. Fills form (Name, Phone, City, Size, Address)
3. Order is saved to Supabase immediately
4. Confirmation shows Order Number + opens WhatsApp with a pre-filled message (includes tracking link)

### Supabase `orders` table recommended columns
The app will work even if some columns are missing, but for best experience add:
- `cod_amount` (int)
- `order_number` (text)
- `notes` (text)
- `courier_name` (text)
- `tracking_number` (text)
- `shipment_status` (text)

Example SQL (Supabase SQL editor):
```sql
alter table public.orders
add column if not exists cod_amount integer,
add column if not exists order_number text,
add column if not exists notes text,
add column if not exists courier_name text,
add column if not exists tracking_number text,
add column if not exists shipment_status text;
```

---

## Codex Continuity Log (Backend Security Work)

This section is a running memory of what was last completed in Codex so work can resume safely after context resets.

### Last completed backend hardening (already merged in this branch)
- Admin login API hardened:
  - Better client IP detection (`x-forwarded-for`, `x-real-ip`, `cf-connecting-ip`)
  - Input validation + password length sanitization
  - Explicit “admin not configured” failure when hash is missing
  - Stronger cookie settings for admin session
- Admin auth/rate limiting hardened:
  - JWT session signing/verification through `JWT_SECRET`
  - DB-backed rate limiting in `admin_login_rate_limits`
  - Safe fallback to in-memory lockout if DB check fails
- Middleware gate simplified:
  - `/admin/*` checks for session cookie presence
  - Signature/role verification remains enforced in server APIs

### Resume checklist (do these next)
1. Verify required environment variables on Vercel:
   - `JWT_SECRET`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - Optional: `ENABLE_DB_RATE_LIMIT` (`false` disables DB limiter fallback behavior)
2. Ensure rate-limit table exists in Supabase (SQL below).
3. Run admin login E2E checks:
   - wrong password lockout behavior
   - successful login clears lockout
   - unauthenticated `/admin/*` redirects to `/admin`
4. After verification, add a short dated note under **Progress updates**.

### Verification runbook (copy/paste)
Use these steps after deploy to verify the hardening end-to-end.

1. Open `https://<your-domain>/admin` and confirm login page loads.
2. Try wrong password 5 times from same IP, then confirm 6th is rate-limited (HTTP 429).
3. Login with correct password and confirm:
   - `sila_admin_session` cookie is set
   - cookie is `HttpOnly`, `SameSite=Strict`, `Path=/`
   - in production, cookie is `Secure`
4. Logout and confirm cookie is removed.
5. Attempt direct access to an admin API without cookie:
   - `GET /api/admin/orders` should return `401`.
6. With valid cookie, repeat `GET /api/admin/orders` and confirm non-401 response.

Example quick checks with curl:
```bash
# 1) Unauthenticated should fail
curl -i https://<your-domain>/api/admin/orders

# 2) Wrong password attempt
curl -i -X POST https://<your-domain>/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"password":"wrong-password"}'

# 3) Successful login (save cookies)
curl -i -c cookies.txt -X POST https://<your-domain>/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"password":"<correct-password>"}'

# 4) Authenticated admin call using cookie jar
curl -i -b cookies.txt https://<your-domain>/api/admin/orders
```

### Supabase SQL for admin login rate limiting
```sql
create table if not exists public.admin_login_rate_limits (
  ip text primary key,
  count integer not null default 0,
  first_attempt_at timestamptz not null default now(),
  locked_until timestamptz
);

create index if not exists idx_admin_login_rate_limits_locked_until
  on public.admin_login_rate_limits (locked_until);
```

### Progress updates
- **2026-05-16**: Reconstructed prior Codex session focus. Current focus is backend security hardening for admin login/session/rate limiting. Next step is production env + Supabase table verification, then E2E auth checks.
- **2026-05-16 (later)**: Added a production verification runbook with concrete E2E steps and curl commands so validation can be executed repeatably and logged after each deploy.

---

*Built with Next.js 14 · Deployed on Vercel · Domain via Hostinger*
