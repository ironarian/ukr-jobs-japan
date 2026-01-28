// app/admin/login/page.tsx
"use client";

import { FormEvent, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLang } from "@/app/providers";
import type { Lang } from "@/app/lib/i18n";
import { t } from "@/app/lib/i18n";

const DICT = {
  title: { ua: "Вхід в адмін-панель", jp: "管理画面ログイン", en: "Admin login" },
  subtitle: {
    ua: "Введіть пароль, щоб зайти в адмін-панель.",
    jp: "管理画面に入るためのパスワードを入力してください。",
    en: "Enter password to access admin panel.",
  },
  passwordLabel: { ua: "Пароль", jp: "パスワード", en: "Password" },

  wrongPassword: {
    ua: "Невірний пароль",
    jp: "パスワードが違います",
    en: "Wrong password",
  },

  // ✅ NEW: rate limit message
  tooManyAttempts: {
    ua: "Забагато спроб. Спробуйте ще раз через 5 хвилин.",
    jp: "試行回数が多すぎます。5分後にもう一度お試しください。",
    en: "Too many attempts. Please try again in 5 minutes.",
  },

  signIn: { ua: "Увійти", jp: "ログイン", en: "Sign in" },
  signingIn: { ua: "Вхід...", jp: "ログイン中...", en: "Signing in..." },
  showPassword: { ua: "Показати пароль", jp: "パスワードを表示", en: "Show password" },
  hidePassword: { ua: "Приховати пароль", jp: "パスワードを非表示", en: "Hide password" },
} as const;

export default function AdminLoginPage() {
  const sp = useSearchParams();
  const next = sp.get("next") || "/admin";
  const error = sp.get("error"); // "1" | "rate" | null

  const wrongPassword = error === "1";
  const rateLimited = error === "rate";

  const { lang } = useLang() as { lang: Lang };

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = useMemo(
    () => password.trim().length > 0 && !submitting,
    [password, submitting]
  );

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);

    // ✅ Safari/iPhone: normal form submit (works everywhere)
    const form = e.currentTarget as HTMLFormElement;
    form.submit();
  }

  return (
    <main className="mx-auto max-w-md px-4 py-10">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_14px_50px_rgba(15,23,42,0.08)]">
        <h1 className="text-[18px] font-semibold text-slate-900">
          {t(lang, DICT, "title")}
        </h1>
        <p className="mt-1 text-[13px] text-slate-500">
          {t(lang, DICT, "subtitle")}
        </p>

        <form
          onSubmit={onSubmit}
          className="mt-5 space-y-4"
          action={`/api/admin/login?next=${encodeURIComponent(next)}`}
          method="POST"
        >
          <label className="block">
            <span className="mb-1 block text-[12px] font-medium text-slate-700">
              {t(lang, DICT, "passwordLabel")}
            </span>

            <div className="relative">
              <input
                name="password"
                lang="en"
                dir="ltr"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                type={showPassword ? "text" : "password"}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 pr-10 text-[14px] outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-200/50"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 hover:text-slate-800 focus:outline-none"
                aria-label={
                  showPassword
                    ? t(lang, DICT, "hidePassword")
                    : t(lang, DICT, "showPassword")
                }
                title={
                  showPassword
                    ? t(lang, DICT, "hidePassword")
                    : t(lang, DICT, "showPassword")
                }
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.8}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 3l18 18M10.58 10.58A2 2 0 0012 14a2 2 0 001.42-.58M9.88 5.09A9.77 9.77 0 0112 5c5.52 0 10 7 10 7a19.8 19.8 0 01-3.54 4.59M6.1 6.1A19.8 19.8 0 002 12s4.48 7 10 7a9.77 9.77 0 004.12-.91"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.8}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2 12s4.48-7 10-7 10 7 10 7-4.48 7-10 7-10-7-10-7z"
                    />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </label>

          {/* ❌ wrong password */}
          {wrongPassword && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-[13px] text-red-700">
              {t(lang, DICT, "wrongPassword")}
            </div>
          )}

          {/* ⚠️ rate limited */}
          {rateLimited && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-[13px] text-amber-800">
              {t(lang, DICT, "tooManyAttempts")}
            </div>
          )}

          <button
            type="submit"
            disabled={!canSubmit}
            className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-[13px] font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-60"
          >
            {submitting ? t(lang, DICT, "signingIn") : t(lang, DICT, "signIn")}
          </button>
        </form>
      </div>
    </main>
  );
}