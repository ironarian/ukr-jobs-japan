-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "titleUa" TEXT NOT NULL,
    "titleJp" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "locationUa" TEXT NOT NULL,
    "locationJp" TEXT NOT NULL,
    "locationEn" TEXT NOT NULL,
    "shortUa" TEXT NOT NULL,
    "shortJp" TEXT NOT NULL,
    "shortEn" TEXT NOT NULL,
    "descriptionUa" TEXT NOT NULL,
    "descriptionJp" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Job_slug_key" ON "Job"("slug");
