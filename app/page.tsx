import { headers } from "next/headers";
import HomeClient from "@/components/layout/HomeClient";
import { localeFromAcceptLanguage } from "@/utils/traductions/locale";
import { en } from "@/utils/traductions/en";
import { fr } from "@/utils/traductions/fr";

export default async function Home() {
  const locale = localeFromAcceptLanguage((await headers()).get("accept-language"));
  const dict = locale === "fr" ? fr : en;

  return (
    <>
      {/* sr-only intro for seo and screen readers, only aboutme cause its real sentences not ui labels like the rest of the dictionary */}
      <div className="sr-only">
        <h1>{dict.menu.greeting}</h1>
        <p>
          {dict.aboutme.intro} {dict.aboutme.fact1}, {dict.aboutme.fact2}.
        </p>
        <p>
          {dict.aboutme.hobbiesTitle}: {dict.aboutme.hobby1}, {dict.aboutme.hobby2}, {dict.aboutme.hobby3}.
        </p>
      </div>
      <HomeClient initialLocale={locale} />
    </>
  );
}