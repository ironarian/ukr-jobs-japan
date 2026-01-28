// app/jobs/[slug]/page.tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import JobDetailClient from "./JobDetailClient";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PageProps = {
  params: Promise<{ slug: string }>;
};

function safe(v: string | null | undefined) {
  return (v ?? "").trim();
}

function pickLang(
  lang: "ua" | "jp" | "en",
  ua?: string | null,
  jp?: string | null,
  en?: string | null
) {
  const U = safe(ua);
  const J = safe(jp);
  const E = safe(en);

  if (lang === "ua") return U || J || E;
  if (lang === "jp") return J || U || E;
  return E || J || U;
}

async function detectLangFromCookie(): Promise<"ua" | "jp" | "en"> {
  const cookieStore = await cookies();
  const v = cookieStore.get("lang")?.value;
  return v === "ua" || v === "jp" || v === "en" ? v : "en";
}

function mapEmploymentType(code?: string | null) {
  switch (code) {
    case "FULL_TIME":
      return "FULL_TIME";
    case "PART_TIME":
      return "PART_TIME";
    case "CONTRACT":
      return "CONTRACTOR";
    case "INTERNSHIP":
      return "INTERN";
    default:
      return "OTHER";
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);

  const job = await prisma.job.findUnique({
    where: { slug },
    select: {
      published: true,
      slug: true,
      titleUa: true,
      titleJp: true,
      titleEn: true,
      companyNameUa: true,
      companyNameJp: true,
      companyNameEn: true,
      locationUa: true,
      locationJp: true,
      locationEn: true,
      shortUa: true,
      shortJp: true,
      shortEn: true,
      updatedAt: true,
    },
  });

  if (!job || !job.published) return { title: "Not found" };

  const lang = await detectLangFromCookie();

  const title = pickLang(lang, job.titleUa, job.titleJp, job.titleEn);
  const company = pickLang(lang, job.companyNameUa, job.companyNameJp, job.companyNameEn);

  const descRaw = pickLang(lang, job.shortUa, job.shortJp, job.shortEn);
  const description =
    safe(descRaw).slice(0, 160) ||
    (lang === "ua" ? "Вакансія в Японії" : lang === "jp" ? "日本の求人情報" : "Job in Japan");

  const fullTitle = `${title} — ${company}`;
  const urlPath = `/jobs/${encodeURIComponent(job.slug)}`;

  return {
    title: fullTitle,
    description,
    alternates: { canonical: urlPath },
    openGraph: {
      title: fullTitle,
      description,
      type: "article",
      url: urlPath,
      images: [{ url: `${urlPath}/opengraph-image`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [`${urlPath}/opengraph-image`],
    },
    other: {
      "article:modified_time": job.updatedAt.toISOString(),
      "og:locale": lang === "jp" ? "ja_JP" : lang === "ua" ? "uk_UA" : "en_US",
    },
  };
}

export default async function JobDetailPage({ params }: PageProps) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);

  const job = await prisma.job.findUnique({
    where: { slug },
    select: {
      id: true,
      slug: true,
      published: true,

      titleUa: true,
      titleJp: true,
      titleEn: true,

      companyNameUa: true,
      companyNameJp: true,
      companyNameEn: true,

      locationUa: true,
      locationJp: true,
      locationEn: true,

      employmentType: true,
      salaryFrom: true,
      salaryTo: true,
      salaryCurrency: true,

      shortUa: true,
      shortJp: true,
      shortEn: true,

      descriptionUa: true,
      descriptionJp: true,
      descriptionEn: true,

      createdAt: true,
      updatedAt: true,
    },
  });

  if (!job || !job.published) notFound();

  const lang = await detectLangFromCookie();

  const title = pickLang(lang, job.titleUa, job.titleJp, job.titleEn);
  const company = pickLang(lang, job.companyNameUa, job.companyNameJp, job.companyNameEn);
  const location = pickLang(lang, job.locationUa, job.locationJp, job.locationEn);

  const description =
    pickLang(lang, job.descriptionUa, job.descriptionJp, job.descriptionEn) ||
    pickLang(lang, job.shortUa, job.shortJp, job.shortEn) ||
    title;

  const jobPostingLd: any = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title,
    description: description ? description.replace(/\n/g, "<br/>") : title,
    datePosted: job.createdAt.toISOString(),
    dateModified: job.updatedAt.toISOString(),
    employmentType: mapEmploymentType(job.employmentType),
    hiringOrganization: { "@type": "Organization", name: company },
    identifier: { "@type": "PropertyValue", name: company, value: job.id },
  };

  if (location) {
    jobPostingLd.jobLocation = {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: location,
        addressCountry: "JP",
      },
    };
  }

  if (typeof job.salaryFrom === "number") {
    jobPostingLd.baseSalary = {
      "@type": "MonetaryAmount",
      currency: job.salaryCurrency ?? "JPY",
      value: {
        "@type": "QuantitativeValue",
        value: job.salaryFrom,
        unitText: "HOUR",
      },
    };
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingLd) }}
      />
      <JobDetailClient job={job as any} />
    </>
  );
}