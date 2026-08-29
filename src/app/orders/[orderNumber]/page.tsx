import { OrderDetail } from "@/components/OrderDetail";

export default async function OrderDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderNumber: string }>;
  searchParams: Promise<{ email?: string }>;
}) {
  const { orderNumber } = await params;
  const { email } = await searchParams;
  return <OrderDetail orderNumber={orderNumber} email={email || ""} />;
}
