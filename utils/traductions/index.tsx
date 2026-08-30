// locale is decided serverside and passed in initialLocale, but a manual pick from the settings menu is remembered in localstorage and wins after that

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { en, Dict } from "./en";
import { fr } from "./fr";
import { LOCALE_STORAGE_KEY, type Locale } from "./locale";

export type { Locale };

const dictionaries: Record<Locale, Dict> = { en, fr };
const TextContext = createContext<Dict>(en);
export const useT = () => useContext(TextContext);
const LocaleContext = createContext<{ locale: Locale; setLocale: (l: Locale) => void }>({locale: "en",setLocale: () => {},}); //setlocale to change the language
export const useLocale = () => useContext(LocaleContext);

function recall(): Locale | null {
  try {
    const value = localStorage.getItem(LOCALE_STORAGE_KEY);
    return value === "fr" || value === "en" ? value : null;
  } catch {
    return null;
  }
}

function remember(locale: Locale) {
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {}
}

export function TraductionsProvider({children,initialLocale,}: {children: ReactNode;initialLocale: Locale;}) { //provide the langage we use & dictionary to da whole app
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  //saved choice only applies after mount to keep ssr/client markup identical on first paint
  useEffect(() => {
    const saved = recall();
    if (saved && saved !== locale) setLocaleState(saved);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    remember(l);
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <TextContext.Provider value={dictionaries[locale]}>{children}</TextContext.Provider>
    </LocaleContext.Provider>
  );
}
