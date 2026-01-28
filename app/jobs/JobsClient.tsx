"use client";

import Link from "next/link";
import { useMemo, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Job } from "@prisma/client";
import { useLang } from "@/app/providers";

type Lang = "ua" | "jp" | "en";

type JobWithDates = Job & {
  createdAt: Date | string;
  updatedAt: Date | string;
};

type JobsClientProps = {
  jobs: JobWithDates[];
};

function useT(lang: Lang) {
  return (ua: string, jp: string, en: string) =>
    lang === "ua" ? ua : lang === "jp" ? jp : en;
}

type EmploymentTypeCode = "PART_TIME" | "FULL_TIME" | "CONTRACT" | "INTERNSHIP";
type JapaneseLevelCode = "NOT_REQUIRED" | "BASIC" | "N4" | "N3" | "N2" | "N1";
type JobTermCode = "ONE_DAY" | "SHORT_TERM" | "ONE_MONTH" | "LONG_TERM";

const JP_LEVEL_ORDER: JapaneseLevelCode[] = ["NOT_REQUIRED", "BASIC", "N4", "N3", "N2", "N1"];

const EMPLOYMENT_OPTIONS: {
  value: EmploymentTypeCode | "ALL";
  label: { ua: string; jp: string; en: string };
}[] = [
  { value: "ALL", label: { ua: "Усі типи", jp: "すべて", en: "All types" } },
  { value: "PART_TIME", label: { ua: "Підробіток", jp: "アルバイト", en: "Part-time" } },
  { value: "FULL_TIME", label: { ua: "Повна зайнятість", jp: "正社員", en: "Full-time" } },
  { value: "CONTRACT", label: { ua: "Контракт", jp: "契約", en: "Contract" } },
  { value: "INTERNSHIP", label: { ua: "Інтернатура", jp: "インターン", en: "Internship" } },
];

const JP_LEVEL_OPTIONS: {
  value: JapaneseLevelCode;
  label: { ua: string; jp: string; en: string };
}[] = [
  { value: "NOT_REQUIRED", label: { ua: "Не вимагається", jp: "不要", en: "Not required" } },
  { value: "BASIC", label: { ua: "Базовий", jp: "基礎", en: "Basic" } },
  { value: "N4", label: { ua: "JLPT N4", jp: "JLPT N4", en: "JLPT N4" } },
  { value: "N3", label: { ua: "JLPT N3", jp: "JLPT N3", en: "JLPT N3" } },
  { value: "N2", label: { ua: "JLPT N2", jp: "JLPT N2", en: "JLPT N2" } },
  { value: "N1", label: { ua: "JLPT N1", jp: "JLPT N1", en: "JLPT N1" } },
];

const TERM_OPTIONS: {
  value: JobTermCode | "ALL";
  label: { ua: string; jp: string; en: string };
}[] = [
  { value: "ALL", label: { ua: "Усі варіанти", jp: "すべて", en: "All terms" } },
  { value: "ONE_DAY", label: { ua: "1 день", jp: "1日", en: "1 day" } },
  { value: "SHORT_TERM", label: { ua: "Короткий", jp: "短期", en: "Short term" } },
  { value: "ONE_MONTH", label: { ua: "1 місяць", jp: "1ヶ月", en: "1 month" } },
  { value: "LONG_TERM", label: { ua: "Довгостроково", jp: "長期", en: "Long term" } },
];

function safe(v: string | null | undefined) {
  return (v ?? "").trim();
}

function formatDate(d: Date | string, lang: Lang) {
  const date = new Date(d);
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  if (lang === "jp") return `${y}/${m}/${day}`;
  return `${day}.${m}.${y}`;
}

function getTitle(job: JobWithDates, lang: Lang) {
  if (lang === "jp") return safe((job as any).titleJp) || safe((job as any).titleEn) || safe((job as any).titleUa);
  if (lang === "en") return safe((job as any).titleEn) || safe((job as any).titleUa) || safe((job as any).titleJp);
  return safe((job as any).titleUa) || safe((job as any).titleJp) || safe((job as any).titleEn);
}

function getCompany(job: JobWithDates, lang: Lang) {
  if (lang === "jp") return safe((job as any).companyNameJp);
  if (lang === "en")
    return safe((job as any).companyNameEn) || safe((job as any).companyNameJp) || safe((job as any).companyNameUa);
  return safe((job as any).companyNameUa) || safe((job as any).companyNameJp);
}

function getLocation(job: JobWithDates, lang: Lang) {
  if (lang === "jp") return safe((job as any).locationJp);
  if (lang === "en") return safe((job as any).locationEn) || safe((job as any).locationJp) || safe((job as any).locationUa);
  return safe((job as any).locationUa) || safe((job as any).locationJp);
}

function getShort(job: JobWithDates, lang: Lang) {
  if (lang === "jp") return safe((job as any).shortJp);
  if (lang === "en") return safe((job as any).shortEn) || safe((job as any).shortJp) || safe((job as any).shortUa);
  return safe((job as any).shortUa) || safe((job as any).shortJp);
}

function isEmploymentType(v: string): v is EmploymentTypeCode {
  return v === "PART_TIME" || v === "FULL_TIME" || v === "CONTRACT" || v === "INTERNSHIP";
}
function isJapaneseLevel(v: string): v is JapaneseLevelCode {
  return v === "NOT_REQUIRED" || v === "BASIC" || v === "N4" || v === "N3" || v === "N2" || v === "N1";
}
function isJobTerm(v: string): v is JobTermCode {
  return v === "ONE_DAY" || v === "SHORT_TERM" || v === "ONE_MONTH" || v === "LONG_TERM";
}

/**
 * ✅ Логіка доступності:
 * jobLevel = мінімальний рівень, який вимагає вакансія
 * userLevel = рівень користувача
 * Користувач підходить, якщо userLevel >= jobLevel
 *
 * Приклад:
 * - job N4 -> user N3/N2/N1 підходить
 * - job NOT_REQUIRED -> підходять всі
 */
function isEligible(userLevel: JapaneseLevelCode, jobLevelRaw: unknown) {
  const jobLevel: JapaneseLevelCode = isJapaneseLevel(String(jobLevelRaw)) ? (jobLevelRaw as JapaneseLevelCode) : "NOT_REQUIRED";
  const userIndex = JP_LEVEL_ORDER.indexOf(userLevel);
  const jobIndex = JP_LEVEL_ORDER.indexOf(jobLevel);
  if (userIndex === -1 || jobIndex === -1) return true;
  return userIndex >= jobIndex;
}

export default function JobsClient({ jobs }: JobsClientProps) {
  const { lang, ready } = useLang();
  const langCode = (lang as Lang) ?? "en";
  const t = useT(langCode);

  const router = useRouter();
  const searchParams = useSearchParams();

  const [employmentFilter, setEmploymentFilter] = useState<EmploymentTypeCode | "ALL">("ALL");
  const [japaneseLevelFilter, setJapaneseLevelFilter] = useState<JapaneseLevelCode | null>(null);
  const [termFilter, setTermFilter] = useState<JobTermCode | "ALL">("ALL");
  const [didInitFromUrl, setDidInitFromUrl] = useState(false);

  // ✅ init from URL (1 раз)
  useEffect(() => {
    const emp = searchParams.get("emp");
    const lvl = searchParams.get("lvl");
    const term = searchParams.get("term");

    if (emp === "ALL") setEmploymentFilter("ALL");
    else if (emp && isEmploymentType(emp)) setEmploymentFilter(emp);

    if (term === "ALL") setTermFilter("ALL");
    else if (term && isJobTerm(term)) setTermFilter(term);

    if (lvl && isJapaneseLevel(lvl)) setJapaneseLevelFilter(lvl);
    else setJapaneseLevelFilter(null);

    setDidInitFromUrl(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ state -> URL
  useEffect(() => {
    if (!didInitFromUrl) return;

    const params = new URLSearchParams();
    if (employmentFilter !== "ALL") params.set("emp", employmentFilter);
    if (termFilter !== "ALL") params.set("term", termFilter);
    if (japaneseLevelFilter) params.set("lvl", japaneseLevelFilter);

    const q = params.toString();
    router.replace(q ? `/jobs?${q}` : "/jobs", { scroll: false });
  }, [didInitFromUrl, employmentFilter, termFilter, japaneseLevelFilter, router]);

  // ✅ back url (щоб не губити фільтри)
  const currentQuery = searchParams.toString();
  const backHref = currentQuery ? `/jobs?${currentQuery}` : "/jobs";

  const hasChosenLevel = japaneseLevelFilter !== null;

  const filteredJobs = useMemo(() => {
    if (!hasChosenLevel) return [] as JobWithDates[];

    const userLevel = japaneseLevelFilter!;

    return jobs
      .filter((job) => Boolean((job as any).published))
      .filter((job) => (employmentFilter === "ALL" ? true : (job as any).employmentType === employmentFilter))
      .filter((job) => (termFilter === "ALL" ? true : (job as any).jobTerm === termFilter))
      .filter((job) => isEligible(userLevel, (job as any).japaneseLevel));
  }, [jobs, employmentFilter, japaneseLevelFilter, termFilter, hasChosenLevel]);

  const total = hasChosenLevel ? filteredJobs.length : 0;

  const resetFilters = () => {
    setEmploymentFilter("ALL");
    setJapaneseLevelFilter(null);
    setTermFilter("ALL");
    router.replace("/jobs", { scroll: false });
  };

  // styles
  const fieldWrap =
    "relative rounded-xl border border-slate-200 bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_1px_0_rgba(15,23,42,0.02)]";
  const fieldSelect =
    "w-full appearance-none bg-transparent px-4 py-[12px] text-[14px] font-normal leading-none text-slate-900 outline-none";
  const fieldFocus =
    "focus-within:border-slate-300 focus-within:shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_0_0_4px_rgba(148,163,184,0.18)]";
  const arrow =
    "pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[12px] text-slate-400";
  const jpFocus =
    "focus-within:border-amber-200 focus-within:shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_0_0_4px_rgba(252,211,77,0.22)]";

  if (!ready) return null;

  return (
    <main className="mx-auto mb-24 mt-10 max-w-6xl px-4 lg:px-0">
      <section className="mx-auto max-w-5xl rounded-[30px] border border-slate-200 bg-white px-6 py-7 shadow-[0_14px_50px_rgba(15,23,42,0.10)] sm:px-8 sm:py-8 space-y-6">
        <header className="space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            {t("Вакансії", "求人一覧", "Job listings")}
          </p>
          <h1 className="text-[22px] font-semibold tracking-tight text-slate-900 sm:text-[26px]">
            {t(
              "Актуальні пропозиції роботи в Японії для українців.",
              "ウクライナの方のための日本での求人情報です。",
              "Current job offers in Japan for Ukrainians."
            )}
          </h1>
        </header>

        {/* FILTER BOX */}
        <section className="rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-[0_10px_35px_rgba(15,23,42,0.08)] sm:px-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                {t("Умови пошуку", "検索フィルター", "Search filters")}
              </p>
              <p className="text-[12px] font-normal text-slate-400">
                {t(
                  "Оберіть свій рівень японської, і ми підберемо вакансії.",
                  "日本語レベルを選ぶと、あなたに合う求人だけ表示されます。",
                  "Choose your Japanese level to see matching jobs."
                )}
              </p>
            </div>

            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-[12px] font-medium text-slate-700 shadow-[0_2px_10px_rgba(15,23,42,0.06)] transition hover:bg-slate-50"
            >
              {t("Скинути фільтри", "リセット", "Reset filters")}
            </button>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="space-y-1">
              <label className="text-[11px] font-medium tracking-[0.02em] text-slate-600">
                {t("Тип роботи", "雇用形態", "Employment type")}
              </label>
              <div className={`${fieldWrap} ${fieldFocus}`}>
                <select
                  className={fieldSelect}
                  value={employmentFilter}
                  onChange={(e) => setEmploymentFilter(e.target.value as EmploymentTypeCode | "ALL")}
                >
                  {EMPLOYMENT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label[langCode]}
                    </option>
                  ))}
                </select>
                <span className={arrow}>▾</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-medium tracking-[0.02em] text-slate-600">
                {t("Ваш рівень японської", "日本語レベル", "Your Japanese level")}
              </label>
              <div className={`${fieldWrap} ${fieldFocus} ${jpFocus}`}>
                <select
                  className={fieldSelect}
                  value={japaneseLevelFilter ?? ""}
                  onChange={(e) => setJapaneseLevelFilter(e.target.value ? (e.target.value as JapaneseLevelCode) : null)}
                >
                  <option value="">
                    {t("Оберіть свій рівень…", "レベルを選択してください…", "Choose your level…")}
                  </option>
                  {JP_LEVEL_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label[langCode]}
                    </option>
                  ))}
                </select>
                <span className={arrow}>▾</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-medium tracking-[0.02em] text-slate-600">
                {t("Тривалість", "期間", "Term")}
              </label>
              <div className={`${fieldWrap} ${fieldFocus}`}>
                <select
                  className={fieldSelect}
                  value={termFilter}
                  onChange={(e) => setTermFilter(e.target.value as JobTermCode | "ALL")}
                >
                  {TERM_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label[langCode]}
                    </option>
                  ))}
                </select>
                <span className={arrow}>▾</span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-col justify-between gap-1 text-[12px] text-slate-500 sm:flex-row sm:items-center">
            <span>
              {t("Знайдено", "件数", "Found")}:{" "}
              <span className="font-semibold text-slate-800">{total}</span>
            </span>
          </div>
        </section>

        {/* якщо рівень не вибраний */}
        {!hasChosenLevel && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-[13px] text-amber-900">
            {t(
              "Оберіть свій рівень японської — і ми покажемо вакансії, на які ви можете податись.",
              "日本語レベルを選択すると、応募できる求人が表示されます。",
              "Choose your Japanese level to see jobs you can apply to."
            )}
          </div>
        )}

        {/* JOBS */}
        {hasChosenLevel && (
          <section className="grid gap-5 md:grid-cols-2">
            {filteredJobs.map((job) => {
              const detailsHref = `/jobs/${encodeURIComponent((job as any).slug)}?back=${encodeURIComponent(backHref)}`;

              const title = getTitle(job, langCode);
              const company = getCompany(job, langCode);
              const location = getLocation(job, langCode);
              const shortText = getShort(job, langCode);

              const jpLevelLabel =
                JP_LEVEL_OPTIONS.find((x) => x.value === ((job as any).japaneseLevel as JapaneseLevelCode))?.label[langCode] ?? "";

              const termLabel =
                TERM_OPTIONS.find((x) => x.value === (((job as any).jobTerm as JobTermCode) ?? "ALL"))?.label[langCode] ?? "";

              return (
                <article
                  key={(job as any).id}
                  className="group flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.10)] transition hover:-translate-y-[2px] hover:shadow-[0_18px_60px_rgba(15,23,42,0.16)]"
                >
                  <div>
                    <Link href={detailsHref} className="block">
                      <h2 className="text-[15px] font-semibold leading-snug text-slate-900 underline-offset-4 group-hover:underline">
                        {title}
                      </h2>
                    </Link>

                    <dl className="mt-2 space-y-0.5 text-[13px] text-slate-700">
                      <div>
                        <dt className="inline font-medium">{t("Компанія:", "企業名:", "Company:")} </dt>
                        <dd className="inline">{company}</dd>
                      </div>
                      <div>
                        <dt className="inline font-medium">{t("Локація:", "勤務地:", "Location:")} </dt>
                        <dd className="inline">{location}</dd>
                      </div>
                    </dl>

                    <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
                      <span className="inline-flex items-center rounded-full bg-slate-900 px-2.5 py-1 font-semibold text-white">
                        JP: {jpLevelLabel}
                      </span>

                      {termLabel && (
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-800">
                          {termLabel}
                        </span>
                      )}

                      {typeof (job as any).salaryFrom === "number" && (
                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-700">
                          ¥{Number((job as any).salaryFrom).toLocaleString("ja-JP")}
                        </span>
                      )}
                    </div>

                    {shortText && (
                      <p className="mt-3 line-clamp-3 text-[13px] leading-relaxed text-slate-700">
                        {shortText}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-500">
                    <span>
                      {t("Оновлено:", "更新日:", "Updated:")}{" "}
                      <span className="font-medium text-slate-700">
                        {formatDate((job as any).updatedAt, langCode)}
                      </span>
                    </span>

                    <div className="flex gap-2">
                      <Link
                        href={detailsHref}
                        className="inline-flex items-center justify-center rounded-full bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-800"
                      >
                        {t("Деталі", "詳細", "Details")}
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </section>
    </main>
  );
}