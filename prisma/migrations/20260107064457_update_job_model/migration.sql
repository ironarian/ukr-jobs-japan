/*
  Warnings:

  - Made the column `employmentType` on table `Job` required. This step will fail if there are existing NULL values in that column.
  - Made the column `facilityType` on table `Job` required. This step will fail if there are existing NULL values in that column.
  - Made the column `japaneseLevel` on table `Job` required. This step will fail if there are existing NULL values in that column.
  - Made the column `jobTerm` on table `Job` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Job" ALTER COLUMN "salaryCurrency" DROP DEFAULT,
ALTER COLUMN "employmentType" SET NOT NULL,
ALTER COLUMN "facilityType" SET NOT NULL,
ALTER COLUMN "japaneseLevel" SET NOT NULL,
ALTER COLUMN "jobTerm" SET NOT NULL;
