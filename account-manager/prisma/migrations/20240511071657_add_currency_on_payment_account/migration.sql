/*
  Warnings:

  - Added the required column `currency` to the `PaymentHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PaymentHistory" ADD COLUMN     "currency" TEXT NOT NULL;
