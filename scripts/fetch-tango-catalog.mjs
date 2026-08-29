// Fetches your Tango Card catalog and prints it next to our own brand
// slugs, so you can populate BRAND_TO_TANGO_UTID in
// src/lib/giftcard-provider.ts by hand.
//
// Run with: node scripts/fetch-tango-catalog.mjs
// Requires TANGO_PLATFORM_NAME / TANGO_PLATFORM_KEY / TANGO_API_BASE_URL
// in .env.local (defaults to the sandbox base URL).

import { readFileSync } from "fs";

function loadEnvLocal() {
  try {
    const raw = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^"|"$/g, "");
    }
  } catch {}
}
loadEnvLocal();

const baseUrl = process.env.TANGO_API_BASE_URL || "https://sandbox.tangocard.com/raas/v2";
const platformName = process.env.TANGO_PLATFORM_NAME;
const platformKey = process.env.TANGO_PLATFORM_KEY;

if (!platformName || !platformKey) {
  console.error("Set TANGO_PLATFORM_NAME and TANGO_PLATFORM_KEY in .env.local first.");
  process.exit(1);
}

const auth = Buffer.from(`${platformName}:${platformKey}`).toString("base64");

const res = await fetch(`${baseUrl}/catalogs`, {
  headers: { Authorization: `Basic ${auth}` },
});

if (!res.ok) {
  console.error(`Catalog fetch failed (${res.status}):`, await res.text());
  process.exit(1);
}

const data = await res.json();
// Response shape per Tango's docs: { catalog: [ { brand: { brandKey, brandName }, utid, ... } ] }
// If this doesn't match what comes back, print the raw response so you can
// adjust — Tango's exact catalog shape isn't something I could verify
// without live credentials.
if (!Array.isArray(data?.catalog)) {
  console.log("Unexpected response shape, printing raw JSON:\n");
  console.log(JSON.stringify(data, null, 2));
  process.exit(0);
}

console.log(`Found ${data.catalog.length} catalog entries.\n`);
console.log("Match these brandName values against src/lib/brands.ts and add the utid:\n");
for (const entry of data.catalog) {
  console.log(`${entry.utid}\t${entry.brand?.brandName ?? "?"}`);
}
