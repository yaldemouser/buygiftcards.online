# buygiftcards.online

A gift card marketplace: Next.js 15 (App Router) storefront, Postgres via Prisma, Stripe Checkout, and transactional email via Resend. The full order pipeline works end to end — browse → cart → Stripe payment → webhook → order + codes in the database → confirmation email → order lookup.

**Fulfillment currently runs in demo mode.** `src/lib/giftcard-provider.ts` issues randomly generated, clearly-labeled non-redeemable codes. See [`/about`](src/app/about/page.tsx) and the section below before taking real payments.

## Before this can go live

1. **Get a real gift-card supplier.** Selling actual, redeemable Visa/Amazon/Starbucks/etc. cards requires a contract with a licensed distributor. `src/lib/giftcard-provider.ts` already has a `TangoCardProvider` implementation built against [Tango Card](https://www.tangocard.com/)'s RaaS API — it activates automatically once `TANGO_PLATFORM_NAME`, `TANGO_PLATFORM_KEY`, `TANGO_ACCOUNT_IDENTIFIER`, and `TANGO_CUSTOMER_IDENTIFIER` are all set (see `.env.example`). It was written from Tango's public API docs, not tested against a live account (no credentials to test with) — before trusting it with real money: apply at Tango, get sandbox keys, run `npm run tango:catalog` to fetch your real catalog `utid`s and fill in `BRAND_TO_TANGO_UTID`, and place a real sandbox test order first. Until all of that's done, **do not put live Stripe keys on this deployment** — customers would be charged real money for codes that don't work.
2. **Provision Postgres.** Free options: [Neon](https://neon.tech), [Supabase](https://supabase.com), or [Railway](https://railway.app). Put the connection string in `DATABASE_URL`.
3. **Set up Stripe.** Create an account at [stripe.com](https://dashboard.stripe.com), grab test keys first (`sk_test_...` / `pk_test_...`), and register a webhook endpoint pointing at `/api/webhooks/stripe` for the `checkout.session.completed` event to get `STRIPE_WEBHOOK_SECRET`. Only switch to live keys once a real fulfillment provider is wired up.
4. **Set up Resend (or swap for your own email provider).** Verify a sending domain at [resend.com](https://resend.com) and set `RESEND_API_KEY` + `EMAIL_FROM`.
5. **Register the domain and deploy** (Vercel is the path of least resistance for Next.js). Set `NEXT_PUBLIC_SITE_URL` to the real domain.

None of the above can be done on your behalf — they all require your own accounts, business verification, and (for the gift-card supplier) a signed agreement.

## Local development

```bash
npm install
cp .env.example .env.local   # fill in real values
npm run db:migrate           # creates tables from prisma/schema.prisma
npm run dev
```

In a second terminal, forward Stripe webhooks to your local server:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the `whsec_...` it prints into `STRIPE_WEBHOOK_SECRET`.

## Deploying to Vercel

`vercel.json` is checked in with sensible defaults (explicit Next.js framework detection, and baseline security headers — `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, a locked-down `Permissions-Policy`, and `no-store` caching on the webhook route). The `build` script runs `prisma generate` before `next build` so the Prisma client is always regenerated on deploy, even on a cached `node_modules` where Vercel might otherwise skip `postinstall`.

1. [vercel.com/new](https://vercel.com/new) → import this repo. Framework and build command are auto-detected from `vercel.json`.
2. Add the env vars from `.env.example` in Project Settings → Environment Variables. For `DATABASE_URL`, either provision Vercel Postgres (Storage tab, one click) or point at Neon/Supabase — not the local Docker URL from `.env.local`.
3. After the first deploy, run the migration once against the production database: `DATABASE_URL="<prod-url>" npm run db:deploy`.
4. Add a Stripe webhook endpoint at `https://<your-domain>/api/webhooks/stripe` for `checkout.session.completed`, and put its signing secret in `STRIPE_WEBHOOK_SECRET`.
5. Add your custom domain under Project Settings → Domains, then set the DNS records Vercel gives you at your registrar. Set `NEXT_PUBLIC_SITE_URL` to match.

## Architecture

- `src/lib/brands.ts` — server-side product catalog (name, price range, denominations). Checkout re-validates every cart line against this list, so a tampered client request can never set its own price.
- `src/app/api/checkout/route.ts` — creates a Stripe Checkout Session from a re-priced cart.
- `src/app/api/webhooks/stripe/route.ts` — on `checkout.session.completed`, creates the `Order` + `OrderItem` rows, calls `GiftCardProvider.issue()` per unit, and emails the customer. Idempotent (keyed on Stripe session id) so Stripe's webhook retries are safe.
- `src/lib/giftcard-provider.ts` — the fulfillment seam described above.
- `prisma/schema.prisma` — `Order`, `OrderItem`, `GiftCardCode`.
- Order lookup (`/orders`, `/track-order`) requires order number **and** email match — no accounts needed for an MVP, but nothing sensitive is exposed by guessing an order number alone.

## Known gaps (by design, for a v0)

- No customer accounts/auth — order lookup is email + order number.
- No admin dashboard for managing the brand catalog, refunds, or viewing all orders — use `npm run db:studio` (Prisma Studio) for now.
- Support form on `/support` doesn't submit anywhere yet — wire it to email or a helpdesk.
- `/terms` and `/privacy` are placeholders, not real legal copy.
- Brand names/logos are used descriptively (via [logo.dev](https://www.logo.dev)) to indicate which card is being sold; they remain the property of their respective owners and aren't an endorsement.

## Legacy file

`giftcard-portal-v3_1.jsx` at the repo root is the original single-file prototype this app replaced — kept for reference, not used by the Next.js app.
