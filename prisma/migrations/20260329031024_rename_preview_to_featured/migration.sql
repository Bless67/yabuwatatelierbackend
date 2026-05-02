/*
  Warnings:

  - You are about to drop the column `preview` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "preview",
ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false;
