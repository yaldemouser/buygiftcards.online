-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "emailSentAt" TIMESTAMP(3),
ADD COLUMN     "emailError" TEXT;
