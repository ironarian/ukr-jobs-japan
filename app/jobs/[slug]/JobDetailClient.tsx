"use client";

import Link from "next/link";
import type { Job } from "@prisma/client";
import { useLang } from "@/app/providers";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type Props = { job: Job };
type Lang = "ua" | "jp" | "en";

function safe(v: string | null | undefined) {
  return (v ?? "").trim();
}

const APPLICATION_EMAIL =
  process.env.NEXT_PUBLIC_APPLICATION_EMAIL ?? "info@example.com";

function encodeMailtoValue(value: string) {
  return encodeURIComponent(value.replace(/\n/g, "\r\n"));
}

export default function JobDetailClient({ job }: Props) {
  const { lang } = useLang();
  const langCode = (lang as Lang) ?? "en";

  const searchParams = useSearchParams();
  const back = searchParams.get("back");
  const backHref = back ? decodeURIComponent(back) : "/jobs";

  const t = (ua: string, jp: string, en: string) =>
    langCode === "ua" ? ua : langCode === "jp" ? jp : en;

  const titleJp = safe((job as any).titleJp);
  const titleUa = safe((job as any).titleUa);
  const titleEn = safe((job as any).titleEn);

  const companyJp = safe((job as any).companyNameJp);
  const companyUa = safe((job as any).companyNameUa);
  const companyEn = safe((job as any).companyNameEn);

  const location =
    langCode === "ua"
      ? safe((job as any).locationUa) || safe((job as any).locationJp)
      : langCode === "jp"
      ? safe((job as any).locationJp)
      : safe((job as any).locationEn) || safe((job as any).locationJp);

  const title =
    langCode === "ua"
      ? titleUa || titleJp
      : langCode === "jp"
      ? titleJp
      : titleEn || titleJp;

  const company =
    langCode === "ua"
      ? companyUa || companyJp
      : langCode === "jp"
      ? companyJp
      : companyEn || companyJp;

  const companyDisplay =
    langCode !== "jp" && companyJp && companyJp !== company
      ? `${company}（${companyJp}）`
      : company;

  const description =
    langCode === "ua"
      ? safe((job as any).descriptionUa) || safe((job as any).descriptionJp)
      : langCode === "jp"
      ? safe((job as any).descriptionJp)
      : safe((job as any).descriptionEn) || safe((job as any).descriptionJp);

  const updatedAt = new Date((job as any).updatedAt);

  const [jobUrl, setJobUrl] = useState("");
  useEffect(() => {
    setJobUrl(window.location.href);
  }, []);

  const mailtoHref = useMemo(() => {
    const subject = `【応募】${companyJp || company} - ${titleJp || title}`;

    const linkBlock = jobUrl ? `\n\n求人リンク\n${jobUrl}\n` : "";

    const bodyJp =
      `こんにちは。\n\n` +
      `「${companyJp || company}」の「${titleJp || title}」の求人に応募したいです。` +
      linkBlock +
      `\n連絡先\n` +
      `氏名：\n` +
      `メール：\n` +
      `電話番号：\n\n` +
      `自己紹介\n` +
      `年齢：\n` +
      `日本語レベル：\n` +
      `職務経験：\n\n` +
      `よろしくお願いいたします。\n`;

    const bodyUa =
      `Доброго дня!\n\n` +
      `Хочу подати заявку на вакансію «${title}» (${companyDisplay}).` +
      linkBlock +
      `\n連絡先\n` +
      `Імʼя:\n` +
      `Email:\n` +
      `Телефон:\n\n` +
      `自己紹介\n` +
      `Вік:\n` +
      `Рівень японської:\n` +
      `Досвід роботи:\n\n` +
      `Дякую!\n`;

    const bodyEn =
      `Hello,\n\n` +
      `I would like to apply for the position "${title}" at ${companyDisplay}.` +
      linkBlock +
      `\n連絡先\n` +
      `Name:\n` +
      `Email:\n` +
      `Phone:\n\n` +
      `自己紹介\n` +
      `Age:\n` +
      `Japanese level:\n` +
      `Work experience:\n\n` +
      `Thank you.\n`;

    const body =
      langCode === "jp" ? bodyJp : langCode === "ua" ? bodyUa : bodyEn;

    return `mailto:${APPLICATION_EMAIL}?subject=${encodeMailtoValue(
      subject
    )}&body=${encodeMailtoValue(body)}`;
  }, [langCode, title, titleJp, company, companyJp, companyDisplay, jobUrl]);

  return (
    <main className="px-4 py-8">
      <div className="mx-auto max-w-5xl flex flex-col gap-6">
        {/* 🔹 КРАСИВА КНОПКА НАЗАД */}
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition"
        >
          <span className="text-lg leading-none">←</span>
          {t("До списку вакансій", "求人一覧へ戻る", "Back to jobs")}
        </Link>

        <article className="rounded-3xl border bg-white p-6 shadow">
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="text-sm text-slate-500">
            {companyDisplay} · {location}
          </p>

          <div className="mt-6">
            <a
              href={mailtoHref}
              className="inline-flex w-full md:w-auto justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition"
            >
              {t("Подати заявку", "応募する", "Apply")}
            </a>
          </div>

          <section className="mt-6 space-y-4 text-sm text-slate-800">
            {description.split("\n").map((l, i) =>
              l.trim() ? <p key={i}>{l}</p> : <div key={i} className="h-2" />
            )}
          </section>

          <footer className="mt-8 text-xs text-slate-400">
            {t("Оновлено", "更新日", "Updated")}:{" "}
            {updatedAt.toLocaleDateString(
              langCode === "jp"
                ? "ja-JP"
                : langCode === "ua"
                ? "uk-UA"
                : "en-US"
            )}
          </footer>
        </article>
      </div>
    </main>
  );
}