import { generateDemoCode, generateDemoPin } from "./order";

/**
 * Fulfillment is intentionally behind an interface. DemoGiftCardProvider
 * below issues random, NON-REDEEMABLE placeholder codes — it exists so the
 * checkout/order/email flow can be built and tested end-to-end before a real
 * supplier contract is in place.
 *
 * To go live, implement this interface against a licensed distributor
 * (e.g. Tango Card, Blackhawk Network, Fiserv Gift Solutions) and swap the
 * export at the bottom of this file. Do not point real Stripe charges at
 * DemoGiftCardProvider — customers would pay for codes that don't work.
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

export const giftCardProvider: GiftCardProvider = new DemoGiftCardProvider();
