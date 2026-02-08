import type { Metadata } from "next";
import "@fontsource-variable/roboto";
import "@fontsource-variable/roboto-mono";
import "@fontsource/zen-kaku-gothic-new/500.css";
import "@fontsource/zen-kaku-gothic-new/700.css";
import "./globals.css";

//for tracking on vercel
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next"


export const metadata: Metadata = {
  title: "claipousse",
  description: "check my amazing website it's very cool :D",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics/>
        <SpeedInsights/>
      </body>
    </html>
  );
}