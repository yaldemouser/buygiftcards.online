-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "billingCity" TEXT,
ADD COLUMN     "billingCountry" TEXT,
ADD COLUMN     "billingLine1" TEXT,
ADD COLUMN     "billingLine2" TEXT,
ADD COLUMN     "billingPostalCode" TEXT,
ADD COLUMN     "billingState" TEXT,
ADD COLUMN     "taxCents" INTEGER;
