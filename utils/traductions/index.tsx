// locale is decided serverside and passed in initialLocale

import { createContext, useContext, useState, ReactNode } from "react";
import { en, Dict } from "./en";
import { fr } from "./fr";
import type { Locale } from "./locale";

export type { Locale };

const dictionaries: Record<Locale, Dict> = { en, fr };
const TextContext = createContext<Dict>(en);
export const useT = () => useContext(TextContext);
const LocaleContext = createContext<{ locale: Locale; setLocale: (l: Locale) => void }>({locale: "en",setLocale: () => {},}); //setlocale to change the language
export const useLocale = () => useContext(LocaleContext);

export function TraductionsProvider({children,initialLocale,}: {children: ReactNode;initialLocale: Locale;}) { //provide the langage we use & dictionary to da whole app
  const [locale, setLocale] = useState<Locale>(initialLocale);
  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <TextContext.Provider value={dictionaries[locale]}>{children}</TextContext.Provider>
    </LocaleContext.Provider>
  );
}
