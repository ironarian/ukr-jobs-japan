"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useLang } from "@/app/providers";
import LanguageSwitcher from "./LanguageSwitcher";

type NavItem = { href: string; label: string };

export default function Header() {
  const pathname = usePathname();
  const { lang } = useLang();
  const [mobileOpen, setMobileOpen] = useState(false);

  const t = (ua: string, jp: string, en: string) =>
    lang === "ua" ? ua : lang === "jp" ? jp : en;

  const nav: NavItem[] = useMemo(
    () => [
      { href: "/jobs", label: t("Вакансії", "求人", "Jobs") },
      { href: "/about", label: t("Про нас", "私たちについて", "About") },
      { href: "/contact", label: t("Контакти", "お問い合わせ", "Contact") },
    ],
    [lang]
  );

  const isActive = (href: string) => pathname === href;

  // закриваємо мобільне меню при зміні маршруту
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // закривати по ESC
  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-30">
      {/* верхня панель */}
      <div className="relative border-b border-slate-200/70 bg-white/92 shadow-[0_10px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/70" />

        {/* на мобілці — звичайний flex, на десктопі — grid з 3 колонок */}
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2.5 md:grid md:grid-cols-3 md:py-4">
          {/* LEFT — Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <span
              className="
                inline-flex h-9 w-9 items-center justify-center rounded-2xl
                bg-gradient-to-br from-slate-900 to-slate-800
                text-xs font-extrabold tracking-tight text-white
                shadow-[0_12px_28px_rgba(0,0,0,0.14)]
                ring-1 ring-black/10
                transition-transform duration-200
                group-hover:-translate-y-[1px]
              "
              aria-hidden="true"
            >
              UJ
            </span>

            <span className="flex flex-col leading-tight">
              <span className="text-base font-extrabold tracking-tight text-slate-900 md:text-lg">
                UKRJobsJapan <span className="ml-1">🌻</span>
              </span>
              {/* підзаголовок приховую на дуже малих екранах, щоб не тиснувся */}
              <span className="hidden text-[11px] font-medium text-slate-500 sm:inline">
                {t(
                  "Вакансії в Японії для українців",
                  "日本で働きたいウクライナの方へ",
                  "Jobs in Japan for Ukrainians"
                )}
              </span>
            </span>
          </Link>

          {/* CENTER — Nav (desktop only) */}
          <nav className="hidden justify-center gap-8 md:flex">
            {nav.map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={[
                    "group relative text-sm font-semibold transition-colors",
                    active
                      ? "text-slate-900"
                      : "text-slate-600 hover:text-slate-900",
                    "rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                  ].join(" ")}
                >
                  {item.label}
                  <span
                    className={[
                      "absolute -bottom-1 left-0 h-[2px] w-full origin-left rounded-full bg-slate-900",
                      "transition-transform duration-300",
                      active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                    ].join(" ")}
                  />
                  <span
                    className={[
                      "pointer-events-none absolute -inset-x-2 -inset-y-1 rounded-xl",
                      "opacity-0 group-hover:opacity-100",
                      "transition-opacity duration-300",
                      "bg-gradient-to-r from-transparent via-slate-900/5 to-transparent",
                    ].join(" ")}
                    aria-hidden="true"
                  />
                </Link>
              );
            })}
          </nav>

          {/* RIGHT — language + menu button */}
          <div className="flex items-center gap-2 md:justify-end">
            <LanguageSwitcher />

            {/* Mobile menu button (тільки до md) */}
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-900/15 bg-white px-3 py-2 text-xs font-semibold text-slate-900 shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition hover:bg-slate-50 md:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-label={t("Меню", "メニュー", "Menu")}
            >
              <span className="mr-2 text-[11px]">
                {t("Меню", "メニュー", "Menu")}
              </span>
              <span aria-hidden="true" className="text-sm leading-none">
                {mobileOpen ? "✕" : "☰"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen ? (
        <div className="md:hidden">
          <div
            className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[2px]"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed left-0 right-0 top-[64px] z-50 mx-auto max-w-6xl px-4">
            <div className="rounded-3xl border border-slate-900/10 bg-white/90 p-3 shadow-[0_18px_50px_rgba(0,0,0,0.12)] backdrop-blur-xl">
              <div className="grid gap-1">
                {nav.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={[
                        "flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold",
                        active
                          ? "bg-slate-900 text-white"
                          : "text-slate-900 hover:bg-slate-50",
                      ].join(" ")}
                    >
                      <span>{item.label}</span>
                      <span className="opacity-70" aria-hidden="true">
                        →
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}