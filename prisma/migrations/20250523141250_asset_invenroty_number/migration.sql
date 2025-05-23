/*
  Warnings:

  - A unique constraint covering the columns `[assetInvenrotyNumber]` on the table `Asset` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `assetInvenrotyNumber` to the `Asset` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Asset" ADD COLUMN     "assetInvenrotyNumber" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Asset_assetInvenrotyNumber_key" ON "Asset"("assetInvenrotyNumber");
