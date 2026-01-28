"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLang } from "@/app/providers";

type Lang = "ua" | "jp" | "en";

function encodeMailtoValue(value: string) {
  return encodeURIComponent(value.replace(/\n/g, "\r\n"));
}

async function copyText(text: string) {
  if (navigator?.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  document.execCommand("copy");
  document.body.removeChild(ta);
}

function IconMail() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 6.5h16v11H4v-11Z" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M4.5 7l7.2 6a1 1 0 0 0 1.3 0l7.5-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconCopy() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 9h10v12H9V9Z" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconArrow() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12h12m0 0-5-5m5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ContactInner() {
  const { lang } = useLang();
  const langCode = (lang as Lang) ?? "en";
  const t = (ua: string, jp: string, en: string) =>
    langCode === "ua" ? ua : langCode === "jp" ? jp : en;

  const params = useSearchParams();
  const jobSlug = params.get("job");
  const back = params.get("back");
  const backHref = back
    ? decodeURIComponent(back)
    : jobSlug
    ? `/jobs/${encodeURIComponent(jobSlug)}`
    : "/jobs";

  const email =
    process.env.NEXT_PUBLIC_APPLICATION_EMAIL ?? "hello@ukrjobsjapan.example";

  const subject = t(
    jobSlug ? `Питання щодо вакансії (${jobSlug})` : "Питання щодо працевлаштування",
    jobSlug ? `求人についての質問（${jobSlug}）` : "お問い合わせ",
    jobSlug ? `Question about job (${jobSlug})` : "Employment inquiry"
  );

  const body = useMemo(() => {
    if (langCode === "jp") {
      return [
        "こんにちは。",
        "",
        jobSlug ? `求人について質問があります：${jobSlug}` : "就職について質問があります。",
        "",
        "質問内容：",
        "・",
        "",
        "氏名：",
        "メール：",
        "電話番号（任意）：",
        "",
        "よろしくお願いいたします。",
      ].join("\n");
    }

    if (langCode === "ua") {
      return [
        "Вітаю！",
        "（こんにちは。）",
        "",
        jobSlug ? `Маю питання щодо вакансії: ${jobSlug}` : "Маю питання щодо працевлаштування。",
        "（求人について質問があります。）",
        "",
        "Питання:",
        "（質問内容）",
        "- ",
        "",
        "Імʼя:",
        "（氏名）",
        "",
        "Email:",
        "（メール）",
        "",
        "Телефон (за бажанням):",
        "（電話番号・任意）",
        "",
        "Дякую!",
        "（よろしくお願いいたします。）",
      ].join("\n");
    }

    return [
      "Hello,",
      "（こんにちは。）",
      "",
      jobSlug
        ? `I have a question about this job: ${jobSlug}`
        : "I have a question about employment opportunities.",
      "（求人について質問があります。）",
      "",
      "Question:",
      "（質問内容）",
      "- ",
      "",
      "Name:",
      "（氏名）",
      "",
      "Email:",
      "（メール）",
      "",
      "Phone (optional):",
      "（電話番号・任意）",
      "",
      "Thank you.",
      "（よろしくお願いいたします。）",
    ].join("\n");
  }, [langCode, jobSlug]);

  const mailto = `mailto:${email}?subject=${encodeMailtoValue(
    subject
  )}&body=${encodeMailtoValue(body)}`;

  const [copiedMsg, setCopiedMsg] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  async function onCopyMessage() {
    await copyText(body);
    setCopiedMsg(true);
    setTimeout(() => setCopiedMsg(false), 1400);
  }

  async function onCopyEmail() {
    await copyText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 1400);
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      {/* top bar */}
      <div className="mb-6 flex items-center justify-between gap-3">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900"
        >
          ← {t("Назад", "戻る", "Back")}
        </Link>

        {jobSlug ? (
          <div className="rounded-full border border-slate-200 px-3 py-1 text-[12px] font-semibold text-slate-700">
            {t("Вакансія", "求人", "Job")}:{" "}
            <span className="font-mono">{jobSlug}</span>
          </div>
        ) : null}
      </div>

      {/* card */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {t("Звʼязатися з нами", "お問い合わせ", "Contact")}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {t(
                "Відкрий пошту з готовою темою і текстом — або просто скопіюй email/повідомлення.",
                "件名と本文が入力されたメールを開くか、メールアドレス/本文をコピーしてください。",
                "Open your email with a prepared subject/message, or copy the email/message."
              )}
            </p>
          </div>

          <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700">
            <IconMail />
          </div>
        </div>

        {/* email box */}
        <div className="mt-6 rounded-xl border border-slate-200 p-4">
          <p className="text-xs font-semibold text-slate-500">
            {t("Email для звернень", "お問い合わせメール", "Contact email")}
          </p>
          <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="break-all text-sm font-semibold text-slate-900">
              {email}
            </p>

            <button
              type="button"
              onClick={onCopyEmail}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
            >
              <IconCopy />
              {copiedEmail
                ? t("Скопійовано ✅", "コピーしました ✅", "Copied ✅")
                : t("Скопіювати email", "メールをコピー", "Copy email")}
            </button>
          </div>
        </div>

        {/* actions */}
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <a
            href={mailto}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            <IconMail />
            {t("Відкрити пошту", "メール作成", "Open email")}
            <span className="opacity-90">
              <IconArrow />
            </span>
          </a>

          <button
            type="button"
            onClick={onCopyMessage}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
          >
            <IconCopy />
            {copiedMsg
              ? t("Скопійовано ✅", "コピーしました ✅", "Copied ✅")
              : t("Скопіювати текст", "本文をコピー", "Copy message")}
          </button>

          <div className="rounded-xl border border-slate-200 px-4 py-3 text-xs text-slate-600">
            <span className="font-semibold text-slate-900">
              {t("Порада", "ヒント", "Tip")}:
            </span>{" "}
            {t(
              "Якщо пошта не відкрилась — вставте скопійований текст вручну.",
              "メールが開かない場合は、コピーした本文を貼り付けてください。",
              "If your email app didn’t open, paste the copied text manually."
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={null}>
      <ContactInner />
    </Suspense>
  );
}