"use client";

import { useState } from "react";
import { logoUrl } from "@/lib/brands";

export function BrandLogo({
  domain,
  name,
  size = 40,
  radius = 10,
  bg = "#f5f7f6",
}: {
  domain: string;
  name: string;
  size?: number;
  radius?: number;
  bg?: string;
}) {
  const [err, setErr] = useState(false);
  const src = logoUrl(domain, Math.max(size, 128));

  if (err) {
    return (
      <div
        style={{ width: size, height: size, borderRadius: radius, background: bg }}
        className="flex items-center justify-center font-extrabold text-brand-600 flex-shrink-0"
      >
        {name.charAt(0)}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={`${name} logo`}
      width={size}
      height={size}
      style={{ borderRadius: radius, background: bg, objectFit: "contain", padding: size > 50 ? 8 : 4 }}
      className="flex-shrink-0"
      onError={() => setErr(true)}
    />
  );
}
