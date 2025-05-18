/*
  Warnings:

  - Added the required column `assetType` to the `Asset` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AssetType" AS ENUM ('computer', 'smartphone', 'dockstation', 'laptop');

-- AlterTable
ALTER TABLE "Asset" ADD COLUMN     "assetType" "AssetType" NOT NULL;
