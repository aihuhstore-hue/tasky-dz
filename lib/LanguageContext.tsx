"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { translations, Lang, T } from "./translations";

interface LanguageContextType {
  lang: Lang;
  t: T;
  setLang: (lang: Lang) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "ar",
  t: translations.ar,
  setLang: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ar");

  useEffect(() => {
    const saved = localStorage.getItem("tasky_lang") as Lang;
    if (saved === "ar" || saved === "fr") setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("tasky_lang", l);
  };

  return (
    <LanguageContext.Provider value={{ lang, t: translations[lang], setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
