import { Suspense } from "react";
import { CheckoutSuccess } from "@/components/CheckoutSuccess";

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="max-w-lg mx-auto px-6 py-20 text-center text-ink-400">Loading…</div>}>
      <CheckoutSuccess />
    </Suspense>
  );
}
