// app/api/jobs/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Функція для slug
function makeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9а-яіїєґ]+/gi, "-")
    .replace(/^-+|-+$/g, "");
}

async function ensureUniqueSlug(base: string) {
  let slug = base;
  let i = 2;
  while (true) {
    const exists = await prisma.job.findUnique({ where: { slug } });
    if (!exists) return slug;
    slug = `${base}-${i}`;
    i++;
  }
}

type EmploymentTypeCode = "PART_TIME" | "FULL_TIME" | "CONTRACT" | "INTERNSHIP";
type JapaneseLevelCode = "NOT_REQUIRED" | "BASIC" | "N4" | "N3" | "N2" | "N1";
type JobTermCode = "ONE_DAY" | "SHORT" | "ONE_MONTH" | "LONG";

type JobRequestBody = {
  companyNameJp: string;
  companyNameUa?: string | null;
  companyNameEn?: string | null;

  facilityType: string;
  facilityTypeNoteJp?: string | null;
  facilityTypeNoteUa?: string | null;
  facilityTypeNoteEn?: string | null;

  employmentType: EmploymentTypeCode;
  japaneseLevel: JapaneseLevelCode;
  jobTerm: JobTermCode;

  titleJp: string;
  titleUa?: string | null;
  titleEn?: string | null;

  locationJp: string;
  locationUa?: string | null;
  locationEn?: string | null;

  salaryFrom?: number | null;
  salaryTo?: number | null;
  salaryCurrency?: string | null;

  shortJp: string;
  shortUa?: string | null;
  shortEn?: string | null;

  descriptionJp: string;
  descriptionUa?: string | null;
  descriptionEn?: string | null;

  slug?: string | null;
  published?: boolean | null;
};

// GET /api/jobs — публічний список (тільки published)
export async function GET() {
  try {
    const jobs = await prisma.job.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(jobs, { status: 200 });
  } catch (error) {
    console.error("Error fetching jobs", error);
    return NextResponse.json({ error: "Не вдалося завантажити вакансії" }, { status: 500 });
  }
}

// POST /api/jobs — створення вакансії (адмін-панель)
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as JobRequestBody;

    const {
      companyNameJp,
      companyNameUa,
      companyNameEn,

      facilityType,
      facilityTypeNoteJp,
      facilityTypeNoteUa,
      facilityTypeNoteEn,

      employmentType,
      japaneseLevel,
      jobTerm,

      titleJp,
      titleUa,
      titleEn,

      locationJp,
      locationUa,
      locationEn,

      salaryFrom,
      salaryTo,
      salaryCurrency,

      shortJp,
      shortUa,
      shortEn,

      descriptionJp,
      descriptionUa,
      descriptionEn,

      slug,
      published,
    } = body;

    if (
      !companyNameJp ||
      !facilityType ||
      !employmentType ||
      !japaneseLevel ||
      !jobTerm ||
      !titleJp ||
      !locationJp ||
      !shortJp ||
      !descriptionJp
    ) {
      return NextResponse.json(
        {
          error:
            "Потрібні обовʼязкові поля: companyNameJp, facilityType, employmentType, japaneseLevel, jobTerm, titleJp, locationJp, shortJp, descriptionJp",
        },
        { status: 400 }
      );
    }

    const slugSource = titleEn || titleJp || companyNameJp;
    const baseSlug = makeSlug((slug && slug.trim().length > 0 ? slug : slugSource) || "job");
    const finalSlug = await ensureUniqueSlug(baseSlug);

    const job = await prisma.job.create({
      data: {
        slug: finalSlug,

        companyNameJp,
        companyNameUa: companyNameUa ?? null,
        companyNameEn: companyNameEn ?? null,

        facilityType,
        facilityTypeNoteJp: facilityTypeNoteJp ?? null,
        facilityTypeNoteUa: facilityTypeNoteUa ?? null,
        facilityTypeNoteEn: facilityTypeNoteEn ?? null,

        employmentType,
        japaneseLevel,
        jobTerm, // ✅ SHORT/LONG тут

        titleJp,
        titleUa: titleUa ?? null,
        titleEn: titleEn ?? null,

        locationJp,
        locationUa: locationUa ?? null,
        locationEn: locationEn ?? null,

        salaryFrom: salaryFrom ?? null,
        salaryTo: salaryTo ?? null,
        salaryCurrency: salaryCurrency ?? "JPY",

        shortJp,
        shortUa: shortUa ?? null,
        shortEn: shortEn ?? null,

        descriptionJp,
        descriptionUa: descriptionUa ?? null,
        descriptionEn: descriptionEn ?? null,

        published: published ?? true,
      },
    });

    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    console.error("Error creating job", error);
    return NextResponse.json({ error: "Щось пішло не так при створенні вакансії" }, { status: 500 });
  }
}