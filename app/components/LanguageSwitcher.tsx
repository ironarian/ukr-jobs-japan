// app/components/LanguageSwitcher.tsx
"use client";

import { useLang } from "@/app/providers";

type Lang = "ua" | "jp" | "en";

export default function LanguageSwitcher() {
  const { lang, setLang } = useLang() as {
    lang: Lang;
    setLang: (l: Lang) => void;
  };

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white p-1 shadow-sm">
      {(["ua", "jp", "en"] as Lang[]).map((l) => {
        const active = lang === l;

        return (
          <button
            key={l}
            type="button"
            onClick={() => setLang(l)}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
              active
                ? "bg-slate-900 text-white"
                : "text-slate-700 hover:bg-slate-50"
            }`}
            aria-pressed={active}
          >
            {l.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}