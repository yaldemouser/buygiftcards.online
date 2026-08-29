import { generateDemoCode, generateDemoPin } from "./order";

/**
 * Fulfillment is intentionally behind an interface. DemoGiftCardProvider
 * below issues random, NON-REDEEMABLE placeholder codes — it exists so the
 * checkout/order/email flow can be built and tested end-to-end before a real
 * supplier contract is in place.
 *
 * TangoCardProvider (below) implements this against Tango Card's RaaS API.
 * It activates automatically once TANGO_PLATFORM_NAME / TANGO_PLATFORM_KEY /
 * TANGO_ACCOUNT_IDENTIFIER / TANGO_CUSTOMER_IDENTIFIER are all set — see
 * .env.example. Until then, DemoGiftCardProvider stays active. Do not point
 * real Stripe charges at DemoGiftCardProvider — customers would pay for
 * codes that don't work.
 */
export type IssuedCard = { code: string; pin: string; isDemo: boolean };

export interface GiftCardProvider {
  issue(params: { brandSlug: string; amountCents: number }): Promise<IssuedCard>;
}

export class DemoGiftCardProvider implements GiftCardProvider {
  async issue(): Promise<IssuedCard> {
    return { code: generateDemoCode(), pin: generateDemoPin(), isDemo: true };
  }
}

/**
 * Tango Card RaaS (Rewards-as-a-Service) API.
 *
 * IMPORTANT: I don't have live Tango Card credentials to test this against,
 * so treat this as a solid starting implementation built from Tango's
 * publicly documented API shape — not as verified-working code. Before
 * taking real payments through it:
 *   1. Confirm the request/response field names against your own sandbox
 *      (Tango's docs: https://developers.tangocard.com/reference) — API
 *      shapes do shift over time and I can't check that from here.
 *   2. Populate BRAND_TO_TANGO_UTID below using `npm run tango:catalog`
 *      (scripts/fetch-tango-catalog.mjs) once you have sandbox credentials.
 *   3. Run a full test purchase against the SANDBOX base URL before ever
 *      pointing this at production Tango credentials + live Stripe keys.
 */

// Maps our internal brand slugs (src/lib/brands.ts) to Tango Card's "utid"
// (unique Tango ID) — one utid per brand+denomination-model in their
// catalog. These are specific to your Tango account and NOT guessable;
// populate this after running the catalog-fetch script. Brands with no
// entry here will throw when TangoCardProvider tries to issue them.
export const BRAND_TO_TANGO_UTID: Record<string, string> = {
  // "starbucks": "U123456",
  // "amazon": "U654321",
};

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set — required for TangoCardProvider`);
  return value;
}

export class TangoCardProvider implements GiftCardProvider {
  private baseUrl: string;
  private platformName: string;
  private platformKey: string;
  private accountIdentifier: string;
  private customerIdentifier: string;

  constructor() {
    // Sandbox vs production is just a different base URL in Tango's API —
    // defaults to sandbox so you can't accidentally hit production by
    // forgetting to set this.
    this.baseUrl = process.env.TANGO_API_BASE_URL || "https://sandbox.tangocard.com/raas/v2";
    this.platformName = requireEnv("TANGO_PLATFORM_NAME");
    this.platformKey = requireEnv("TANGO_PLATFORM_KEY");
    this.accountIdentifier = requireEnv("TANGO_ACCOUNT_IDENTIFIER");
    this.customerIdentifier = requireEnv("TANGO_CUSTOMER_IDENTIFIER");
  }

  async issue({ brandSlug, amountCents }: { brandSlug: string; amountCents: number }): Promise<IssuedCard> {
    const utid = BRAND_TO_TANGO_UTID[brandSlug];
    if (!utid) {
      throw new Error(
        `No Tango Card utid mapped for brand "${brandSlug}". Run the catalog-fetch script and add it to BRAND_TO_TANGO_UTID.`
      );
    }

    const auth = Buffer.from(`${this.platformName}:${this.platformKey}`).toString("base64");
    const res = await fetch(`${this.baseUrl}/orders`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accountIdentifier: this.accountIdentifier,
        customerIdentifier: this.customerIdentifier,
        amount: amountCents / 100,
        utid,
        sendEmail: false, // we deliver the code ourselves via our own email
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`Tango Card order failed (${res.status}): ${body}`);
    }

    const data = await res.json();
    // Per Tango's docs the response is { success, reward: { credentials: {...} } }.
    // Card-type rewards typically return { number, pin? }, some return a
    // { claim_url } instead of a raw number — verify against your sandbox
    // response for the specific brands you sell before trusting this blindly.
    const credentials = data?.reward?.credentials ?? {};
    const code = credentials.number ?? credentials.claim_url;
    if (!code) {
      throw new Error(`Tango Card order succeeded but no redeemable code was found in the response: ${JSON.stringify(data)}`);
    }

    return { code, pin: credentials.pin ?? "", isDemo: false };
  }
}

function buildProvider(): GiftCardProvider {
  const hasTangoConfig =
    process.env.TANGO_PLATFORM_NAME &&
    process.env.TANGO_PLATFORM_KEY &&
    process.env.TANGO_ACCOUNT_IDENTIFIER &&
    process.env.TANGO_CUSTOMER_IDENTIFIER;

  if (hasTangoConfig) {
    console.log("[giftcard-provider] Using TangoCardProvider (real fulfillment)");
    return new TangoCardProvider();
  }
  console.warn("[giftcard-provider] Tango Card env vars not set — using DemoGiftCardProvider (non-redeemable codes)");
  return new DemoGiftCardProvider();
}

export const giftCardProvider: GiftCardProvider = buildProvider();
