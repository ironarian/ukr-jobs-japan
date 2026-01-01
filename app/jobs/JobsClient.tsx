// app/jobs/JobsClient.tsx
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useLang } from "@/app/providers";
import type { Job } from "@/data/jobs";

const durationLabel: Record<
  NonNullable<Job["duration"]>,
  { ua: string; jp: string; en: string }
> = {
  OneDay: { ua: "1 день", jp: "1日", en: "1 day" },
  ShortTerm: { ua: "Короткий термін", jp: "短期", en: "Short-term" },
  OneMonth: { ua: "1 місяць", jp: "1ヶ月", en: "1 month" },
  FullTime: { ua: "Повна зайнятість", jp: "フルタイム", en: "Full-time" },
};

const jpLevelLabel: Record<
  NonNullable<Job["jpLevel"]>,
  { ua: string; jp: string; en: string }
> = {
  None: { ua: "Не вимагається", jp: "不要", en: "Not required" },
  Basic: { ua: "Базовий", jp: "初級", en: "Basic" },
  N4: { ua: "N4", jp: "N4", en: "N4" },
  N3: { ua: "N3", jp: "N3", en: "N3" },
  N2: { ua: "N2", jp: "N2", en: "N2" },
  N1: { ua: "N1", jp: "N1", en: "N1" },
};

const typeLabel: Record<Job["type"], { ua: string; jp: string; en: string }> = {
  "Part-time": { ua: "Підробіток", jp: "アルバイト", en: "Part-time" },
  "Full-time": { ua: "Повна зайнятість", jp: "正社員", en: "Full-time" },
  Contract: { ua: "Контракт", jp: "契約", en: "Contract" },
  Intern: { ua: "Інтернатура", jp: "インターン", en: "Internship" },
};

const jpRank: Record<NonNullable<Job["jpLevel"]>, number> = {
  None: 0,
  Basic: 1,
  N4: 2,
  N3: 3,
  N2: 4,
  N1: 5,
};

function enc(v: string) {
  return encodeURIComponent(v.replace(/\n/g, "\r\n"));
}

function getTitle(job: Job, lang: "ua" | "jp" | "en") {
  return lang === "ua"
    ? job.title
    : lang === "jp"
    ? job.titleJP ?? job.title
    : job.titleEN ?? job.title;
}

function getCompany(job: Job, lang: "ua" | "jp" | "en") {
  if (lang === "jp") return job.companyJP ?? job.company;
  if (lang === "en") return job.companyEN ?? job.company;
  return job.company;
}

function getLocation(job: Job, lang: "ua" | "jp" | "en") {
  if (lang === "ua") return job.locationUA ?? job.location;
  if (lang === "jp") return job.locationJP ?? job.location;
  return job.locationEN ?? job.location;
}

function buildMailto(job: Job, lang: "ua" | "jp" | "en") {
  const email = job.contactEmail ?? "hello@ukrjobsjapan.example";

  const subject =
    lang === "ua"
      ? "Запит щодо вакансії"
      : lang === "jp"
      ? "求人についてのお問い合わせ"
      : "Job inquiry";

  const title = getTitle(job, lang);
  const company = getCompany(job, lang);
  const location = getLocation(job, lang);

  const body =
    lang === "ua"
      ? [
          "Вітаю!",
          "",
          "Хочу надіслати запит щодо цієї вакансії:",
          `• Назва: ${title}`,
          `• Компанія: ${company}`,
          `• Локація: ${location}`,
          "",
          "Ім'я:",
          "Контакт (телефон / email):",
          "Коротко про себе:",
          "",
          "Дякую.",
        ].join("\n")
      : lang === "jp"
      ? [
          "はじめまして。",
          "",
          "下記の求人についてお問い合わせいたします。",
          `・職種: ${title}`,
          `・会社: ${company}`,
          `・勤務地: ${location}`,
          "",
          "氏名:",
          "連絡先（電話／メール）:",
          "簡単な自己紹介:",
          "",
          "よろしくお願いいたします。",
        ].join("\n")
      : [
          "Hello,",
          "",
          "I would like to inquire about this job:",
          `• Title: ${title}`,
          `• Company: ${company}`,
          `• Location: ${location}`,
          "",
          "Name:",
          "Contact (phone / email):",
          "Short introduction:",
          "",
          "Thank you.",
        ].join("\n");

  return `mailto:${email}?subject=${enc(subject)}&body=${enc(body)}`;
}

export default function JobsClient({ jobs }: { jobs: Job[] }) {
  const { lang } = useLang();
  const t = (ua: string, jp: string, en: string) =>
    lang === "ua" ? ua : lang === "jp" ? jp : en;

  const [type, setType] = useState<Job["type"] | "All">("All");
  const [jpLevel, setJpLevel] = useState<Job["jpLevel"] | "">("");
  const [duration, setDuration] = useState<Job["duration"] | "All">("All");

  const filtered = useMemo(() => {
    return jobs.filter((j) => {
      if (type !== "All" && j.type !== type) return false;

      if (jpLevel !== "") {
        const my = jpRank[jpLevel as NonNullable<Job["jpLevel"]>];
        const required =
          jpRank[(j.jpLevel ?? "None") as NonNullable<Job["jpLevel"]>];
        if (my < required) return false;
      }

      if (duration !== "All" && j.duration !== duration) return false;

      return true;
    });
  }, [jobs, type, jpLevel, duration]);

  const sorted = useMemo(
    () =>
      [...filtered].sort(
        (a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt)
      ),
    [filtered]
  );

  return (
    <div className="grid gap-8">
      {/* Filters */}
      <section className="sticky top-[72px] z-10 rounded-3xl border border-slate-900/20 bg-white/85 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
              {t("Вакансії", "求人", "Jobs")}
            </h1>
          </div>

          <button
            type="button"
            onClick={() => {
              setType("All");
              setJpLevel("");
              setDuration("All");
            }}
            className="rounded-2xl border border-slate-900/20 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
          >
            {t("Скинути", "リセット", "Reset")}
          </button>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {/* Type */}
          <div className="grid gap-1">
            <label className="text-xs font-semibold text-slate-600">
              {t("Тип роботи", "雇用形態", "Job type")}
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="rounded-2xl border border-slate-900/20 bg-white px-3 py-2 text-sm text-slate-900"
            >
              <option value="All">{t("Усі", "すべて", "All")}</option>
              <option value="Part-time">{typeLabel["Part-time"][lang]}</option>
              <option value="Full-time">{typeLabel["Full-time"][lang]}</option>
              <option value="Contract">{typeLabel["Contract"][lang]}</option>
              <option value="Intern">{typeLabel["Intern"][lang]}</option>
            </select>
          </div>

          {/* JP level */}
          <div className="grid gap-1">
            <label className="text-xs font-semibold text-slate-600">
              {t("Рівень японської", "日本語レベル", "Japanese level")}
            </label>
            <select
              value={jpLevel}
              onChange={(e) => setJpLevel(e.target.value as any)}
              className="rounded-2xl border border-slate-900/20 bg-white px-3 py-2 text-sm text-slate-900"
            >
              <option value="">{t("Обрати…", "選択…", "Select…")}</option>
              {(["None", "Basic", "N4", "N3", "N2", "N1"] as const).map(
                (lvl) => (
                  <option key={lvl} value={lvl}>
                    {jpLevelLabel[lvl][lang]}
                  </option>
                )
              )}
            </select>
          </div>

          {/* Duration */}
          <div className="grid gap-1">
            <label className="text-xs font-semibold text-slate-600">
              {t("Тривалість", "期間", "Duration")}
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value as any)}
              className="rounded-2xl border border-slate-900/20 bg-white px-3 py-2 text-sm text-slate-900"
            >
              <option value="All">{t("Усі", "すべて", "All")}</option>
              {(["OneDay", "ShortTerm", "OneMonth", "FullTime"] as const).map(
                (d) => (
                  <option key={d} value={d}>
                    {durationLabel[d][lang]}
                  </option>
                )
              )}
            </select>
          </div>
        </div>

        <div className="mt-4 text-sm text-slate-600">
          {t("Знайдено:", "件数:", "Found:")}{" "}
          <span className="font-semibold text-slate-900">
            {sorted.length}
          </span>
        </div>
      </section>

      {/* Cards */}
      <section className="grid gap-4 md:grid-cols-2">
        {sorted.map((job) => {
          const title = getTitle(job, lang);
          const company = getCompany(job, lang);
          const location = getLocation(job, lang);
          const requiredJP = jpLevelLabel[job.jpLevel][lang];
          const durText = durationLabel[job.duration][lang];
          const mailto = buildMailto(job, lang);

          return (
            <article
              key={job.id}
              className="rounded-3xl border border-slate-900/20 bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
            >
              <Link
                href={`/jobs/${job.id}`}
                className="text-base font-bold text-slate-900 hover:underline"
              >
                {title}
              </Link>

              <div className="mt-4 grid gap-1 text-sm text-slate-700">
                <p>
                  <span className="font-semibold text-slate-900">
                    {t("Компанія", "会社", "Company")}:
                  </span>{" "}
                  {company}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">
                    {t("Локація", "勤務地", "Location")}:
                  </span>{" "}
                  {location}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">
                    {t("Тип роботи", "雇用形態", "Job type")}:
                  </span>{" "}
                  {typeLabel[job.type][lang]}
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-slate-900/20 bg-white px-3 py-1 text-xs font-medium text-slate-800">
                  {t("JP", "日本語", "JP")}: {requiredJP}
                </span>
                <span className="rounded-full border border-slate-900/20 bg-white px-3 py-1 text-xs font-medium text-slate-800">
                  {t("Тривалість", "期間", "Duration")}: {durText}
                </span>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href={`/jobs/${job.id}`}
                  className="inline-flex rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  {t("Деталі", "詳細", "Details")}
                </Link>

                <a
                  href={mailto}
                  className="inline-flex rounded-2xl border border-slate-900/20 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                >
                  {t("Надіслати повідомлення", "メール送信", "Send message")}
                </a>
              </div>

              <p className="mt-4 text-xs text-slate-500">
                {t("Оновлено", "更新", "Updated")}: {job.updatedAt}
              </p>
            </article>
          );
        })}
      </section>

      {sorted.length === 0 ? (
        <section className="rounded-3xl border border-slate-900/20 bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
          <p className="text-sm text-slate-700">
            {t(
              "Немає вакансій за вибраними умовами.",
              "条件に合う求人がありません。",
              "No jobs match your filters."
            )}
          </p>
        </section>
      ) : null}
    </div>
  );
}