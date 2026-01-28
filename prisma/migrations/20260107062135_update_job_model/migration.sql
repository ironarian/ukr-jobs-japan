/*
  Warnings:

  - You are about to drop the column `contractTermEn` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `contractTermJp` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `contractTermUa` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `facilityTypeEn` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `facilityTypeJp` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `facilityTypeUa` on the `Job` table. All the data in the column will be lost.
  - Added the required column `employmentType` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `facilityType` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `japaneseLevel` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jobTerm` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FacilityType" AS ENUM ('CAFE_RESTAURANT', 'IT_COMPANY', 'OFFICE', 'CARE_FACILITY', 'HOTEL', 'RETAIL', 'FACTORY', 'WAREHOUSE', 'EDUCATION', 'OTHER');

-- CreateEnum
CREATE TYPE "EmploymentType" AS ENUM ('PART_TIME', 'FULL_TIME', 'CONTRACT', 'INTERNSHIP');

-- CreateEnum
CREATE TYPE "JapaneseLevel" AS ENUM ('NOT_REQUIRED', 'BASIC', 'JLPT_N4', 'JLPT_N3', 'JLPT_N2', 'JLPT_N1');

-- CreateEnum
CREATE TYPE "JobTerm" AS ENUM ('ONE_DAY', 'SHORT_TERM', 'ONE_MONTH', 'LONG_TERM');

-- AlterTable
ALTER TABLE "Job" DROP COLUMN "contractTermEn",
DROP COLUMN "contractTermJp",
DROP COLUMN "contractTermUa",
DROP COLUMN "facilityTypeEn",
DROP COLUMN "facilityTypeJp",
DROP COLUMN "facilityTypeUa",
ADD COLUMN     "employmentType" "EmploymentType" NOT NULL,
ADD COLUMN     "facilityType" "FacilityType" NOT NULL,
ADD COLUMN     "facilityTypeNoteEn" TEXT,
ADD COLUMN     "facilityTypeNoteJp" TEXT,
ADD COLUMN     "facilityTypeNoteUa" TEXT,
ADD COLUMN     "japaneseLevel" "JapaneseLevel" NOT NULL,
ADD COLUMN     "jobTerm" "JobTerm" NOT NULL,
ALTER COLUMN "salaryCurrency" SET DEFAULT 'JPY';
