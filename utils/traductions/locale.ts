export type Locale = "en" | "fr"; //only english and french for know, default english ofc, dont think there will ever gonna be another langage lmao

export const LOCALE_STORAGE_KEY = "locale"; //user's manual choice from the settings menu, overrides the accept-language guess once set

//the website take the accept-language http header, regex it to extract the very first language of the header and clean it to lowercase, if it start with fr (fr-fr, fr-ca, ...) return fr, else en
export function localeFromAcceptLanguage(header: string | null): Locale {
  const first = header?.split(",")[0]?.split(";")[0]?.trim().toLowerCase() ?? "";
  return first.startsWith("fr") ? "fr" : "en";
}

//im sure nobody gonna read a file like this, but if so, i hope you have a tungtungtung good day
