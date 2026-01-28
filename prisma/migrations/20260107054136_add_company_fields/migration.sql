/*
  Warnings:

  - Added the required column `companyJp` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "companyEn" TEXT,
ADD COLUMN     "companyJp" TEXT NOT NULL,
ADD COLUMN     "companyUa" TEXT,
ALTER COLUMN "titleUa" DROP NOT NULL,
ALTER COLUMN "titleEn" DROP NOT NULL,
ALTER COLUMN "locationUa" DROP NOT NULL,
ALTER COLUMN "locationEn" DROP NOT NULL,
ALTER COLUMN "shortUa" DROP NOT NULL,
ALTER COLUMN "shortEn" DROP NOT NULL,
ALTER COLUMN "descriptionUa" DROP NOT NULL,
ALTER COLUMN "descriptionEn" DROP NOT NULL;
