// app/admin/jobs/AdminJobsClient.tsx
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "@/app/providers";

type Lang = "ua" | "jp" | "en";

type JobRow = {
  id: string;
  slug: string;
  published: boolean;
  titleJp: string;
  titleUa: string | null;
  titleEn: string | null;
  companyNameJp: string;
  companyNameUa: string | null;
  companyNameEn: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
};

export default function AdminJobsClient({ jobs }: { jobs: JobRow[] }) {
  const router = useRouter();
  const { lang } = useLang() as { lang: Lang };
  const t = (ua: string, jp: string, en: string) => (lang === "ua" ? ua : lang === "jp" ? jp : en);

  const [busyId, setBusyId] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const rows = useMemo(() => jobs ?? [], [jobs]);

  function pick(ua?: string | null, jp?: string | null, en?: string | null) {
    const U = (ua ?? "").trim();
    const J = (jp ?? "").trim();
    const E = (en ?? "").trim();
    if (lang === "ua") return U || J || E;
    if (lang === "jp") return J || U || E;
    return E || J || U;
  }

  async function togglePublish(id: string) {
    setErr(null);
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/jobs/${id}/toggle`, {
        method: "POST",

        // ✅ CRITICAL: iPhone/Safari needs this for cookies on API calls
        credentials: "include",
        cache: "no-store",
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error((data as any)?.error || "Unauthorized");

      router.refresh();
    } catch (e: any) {
      setErr(e?.message || "Error");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t("Вакансії (адмін-панель)", "求人（管理）", "Jobs (Admin)")}</h1>
          <p className="mt-1 text-sm text-slate-600">
            {t("Тут можна створювати, редагувати та публікувати вакансії.", "求人の作成・編集・公開ができます。", "Create, edit and publish jobs here.")}
          </p>
        </div>

        <Link
          href="/admin/jobs/new"
          className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
        >
          + {t("Нова вакансія", "新規作成", "New job")}
        </Link>
      </div>

      {err && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {err}
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-[900px] w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              <th className="px-4 py-3">{t("Статус", "状態", "Status")}</th>
              <th className="px-4 py-3">{t("Назва", "タイトル", "Title")}</th>
              <th className="px-4 py-3">{t("Компанія", "会社", "Company")}</th>
              <th className="px-4 py-3">slug</th>
              <th className="px-4 py-3">{t("Дії", "操作", "Actions")}</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((job) => {
              const title = pick(job.titleUa, job.titleJp, job.titleEn) || job.titleJp;
              const company = pick(job.companyNameUa, job.companyNameJp, job.companyNameEn) || job.companyNameJp;

              return (
                <tr key={job.id} className="border-t border-slate-100">
                  <td className="px-4 py-3">
                    {job.published ? (
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        {t("Опубліковано", "公開", "Published")}
                      </span>
                    ) : (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                        {t("Приховано", "非公開", "Hidden")}
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3 font-medium text-slate-900">{title}</td>
                  <td className="px-4 py-3 text-slate-700">{company}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-600">{job.slug}</td>

                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/admin/jobs/${job.id}`}
                        className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        {t("Редагувати", "編集", "Edit")}
                      </Link>

                      <a
                        href={`/jobs/${encodeURIComponent(job.slug)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        {t("Перегляд", "表示", "View")}
                      </a>

                      <button
                        type="button"
                        onClick={() => togglePublish(job.id)}
                        disabled={busyId === job.id}
                        className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                      >
                        {busyId === job.id
                          ? t("Зачекай...", "処理中...", "Working...")
                          : job.published
                          ? t("Зняти", "非公開にする", "Unpublish")
                          : t("Опублікувати", "公開する", "Publish")}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {rows.length === 0 && (
              <tr>
                <td className="px-4 py-8 text-center text-slate-600" colSpan={5}>
                  {t("Поки немає вакансій.", "求人がありません。", "No jobs yet.")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}