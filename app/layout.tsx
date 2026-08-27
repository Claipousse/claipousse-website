import type { Metadata } from "next";
import { headers } from "next/headers";
import { localeFromAcceptLanguage } from "@/utils/traductions/locale";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://claipousse.fr"),
  title: "claipousse",
  description:
    "Here is my personal website, explore a scene with 3d icons, a gallery, a virtual desktop and much more to learn about me :)",
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = localeFromAcceptLanguage((await headers()).get("accept-language"));
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "claipousse",
    url: "https://claipousse.fr",
    sameAs: [
      "https://github.com/Claipousse",
      "https://www.tiktok.com/@claipousse",
      "https://steamcommunity.com/id/claipousse",
    ],
  };
  return (
    <html lang={locale} className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        {children}
      </body>
    </html>
  );
}