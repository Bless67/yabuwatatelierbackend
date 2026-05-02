/*
  Warnings:

  - You are about to drop the column `markupPrice` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `salePrice` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "markupPrice",
DROP COLUMN "salePrice",
ADD COLUMN     "preview" BOOLEAN NOT NULL DEFAULT false;
