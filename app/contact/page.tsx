"use client";

import { useSearchParams } from "next/navigation";
import { useLang } from "@/app/providers";
import { useState } from "react";

function encodeMailtoValue(value: string) {
  // mailto любить CRLF для нових рядків
  const crlf = value.replace(/\n/g, "\r\n");
  return encodeURIComponent(crlf);
}

export default function ContactPage() {
  const { lang } = useLang();
  const t = (ua: string, jp: string, en: string) =>
    lang === "ua" ? ua : lang === "jp" ? jp : en;

  const params = useSearchParams();
  const jobId = params.get("job"); // /contact?job=...

  const email = "hello@ukrjobsjapan.example";

  const subject = t(
    jobId ? `Запит щодо вакансії (${jobId})` : "Запит щодо працевлаштування",
    jobId ? `求人お問い合わせ（${jobId}）` : "お問い合わせ",
    jobId ? `Job inquiry (${jobId})` : "Job inquiry"
  );

  const body = t(
    [
      "Вітаю!",
      "",
      "Хочу надіслати запит щодо працевлаштування.",
      jobId ? `ID вакансії: ${jobId}` : "",
      "",
      "Ім'я:",
      "Контакт (телефон / email):",
      "Коротко про мене:",
      "",
      "Дякую!",
    ]
      .filter(Boolean)
      .join("\n"),
    [
      "はじめまして。",
      "",
      "就職についてお問い合わせします。",
      jobId ? `求人ID: ${jobId}` : "",
      "",
      "氏名:",
      "連絡先（電話 / メール）:",
      "簡単な自己紹介:",
      "",
      "よろしくお願いいたします。",
    ]
      .filter(Boolean)
      .join("\n"),
    [
      "Hello,",
      "",
      "I would like to inquire about employment opportunities.",
      jobId ? `Job ID: ${jobId}` : "",
      "",
      "Name:",
      "Contact (phone / email):",
      "Short introduction:",
      "",
      "Thank you.",
    ]
      .filter(Boolean)
      .join("\n")
  );

  const mailto = `mailto:${email}?subject=${encodeMailtoValue(
    subject
  )}&body=${encodeMailtoValue(body)}`;

  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("Clipboard error", e);
    }
  }

  return (
    <div className="grid gap-8">
      <section className="rounded-3xl border border-slate-900/20 bg-white p-8 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          {t("Контакти", "お問い合わせ", "Contact")}
        </h1>

        <p className="mt-3 max-w-2xl text-slate-700">
          {t(
            "Натисніть кнопку нижче — відкриється ваш поштовий клієнт із готовою темою та текстом.",
            "下のボタンを押すと、件名と本文が入った状態でメール作成画面が開きます。",
            "Use the button below to open your email app with a prefilled subject and message."
          )}
        </p>

        {jobId ? (
          <div className="mt-5 rounded-2xl border border-slate-900/20 bg-white p-4">
            <p className="text-sm font-semibold text-slate-900">
              {t("Вибрана вакансія:", "対象の求人:", "Selected job:")}
            </p>
            <p className="mt-1 text-sm text-slate-700">
              <span className="font-mono">{jobId}</span>
            </p>
            <p className="mt-2 text-xs text-slate-600">
              {t(
                "За бажанням вкажіть цей ID у листі, щоб ми швидше зрозуміли, про яку вакансію йдеться.",
                "必要に応じて、このIDをメール本文に書いていただくと、求人の特定がスムーズになります。",
                "If you like, include this ID in your email so we can identify the job faster."
              )}
            </p>
          </div>
        ) : null}

        <div className="mt-6 rounded-2xl border border-slate-900/20 bg-white p-4">
          <p className="text-sm font-semibold text-slate-900">{email}</p>
          <p className="mt-1 text-xs text-slate-600">
            {t(
              "Пізніше цю адресу можна замінити на реальну пошту центру.",
              "後でセンターの正式なメールアドレスに変更できます。",
              "You can later replace this with the center’s real email address."
            )}
          </p>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href={mailto}
            className="inline-flex rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            {t("Надіслати повідомлення", "メール送信", "Send email")}
          </a>

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-900/20 bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
          >
            {copied && <span aria-hidden="true">✅</span>}
            <span>
              {copied
                ? t("Скопійовано", "コピーしました", "Copied")
                : t(
                    "Скопіювати email",
                    "メールアドレスをコピー",
                    "Copy email"
                  )}
            </span>
          </button>
        </div>
      </section>
    </div>
  );
}