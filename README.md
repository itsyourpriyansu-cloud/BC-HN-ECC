# Alemah — Premium Home Textiles PWA

A complete, production-ready direct-to-consumer e-commerce Progressive Web App for **Alemah**, a premium Indian home textile brand (bedsheets, cushion covers, quilts, curtains, table linen).

---

## ✨ Features

- **Next.js 15** App Router with TypeScript
- **Tailwind CSS v4** with full Alemah brand design-token system
- **GSAP + Lenis** for kinetic smooth scrolling and premium animations
- **Zustand** cart & UI state with localStorage persistence
- **NextAuth.js** — Email/Password, Phone OTP (mock: `123456`), Google, Apple Sign-In
- **PhonePe Payment Gateway** — Sandbox integration with SHA256 checksum (server-side only)
- **Cash on Delivery (COD)** — regional eligibility
- **Prisma ORM** with SQLite (drop-in replace with PostgreSQL)
- **PWA** — Service Worker, offline page, Add to Home Screen prompt
- **iOS-inspired design** — frosted header, bottom sheets, bottom tab bar, haptic-adjacent press states

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

```bash
cp .env.example .env
```

The `.env` file ships pre-configured with **PhonePe sandbox credentials** and a local SQLite database. No changes needed for local development.

### 3. Set Up the Database

```bash
npx prisma db push
```

### 4. Seed Product Catalog (15 products)

```bash
npx tsc prisma/seed.ts --module commonjs --target es2020 --moduleResolution node --esModuleInterop --skipLibCheck
node prisma/seed.js
```

### 5. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔑 Test Credentials

| Method | Credentials |
|--------|------------|
| Email login | `user@alemah.com` / `admin123` |
| Admin login | `admin@alemah.com` / `admin123` |
| Phone OTP | Any phone number + OTP `123456` |

---

## 💳 PhonePe Payment Gateway

### Sandbox Mode (default)

The app ships pre-configured with PhonePe's official sandbox credentials:
- **Merchant ID:** `PGTESTPAYUAT`
- **Salt Key:** `099eb0cd-02cf-4e2a-8aca-3e6c6aff0399`
- **Salt Index:** `1`
- **API Base:** `https://api-preprod.phonepe.com/apis/pg-sandbox`

### Switch to Production

In `.env`, update:
```env
PHONEPE_MERCHANT_ID="your-live-merchant-id"
PHONEPE_SALT_KEY="your-live-salt-key"
PHONEPE_SALT_INDEX="1"
PHONEPE_ENV="production"
```

The checksum calculation and API routing are handled automatically in [`src/lib/phonepe.ts`](./src/lib/phonepe.ts).

---

## 🔐 Authentication Setup

### Google OAuth
1. Create a project at [console.cloud.google.com](https://console.cloud.google.com)
2. Enable Google+ API and create OAuth 2.0 credentials
3. Add `http://localhost:3000/api/auth/callback/google` as an authorized redirect URI
4. Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env`

### Apple Sign-In
1. Create an App ID and Service ID at [developer.apple.com](https://developer.apple.com)
2. Enable Sign In with Apple and configure your web domain
3. Set `APPLE_CLIENT_ID` and `APPLE_CLIENT_SECRET` in `.env`

### SMS OTP (Production)
Replace mock OTP with a real provider:
- **MSG91:** Set `SMS_OTP_PROVIDER=msg91`, `MSG91_AUTH_KEY`, `MSG91_TEMPLATE_ID`
- **Twilio:** Set `SMS_OTP_PROVIDER=twilio`, `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_VERIFY_SERVICE_SID`

---

## 🗄️ Switch to PostgreSQL

Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Update `.env`:
```env
DATABASE_URL="postgresql://user:password@host:5432/alemah_db"
```

Run:
```bash
npx prisma migrate dev --name init
npx prisma db seed
```

---

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API Routes (auth, payments)
│   ├── account/           # User account & orders
│   ├── checkout/          # Single-page checkout
│   ├── order-success/     # Post-payment confirmation
│   ├── orders/[id]/       # Order tracking timeline
│   ├── product/[id]/      # Product Detail Page (PDP)
│   ├── shop/              # Shop landing + categories
│   ├── story/             # Our Story brand page
│   └── offline/           # PWA offline fallback
├── components/
│   ├── auth/              # AuthModal (multi-provider)
│   ├── cart/              # CartDrawer
│   ├── layout/            # Header, MobileTabBar, Toast
│   ├── product/           # ProductCard, ProductDetail, Filters
│   ├── providers/         # AppProviders, ScrollProvider
│   └── pwa/               # PWAInstallPrompt
├── hooks/                 # useCart (with hydration guard)
├── lib/                   # db.ts, auth.ts, phonepe.ts
└── store/                 # useCartStore, useUIStore
prisma/
├── schema.prisma          # Database schema
└── seed.ts                # 15-product sample catalog
public/
├── manifest.json          # PWA manifest
└── sw.js                  # Service Worker
```

---

## 🚢 Deployment (Vercel)

```bash
npm run build
vercel deploy --prod
```

Set all environment variables in the Vercel dashboard. For the database, use [Neon](https://neon.tech) or [Supabase](https://supabase.com) for PostgreSQL hosting.
