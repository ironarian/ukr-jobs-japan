"use client";

import Link from "next/link";
import { useLang } from "@/app/providers";

export default function HomePage() {
  const { lang } = useLang();
  const t = (ua: string, jp: string, en: string) =>
    lang === "ua" ? ua : lang === "jp" ? jp : en;

  const cards = [
    {
      title: t("Для кандидатів", "求職者向け", "For candidates"),
      text: t(
        "Зрозумілі вимоги та короткий опис вакансії трьома мовами: UA / JP / EN.",
        "求人の要点（条件・仕事内容）を、UA / JP / EN の3言語で分かりやすく掲載しています。",
        "Clear requirements and a short job summary in UA / JP / EN."
      ),
    },
    {
      title: t("Для роботодавців", "企業向け", "For employers"),
      text: t(
        "Розміщення вакансій відбувається через адміністратора — кожна публікація перевіряється перед появою на сайті.",
        "求人情報は管理者を通じて掲載され、内容を確認した上で公開されます。",
        "Job postings are submitted through an administrator and reviewed before publishing."
      ),
    },
    {
      title: t("Фокус: Японія", "日本限定", "Japan-only focus"),
      text: t(
        "Тільки вакансії в Японії та реалістичні вимоги для життя і роботи тут.",
        "日本国内の求人に限定し、実際の生活や働き方に沿った情報を掲載しています。",
        "Japan-only job listings with realistic requirements for living and working here."
      ),
    },
  ];

  const tags = [
    t("Модерація вакансій", "管理者確認", "Admin-reviewed"),
    t("3 мови: UA / JP / EN", "3言語（UA / JP / EN）", "3 languages: UA / JP / EN"),
    t("Тільки Японія", "日本国内のみ", "Japan-only"),
  ];

  return (
    <div className="grid gap-10">
      {/* Hero */}
      <section className="rounded-3xl border border-slate-900/20 bg-white p-8 shadow-[0_8px_30px_rgba(0,0,0,0.06)] md:p-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
          {t(
            "Платформа вакансій у Японії для українців 🌻",
            "日本で働きたいウクライナの方のための求人プラットフォーム 🌻",
            "A Japan-only job platform for Ukrainians 🌻"
          )}
        </h1>

        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-slate-700">
          {t(
            "Зрозумілі умови, короткі описи вакансій і публікація після перевірки адміністратором.",
            "条件が分かりやすく、要点をまとめた求人のみを掲載し、管理者が内容を確認しています。",
            "Clear requirements, concise job summaries, and admin-reviewed listings."
          )}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/jobs"
            className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow-[0_10px_30px_rgba(0,0,0,0.12)] transition hover:bg-slate-800"
          >
            {t("Перейти до вакансій", "求人を見る", "View jobs")}
          </Link>

          <Link
            href="/about"
            className="rounded-2xl border border-slate-900/20 bg-white px-5 py-3 text-sm font-medium text-slate-900 shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition hover:bg-slate-50"
          >
            {t("Про нас", "私たちについて", "About")}
          </Link>

          <Link
            href="/contact"
            className="rounded-2xl border border-slate-900/20 bg-white px-5 py-3 text-sm font-medium text-slate-900 shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition hover:bg-slate-50"
          >
            {t("Контакти", "お問い合わせ", "Contact")}
          </Link>
        </div>

        {/* Tags */}
        <div className="mt-6 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-slate-900/15 bg-white px-3 py-1 text-xs font-medium text-slate-800 shadow-[0_8px_30px_rgba(0,0,0,0.03)]"
            >
              {tag}
            </span>
          ))}
        </div>
      </section>

      {/* Cards */}
      <section className="grid gap-4 md:grid-cols-3">
        {cards.map((c) => (
          <div
            key={c.title}
            className="rounded-3xl border border-slate-900/20 bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
          >
            <h3 className="text-[15px] font-bold text-slate-900">{c.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              {c.text}
            </p>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="rounded-3xl border border-slate-900/20 bg-white p-8 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
        <h2 className="text-base font-bold text-slate-900">
          {t(
            "Почніть з фільтрів — так зручніше 🌻",
            "まずは条件で絞り込むのがおすすめです 🌻",
            "Start with filters — it’s easier 🌻"
          )}
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-700">
          {t(
            "На сторінці вакансій можна відфільтрувати вакансії за типом роботи, рівнем японської та тривалістю.",
            "求人一覧ページでは「雇用形態」「日本語レベル」「期間」で絞り込みができます。",
            "On the Jobs page you can filter by job type, Japanese level, and duration."
          )}
        </p>

        <div className="mt-5">
          <Link
            href="/jobs"
            className="inline-flex rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow-[0_10px_30px_rgba(0,0,0,0.12)] transition hover:bg-slate-800"
          >
            {t("Відкрити вакансії", "求人一覧へ", "Open jobs")}
          </Link>
        </div>
      </section>
    </div>
  );
}