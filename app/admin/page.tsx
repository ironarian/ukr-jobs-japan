// app/admin/page.tsx
"use client";

import Link from "next/link";
import { useLang } from "@/app/providers";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const { lang } = useLang();
  const router = useRouter();

  const t = (ua: string, jp: string, en: string) =>
    lang === "ua" ? ua : lang === "jp" ? jp : en;

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-slate-900">
            {t("Адмін-панель", "管理画面", "Admin panel")}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            {t(
              "Тут можна керувати вакансіями, які бачать користувачі на сайті.",
              "ここでは、サイトに表示される求人情報を管理できます。",
              "Here you can manage job postings shown on the site."
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={logout}
          className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-[0_8px_24px_rgba(15,23,42,0.06)] transition hover:bg-slate-50 sm:w-auto"
        >
          {t("Вийти", "ログアウト", "Logout")}
        </button>
      </header>

      <section className="grid gap-4">
        <Link
          href="/admin/jobs/new"
          className="group flex items-center justify-between rounded-3xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-900 shadow-[0_12px_40px_rgba(15,23,42,0.08)] transition hover:-translate-y-[1px] hover:border-slate-300 hover:shadow-[0_18px_60px_rgba(15,23,42,0.12)]"
        >
          <span className="min-w-0">
            {t("Створити нову вакансію", "新しい求人を作成する", "Create new job")}
          </span>
          <span aria-hidden="true" className="ml-4 opacity-60 transition group-hover:opacity-90">
            →
          </span>
        </Link>

        <Link
          href="/admin/jobs"
          className="group flex items-center justify-between rounded-3xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-900 shadow-[0_12px_40px_rgba(15,23,42,0.08)] transition hover:-translate-y-[1px] hover:border-slate-300 hover:shadow-[0_18px_60px_rgba(15,23,42,0.12)]"
        >
          <span className="min-w-0">
            {t("Список вакансій", "求人一覧", "Jobs list")}
          </span>
          <span aria-hidden="true" className="ml-4 opacity-60 transition group-hover:opacity-90">
            →
          </span>
        </Link>
      </section>
    </main>
  );
}