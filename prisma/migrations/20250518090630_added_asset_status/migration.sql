/*
  Warnings:

  - You are about to drop the column `assetName` on the `Asset` table. All the data in the column will be lost.
  - Added the required column `assetModel` to the `Asset` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AssetStatus" AS ENUM ('inOperation', 'inRepaire', 'inStock', 'writeOff');

-- AlterTable
ALTER TABLE "Asset" DROP COLUMN "assetName",
ADD COLUMN     "assetModel" TEXT NOT NULL,
ADD COLUMN     "assetStatus" "AssetStatus" NOT NULL DEFAULT 'inStock';
