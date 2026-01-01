"use client";

import { useLang } from "@/app/providers";

export default function Footer() {
  const { lang } = useLang();

  const t = (ua: string, jp: string, en: string) =>
    lang === "ua" ? ua : lang === "jp" ? jp : en;

  const meta = t(
    "Японія • перевірено центром ひまわり",
    "日本国内限定 • ひまわりセンター確認済み",
    "Japan-only • reviewed by Himawari Center"
  );

  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-slate-200/60 bg-white/75 backdrop-blur supports-[backdrop-filter]:backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="flex flex-col gap-2 text-xs md:flex-row md:items-center md:justify-between">
          
          <p
            className="font-semibold text-slate-700"
            aria-label={`UKRJobsJapan, ${year}`}
          >
            © {year} UKRJobsJapan
          </p>

          <p className="text-slate-500">
            {meta}
          </p>
        </div>
      </div>
    </footer>
  );
}