/*
  Warnings:

  - Added the required column `merchantId` to the `transactionHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "transactionHistory" ADD COLUMN     "merchantId" TEXT NOT NULL,
ALTER COLUMN "orderId" SET DATA TYPE TEXT;
