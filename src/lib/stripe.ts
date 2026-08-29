import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY;
if (!key) {
  throw new Error(
    "STRIPE_SECRET_KEY is not set. Add it to .env (see .env.example) — get test keys from https://dashboard.stripe.com/test/apikeys"
  );
}

export const stripe = new Stripe(key, {
  apiVersion: "2024-06-20",
});
