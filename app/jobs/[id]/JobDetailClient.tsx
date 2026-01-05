// app/jobs/[id]/JobDetailClient.tsx
"use client";

import Link from "next/link";
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
  Basic: { ua: "Базовий", jp: "基礎", en: "Basic" },
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

function getSalary(job: Job, lang: "ua" | "jp" | "en") {
  if (lang === "ua") return job.salaryUA;
  if (lang === "jp") return job.salaryJP ?? job.salaryUA;
  return job.salaryEN ?? job.salaryUA;
}

function getTags(job: Job, lang: "ua" | "jp" | "en") {
  if (lang === "ua") return job.tagsUA;
  if (lang === "jp") return job.tagsJP ?? job.tagsUA;
  return job.tagsEN ?? job.tagsUA;
}

function getDescription(job: Job, lang: "ua" | "jp" | "en") {
  if (lang === "ua") return job.descriptionUA;
  if (lang === "jp") return job.descriptionJP ?? job.descriptionUA;
  return job.descriptionEN ?? job.descriptionUA;
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

export default function JobDetailClient({ job }: { job: Job }) {
  const { lang } = useLang();
  const t = (ua: string, jp: string, en: string) =>
    lang === "ua" ? ua : lang === "jp" ? jp : en;

  const title = getTitle(job, lang);
  const company = getCompany(job, lang);
  const location = getLocation(job, lang);
  const description = getDescription(job, lang);
  const salary = getSalary(job, lang);
  const tags = getTags(job, lang);

  const durText = durationLabel[job.duration][lang];
  const jpText = jpLevelLabel[job.jpLevel][lang];
  const typeText = typeLabel[job.type][lang];

  const mailto = buildMailto(job, lang);

  return (
    <div className="grid gap-8">
      {/* Main card */}
      <section className="rounded-3xl border border-slate-900/20 bg-white p-8 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
              {title}
            </h1>
            <p className="mt-2 text-sm text-slate-700">
              <span className="font-semibold text-slate-900">
                {company}
              </span>{" "}
              · {location}
            </p>
          </div>

          {/* Кнопка: на мобілці широка, на десктопі нормальна справа */}
          <div className="flex flex-col gap-2 sm:items-end">
            <a
              href={mailto}
              className="inline-flex w-full justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(0,0,0,0.12)] hover:bg-slate-800 sm:w-auto"
            >
              {t("Надіслати повідомлення", "メール送信", "Send message")}
            </a>
            <p className="text-[11px] text-slate-500 max-w-xs sm:text-right">
              {t(
                "Лист піде до центру, який передасть інформацію роботодавцю.",
                "メールはセンターに届き、その後企業に共有されます。",
                "Your message will go to the center, which will forward it to the employer."
              )}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 text-sm text-slate-700 md:grid-cols-2">
          <p>
            <span className="font-semibold text-slate-900">
              {t("Тип роботи", "雇用形態", "Job type")}:
            </span>{" "}
            {typeText}
          </p>
          <p>
            <span className="font-semibold text-slate-900">
              {t("Тривалість", "期間", "Duration")}:
            </span>{" "}
            {durText}
          </p>
          <p>
            <span className="font-semibold text-slate-900">
              {t("Рівень японської", "日本語レベル", "Japanese level")}:
            </span>{" "}
            {jpText}
          </p>
          {salary ? (
            <p>
              <span className="font-semibold text-slate-900">
                {t("Оплата", "給与", "Salary")}:
              </span>{" "}
              {salary}
            </p>
          ) : null}
        </div>

        {tags && tags.length > 0 ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-slate-900/20 bg-white px-3 py-1 text-xs font-medium text-slate-800"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}

        {description ? (
          <div className="mt-6 border-t border-slate-200 pt-6 text-sm leading-relaxed text-slate-700">
            {description.split("\n").map((line, idx) =>
              line.trim().startsWith("**") && line.trim().endsWith("**") ? (
                <p key={idx} className="mt-3 font-semibold text-slate-900">
                  {line.replace(/\*\*/g, "").trim()}
                </p>
              ) : (
                <p key={idx} className="mt-1">
                  {line}
                </p>
              )
            )}
          </div>
        ) : null}
      </section>

      {/* Back link */}
      <section>
        <Link
          href="/jobs"
          className="inline-flex text-sm font-semibold text-slate-700 hover:text-slate-900"
        >
          ← {t("Назад до вакансій", "求人一覧へ戻る", "Back to jobs")}
        </Link>
      </section>
    </div>
  );
}