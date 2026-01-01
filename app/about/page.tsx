"use client";

import { useLang } from "@/app/providers";

export default function AboutPage() {
  const { lang } = useLang();
  const t = (ua: string, jp: string, en: string) =>
    lang === "ua" ? ua : lang === "jp" ? jp : en;

  const pageTitle = t("Про нас", "私たちについて", "About");

  const intro = t(
    "UKRJobsJapan — це україномовна платформа пошуку роботи в Японії для українців. Ми працюємо через центр підтримки «ひまわり», щоб контакт між кандидатом і роботодавцем був безпечним, зрозумілим і перевіреним.",
    "UKRJobsJapan は、日本で仕事を探すウクライナの方々のための求人プラットフォームです。支援センター「ひまわり」を通じて、安心できる連絡と調整を行います。",
    "UKRJobsJapan is a job platform in Japan for people from Ukraine. We work through the “Himawari” support center to keep all communication safe, clear, and trusted."
  );

  const metaLine = t(
    "Японія • 3 мови (UA/JP/EN) • перевірка вакансій перед публікацією",
    "日本国内向け • 3言語（UA/JP/EN） • 掲載前に内容を確認",
    "Japan-only • 3 languages (UA/JP/EN) • listings reviewed before publishing"
  );

  const howTitle = t("Як це працює", "仕組み", "How it works");

  const steps =
    lang === "ua"
      ? [
          {
            title: "Кандидат",
            text: "Обирає вакансію на сайті та надсилає запит до центру підтримки.",
          },
          {
            title: "Центр ひまわり",
            text: "Отримує звернення кандидата та передає контакт і інформацію роботодавцю.",
          },
          {
            title: "Вакансії",
            text: "Компанії надсилають свої вакансії до центру, а адміністратор публікує їх на сайті після перевірки.",
          },
        ]
      : lang === "jp"
      ? [
          {
            title: "求職者",
            text: "サイトで求人を選び、支援窓口へお問い合わせを送ります。",
          },
          {
            title: "ひまわり（支援窓口）",
            text: "求職者からの問い合わせを受け取り、企業へ連携します。",
          },
          {
            title: "求人掲載",
            text: "企業から届いた求人情報は窓口が受け取り、内容確認後にサイトへ掲載します。",
          },
        ]
      : [
          {
            title: "Candidate",
            text: "Chooses a job on the site and sends a request to the support center.",
          },
          {
            title: "Himawari Center",
            text: "Receives the request from the candidate and coordinates with the employer.",
          },
          {
            title: "Job listings",
            text: "Employers share their vacancies with the center, and an admin publishes them after review.",
          },
        ];

  const centerTitle = t("Центр підтримки", "支援センター", "Support center");

  const centerBody1 = t(
    "Цей сайт є проєктом українського центру спілкування та підтримки «ひまわり» (Хімаварі). Це місце, де українці в Японії можуть зібратися, поспілкуватися рідною мовою та отримати підтримку в повсякденних питаннях.",
    "本サイトは、ウクライナの方々が気軽に集い、母国語で交流し、生活上の相談ができる支援拠点「ウクライナ『心のケア』交流センター ひまわり」によるプロジェクトです。",
    "This website is a project of the Ukrainian community support center “Himawari” — a place where Ukrainians in Japan can gather, speak their native language, and receive support for everyday issues."
  );

  const centerBody2 = t(
    "Працевлаштування відбувається через центр: кандидат надсилає запит, центр зв’язується з роботодавцем і передає необхідну інформацію. Вакансії від компаній також надходять у центр і публікуються на сайті лише після перевірки адміністратором.",
    "就職支援は支援窓口を通じて行います。求職者からの問い合わせは窓口が受け取り、企業と連絡・調整を行います。企業からの求人情報も一度窓口で受け取り、内容を確認した上で掲載します。",
    "Employment support is coordinated via the center: candidates send their requests to the center, which then contacts the employer and shares the necessary information. Vacancies from companies also go through the center and are published on the site only after admin review."
  );

  const leadLabel = t("Керівник", "責任者", "Lead");
  const leadName = t("Маріко Укійо", "浮世満理子", "Mariko Ukiyo");

  const centerNameLabel = t("Назва центру", "拠点名称", "Center name");
  const centerName = "ウクライナ「心のケア」交流センター ひまわり";

  return (
    <div className="grid gap-8">
      {/* Intro */}
      <section className="rounded-3xl border border-slate-900/20 bg-white p-8 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          {pageTitle}
        </h1>

        {/* Premium meta row */}
        <p className="mt-2 text-sm text-slate-500">{metaLine}</p>

        <p className="mt-5 max-w-3xl text-slate-700 leading-relaxed">
          {intro}
        </p>
      </section>

      {/* How it works */}
      <section className="rounded-3xl border border-slate-900/20 bg-white p-8 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
        <h2 className="text-base font-bold text-slate-900">{howTitle}</h2>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {steps.map((s) => (
            <div
              key={s.title}
              className="rounded-3xl border border-slate-900/15 bg-white p-6 shadow-[0_8px_24px_rgba(0,0,0,0.05)]"
            >
              <h3 className="text-sm font-bold text-slate-900">{s.title}</h3>
              <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                {s.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Center */}
      <section className="rounded-3xl border border-slate-900/20 bg-white p-8 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
        <h2 className="text-base font-bold text-slate-900">{centerTitle}</h2>

        <p className="mt-3 text-sm leading-relaxed text-slate-700">
          {centerBody1}
        </p>

        <p className="mt-4 text-sm leading-relaxed text-slate-700">
          {centerBody2}
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-900/15 bg-white p-6 shadow-[0_8px_24px_rgba(0,0,0,0.05)]">
            <p className="text-xs font-semibold text-slate-500">
              {centerNameLabel}
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-900">
              {centerName}
            </p>
          </div>

          <div className="rounded-3xl border border-slate-900/15 bg-white p-6 shadow-[0_8px_24px_rgba(0,0,0,0.05)]">
            <p className="text-xs font-semibold text-slate-500">
              {leadLabel}
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-900">
              {leadName}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}