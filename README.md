# Alemah - Premium Home Textiles PWA

A production-ready direct-to-consumer e-commerce Progressive Web App for Alemah, a premium Indian home textile brand covering bedsheets, cushion covers, quilts, curtains, and table linen.

---

## Features

- Next.js 16 App Router with TypeScript
- React 19
- Tailwind CSS v4 with Alemah brand design tokens
- Zustand cart and UI state with localStorage persistence
- NextAuth.js credentials auth, sandbox phone OTP, optional Google and Apple sign-in
- PhonePe payment gateway sandbox integration with SHA256 checksum validation
- Cash on Delivery path with regional eligibility
- Prisma ORM with SQLite for local demo development
- PWA service worker, offline page, and install prompt
- Responsive storefront, product detail pages, checkout, account, and order tracking

---

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

The local `.env` can use SQLite and PhonePe sandbox credentials for demo development.

### 3. Set up the database

```bash
npm run db:push
npm run db:seed
```

### 4. Start development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Verification

```bash
npm run lint
npm run typecheck
npm run build
```

---

## Test Credentials

| Method | Credentials |
| --- | --- |
| Email login | `user@alemah.com` / `admin123` |
| Admin login | `admin@alemah.com` / `admin123` |
| Phone OTP | Any phone number + OTP `123456` |

These are demo credentials from `prisma/seed.ts`. Replace them before taking real customer orders.

---

## PhonePe Payment Gateway

### Sandbox mode

Use the sandbox values from `.env.example`:

```env
PHONEPE_MERCHANT_ID="PGTESTPAYUAT"
PHONEPE_SALT_KEY="099eb0cd-02cf-4e2a-8aca-3e6c6aff0399"
PHONEPE_SALT_INDEX="1"
PHONEPE_ENV="sandbox"
```

### Production mode

In Vercel, set:

```env
PHONEPE_MERCHANT_ID="your-live-merchant-id"
PHONEPE_SALT_KEY="your-live-salt-key"
PHONEPE_SALT_INDEX="1"
PHONEPE_ENV="production"
NEXT_PUBLIC_BASE_URL="https://your-domain.vercel.app"
```

The checksum calculation and webhook signature validation are handled in `src/lib/phonepe.ts`.

---

## Authentication

Required for production:

```env
NEXTAUTH_SECRET="generated-secret-at-least-32-chars"
NEXTAUTH_URL="https://your-domain.vercel.app"
```

Generate a secret:

```bash
openssl rand -base64 32
```

Google and Apple providers are only enabled when their real credentials are present:

```env
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
APPLE_CLIENT_ID=""
APPLE_CLIENT_SECRET=""
```

Phone OTP is mocked with `123456` in this V1 demo. Connect MSG91, Twilio, or another OTP provider before production commerce.

---

## Vercel Deployment Notes

1. Create a hosted database for the Vercel deployment. SQLite is fine for local demo work, but not suitable for persistent Vercel serverless production data.
2. If using PostgreSQL, update `prisma/schema.prisma` datasource provider to `postgresql` and set `DATABASE_URL` in Vercel.
3. Run database setup against the hosted database:

```bash
npm run db:push
npm run db:seed
```

4. Set all required Vercel environment variables:

```env
DATABASE_URL=""
NEXTAUTH_SECRET=""
NEXTAUTH_URL=""
NEXT_PUBLIC_BASE_URL=""
PHONEPE_MERCHANT_ID=""
PHONEPE_SALT_KEY=""
PHONEPE_SALT_INDEX="1"
PHONEPE_ENV="sandbox"
```

5. Deploy. `postinstall` and `npm run build` both generate the Prisma client.

---

## Project Structure

```text
src/
  app/                 App Router routes and API handlers
  components/          UI components
  hooks/               Shared React hooks
  lib/                 Auth, database, and payment helpers
  store/               Zustand stores
  types/               Shared TypeScript types
prisma/
  schema.prisma        Data model
  seed.ts              Demo catalog and users
public/
  sw.js                Service worker
```
