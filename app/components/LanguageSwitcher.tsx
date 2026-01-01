"use client";

import { useLang, type Lang } from "@/app/providers";

const items: { value: Lang; label: string; aria: string }[] = [
  { value: "ua", label: "UA", aria: "Українська мова" },
  { value: "jp", label: "JP", aria: "日本語" },
  { value: "en", label: "EN", aria: "English" },
];

export default function LanguageSwitcher() {
  const { lang, setLang } = useLang();

  return (
    <div
      className="
        inline-flex items-center rounded-2xl border border-slate-900/15
        bg-white/70 p-1 shadow-[0_8px_30px_rgba(0,0,0,0.06)]
        backdrop-blur supports-[backdrop-filter]:backdrop-blur-md
      "
      role="radiogroup"
      aria-label="Language selection"
    >
      {items.map((it) => {
        const active = it.value === lang;

        return (
          <button
            key={it.value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={it.aria}
            onClick={() => setLang(it.value)}
            className={`
              rounded-xl px-3 py-1.5 text-xs font-semibold transition-all
              focus:outline-none focus-visible:ring-2
              focus-visible:ring-slate-900/25 focus-visible:ring-offset-2
              ${active
                ? "bg-slate-900 text-white shadow-[0_8px_18px_rgba(0,0,0,0.16)]"
                : "text-slate-700 hover:bg-slate-100 active:bg-slate-200"}
            `}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );
}