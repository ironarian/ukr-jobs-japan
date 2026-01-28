// app/jobs/[slug]/opengraph-image.tsx
import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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

function detectLangFromCookie(cookieHeader: string | null): "ua" | "jp" | "en" {
  const raw = cookieHeader ?? "";
  const m = raw.match(/(?:^|;\s*)lang=(ua|jp|en)(?:;|$)/);
  const v = m?.[1];
  return v === "ua" || v === "jp" || v === "en" ? v : "en";
}

export default async function OpenGraphImage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = decodeURIComponent(params.slug);

  const job = await prisma.job.findUnique({
    where: { slug },
    select: {
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
      salaryFrom: true,
      salaryTo: true,
      salaryCurrency: true,
    },
  });

  // якщо нема — робимо нейтральну картинку
  const cookieHeader =
    typeof (globalThis as any).headers?.get === "function"
      ? (globalThis as any).headers.get("cookie")
      : null;

  const lang = detectLangFromCookie(cookieHeader);

  const title = job ? pickLang(lang, job.titleUa, job.titleJp, job.titleEn) : "Job";
  const company = job
    ? pickLang(lang, job.companyNameUa, job.companyNameJp, job.companyNameEn)
    : "Company";
  const location = job
    ? pickLang(lang, job.locationUa, job.locationJp, job.locationEn)
    : "";

  const pay =
    job && typeof job.salaryFrom === "number"
      ? `${job.salaryCurrency ?? "JPY"} ${job.salaryFrom.toLocaleString("ja-JP")}${
          typeof job.salaryTo === "number"
            ? `–${job.salaryTo.toLocaleString("ja-JP")}`
            : "〜"
        }`
      : "";

  const badge =
    lang === "ua" ? "Вакансія" : lang === "jp" ? "求人" : "Job posting";

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          background: "#0f172a",
          padding: 56,
          justifyContent: "center",
          alignItems: "center",
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans", "Helvetica Neue", Arial',
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 40,
            background: "linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)",
            padding: 56,
            display: "flex",
            flexDirection: "column",
            gap: 22,
            boxShadow: "0 30px 90px rgba(0,0,0,0.35)",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 12,
              alignItems: "center",
            }}
          >
            <div
              style={{
                padding: "10px 16px",
                borderRadius: 999,
                background: "#0f172a",
                color: "white",
                fontSize: 20,
                fontWeight: 700,
              }}
            >
              {badge}
            </div>

            {pay ? (
              <div
                style={{
                  padding: "10px 16px",
                  borderRadius: 999,
                  background: "#dcfce7",
                  color: "#166534",
                  fontSize: 20,
                  fontWeight: 700,
                }}
              >
                {pay}
              </div>
            ) : null}
          </div>

          <div
            style={{
              fontSize: 56,
              fontWeight: 800,
              letterSpacing: -1,
              color: "#0f172a",
              lineHeight: 1.05,
              maxHeight: 180,
              overflow: "hidden",
            }}
          >
            {title}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              marginTop: 6,
            }}
          >
            <div style={{ fontSize: 28, color: "#334155", fontWeight: 700 }}>
              {company}
            </div>
            <div style={{ fontSize: 22, color: "#475569" }}>
              {location}
            </div>
          </div>

          <div style={{ flex: 1 }} />

          <div style={{ fontSize: 18, color: "#64748b" }}>
            /jobs/{slug}
          </div>
        </div>
      </div>
    ),
    size
  );
}