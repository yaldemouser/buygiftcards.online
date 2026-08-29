import { Hero } from "@/components/Hero";
import { BrandGrid } from "@/components/BrandGrid";
import { BRANDS } from "@/lib/brands";

export default function HomePage() {
  return (
    <>
      <Hero />
      <BrandGrid items={BRANDS.slice(0, 10)} title="Popular gift cards" />
      <BrandGrid items={BRANDS.slice(10, 20)} title="More brands" />
    </>
  );
}
