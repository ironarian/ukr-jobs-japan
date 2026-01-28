/*
  Warnings:

  - Added the required column `facilityTypeJp` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "contractTermEn" TEXT,
ADD COLUMN     "contractTermJp" TEXT,
ADD COLUMN     "contractTermUa" TEXT,
ADD COLUMN     "facilityTypeEn" TEXT,
ADD COLUMN     "facilityTypeJp" TEXT NOT NULL,
ADD COLUMN     "facilityTypeUa" TEXT,
ADD COLUMN     "salaryCurrency" TEXT,
ADD COLUMN     "salaryFrom" INTEGER,
ADD COLUMN     "salaryTo" INTEGER;
