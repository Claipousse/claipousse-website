import type { Metadata } from "next";
import { Zen_Kaku_Gothic_New } from "next/font/google";
import "./globals.css";

//Import police Zen Kaku Gothic New
const zenKaku = Zen_Kaku_Gothic_New({
  weight: ['400', '500', '700'], //400 regular (default on the website), 500 medium & 700 bold
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: "claipousse", //Title is my username :)
  description: "check my amazing website it's very tuff :D",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={zenKaku.className}>{children}</body>
    </html>
  );
}