/*
  Warnings:

  - You are about to drop the column `companyEn` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `companyJp` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `companyUa` on the `Job` table. All the data in the column will be lost.
  - Added the required column `companyNameJp` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Job" DROP COLUMN "companyEn",
DROP COLUMN "companyJp",
DROP COLUMN "companyUa",
ADD COLUMN     "companyNameEn" TEXT,
ADD COLUMN     "companyNameJp" TEXT NOT NULL,
ADD COLUMN     "companyNameUa" TEXT;
