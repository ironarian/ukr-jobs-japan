/*
  Warnings:

  - The `employmentType` column on the `Job` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `facilityType` column on the `Job` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `japaneseLevel` column on the `Job` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `jobTerm` column on the `Job` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Job" ALTER COLUMN "salaryCurrency" SET DEFAULT 'JPY',
DROP COLUMN "employmentType",
ADD COLUMN     "employmentType" TEXT,
DROP COLUMN "facilityType",
ADD COLUMN     "facilityType" TEXT,
DROP COLUMN "japaneseLevel",
ADD COLUMN     "japaneseLevel" TEXT,
DROP COLUMN "jobTerm",
ADD COLUMN     "jobTerm" TEXT;

-- DropEnum
DROP TYPE "EmploymentType";

-- DropEnum
DROP TYPE "FacilityType";

-- DropEnum
DROP TYPE "JapaneseLevel";

-- DropEnum
DROP TYPE "JobTerm";
