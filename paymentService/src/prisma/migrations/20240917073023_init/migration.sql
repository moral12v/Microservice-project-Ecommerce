-- AlterTable
ALTER TABLE "transactionHistory" ADD COLUMN     "aggregatorStatus" TEXT NOT NULL DEFAULT 'unpaid';
