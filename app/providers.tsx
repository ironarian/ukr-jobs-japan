"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Lang = "ua" | "jp" | "en";

type LangContextValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  ready: boolean;
};

const LangContext = createContext<LangContextValue | null>(null);

export function Providers({ children }: { children: React.ReactNode }) {
  // важливо: початкове значення не має "скакати" між SSR і клієнтом
  const [lang, setLangState] = useState<Lang>("ua");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("lang");
      if (saved === "ua" || saved === "jp" || saved === "en") {
        setLangState(saved);
      }
    } finally {
      setReady(true);
    }
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    window.localStorage.setItem("lang", l);
  };

  const value = useMemo(() => ({ lang, setLang, ready }), [lang, ready]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within Providers");
  return ctx;
}