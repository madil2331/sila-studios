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

*Built with Next.js 14 · Deployed on Vercel · Domain via Hostinger*
