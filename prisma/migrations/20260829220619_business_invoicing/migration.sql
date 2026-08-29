-- CreateEnum
CREATE TYPE "BusinessRequestStatus" AS ENUM ('DRAFTED', 'SENT', 'DECLINED');

-- CreateTable
CREATE TABLE "BusinessInvoiceRequest" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "notes" TEXT,
    "totalCents" INTEGER NOT NULL,
    "stripeCustomerId" TEXT NOT NULL,
    "stripeInvoiceId" TEXT NOT NULL,
    "status" "BusinessRequestStatus" NOT NULL DEFAULT 'DRAFTED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BusinessInvoiceRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessInvoiceItem" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "brandSlug" TEXT NOT NULL,
    "brandName" TEXT NOT NULL,
    "denomCents" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "BusinessInvoiceItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BusinessInvoiceRequest_stripeInvoiceId_key" ON "BusinessInvoiceRequest"("stripeInvoiceId");

-- AddForeignKey
ALTER TABLE "BusinessInvoiceItem" ADD CONSTRAINT "BusinessInvoiceItem_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "BusinessInvoiceRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
