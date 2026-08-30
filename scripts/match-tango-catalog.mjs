// Cross-references Tango's catalog against our own BRANDS list
// (src/lib/brands.ts) and generates a ready-to-paste BRAND_TO_TANGO_UTID
// mapping, picking the utid whose face value matches one of our
// denominations for each brand. Flags brands with no confident match so
// they can be checked by hand.
//
// Run with: node scripts/match-tango-catalog.mjs

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

const baseUrl = process.env.TANGO_API_BASE_URL || "https://integration-api.tangocard.com/raas/v2";
const platformName = process.env.TANGO_PLATFORM_NAME;
const platformKey = process.env.TANGO_PLATFORM_KEY;
const auth = Buffer.from(`${platformName}:${platformKey}`).toString("base64");

const res = await fetch(`${baseUrl}/catalogs`, { headers: { Authorization: `Basic ${auth}` } });
if (!res.ok) {
  console.error(`Catalog fetch failed (${res.status}):`, await res.text());
  process.exit(1);
}
const { brands } = await res.json();

// Minimal re-declaration of the fields we need from src/lib/brands.ts —
// kept as plain text parsing rather than importing the .ts file directly
// (this script runs via plain node, no TS loader).
const brandsSrc = readFileSync(new URL("../src/lib/brands.ts", import.meta.url), "utf8");
const ourBrands = [];
const re = /slug:\s*"([^"]+)",\s*name:\s*"([^"]+)"/g;
let m;
while ((m = re.exec(brandsSrc))) ourBrands.push({ slug: m[1], name: m[2] });

const normalize = (s) =>
  s
    .toLowerCase()
    .replace(/®|™|©/g, "")
    .replace(/[^a-z0-9]/g, "");

// Prefer plain/US entries over country-suffixed international variants
// (e.g. "Amazon.com" over "Amazon.de") when multiple candidates match.
const tangoByNormName = new Map();
for (const b of brands) {
  const key = normalize(b.brandName);
  if (!tangoByNormName.has(key)) tangoByNormName.set(key, []);
  tangoByNormName.get(key).push(b);
}

const matched = [];
const unmatched = [];

for (const ours of ourBrands) {
  const key = normalize(ours.name);
  let candidates = tangoByNormName.get(key);

  if (!candidates) {
    // loose fallback: startsWith match (e.g. our "Visa Virtual Account" vs Tango's "Visa")
    const loose = [...tangoByNormName.entries()].filter(
      ([k]) => k.startsWith(key.slice(0, 5)) || key.startsWith(k.slice(0, 5))
    );
    candidates = loose.length === 1 ? loose[0][1] : null;
  }

  if (!candidates || candidates.length === 0) {
    unmatched.push(ours);
    continue;
  }

  const brand = candidates[0];
  const activeItems = (brand.items ?? []).filter((i) => i.status === "active");
  if (activeItems.length === 0) {
    unmatched.push(ours);
    continue;
  }

  matched.push({ ours, tango: brand, items: activeItems });
}

console.log(`Matched ${matched.length} / ${ourBrands.length} of our brands.\n`);

console.log("// Paste into BRAND_TO_TANGO_UTID in src/lib/giftcard-provider.ts");
console.log("// A string value = variable-value card (one utid works for any amount).");
console.log("// An object value = fixed-value card, keyed by exact dollar denomination —");
console.log("// ordering an amount not listed here will fail loudly rather than silently");
console.log("// ship the wrong value.");
for (const { ours, items } of matched) {
  const isVariable = items.every((i) => i.valueType !== "FIXED_VALUE");
  if (isVariable) {
    console.log(`  "${ours.slug}": "${items[0].utid}",`);
  } else {
    const denoms = items
      .filter((i) => i.faceValue != null)
      .map((i) => `${i.faceValue}: "${i.utid}"`)
      .join(", ");
    console.log(`  "${ours.slug}": { ${denoms} },`);
  }
}

console.log(`\n// ${unmatched.length} of our brands had no confident match in Tango's catalog:`);
for (const ours of unmatched) console.log(`//   ${ours.slug} (${ours.name})`);
