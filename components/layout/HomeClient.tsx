"use client";
//again bonnie blue's team import
import dynamic from "next/dynamic";
import { NavigationProvider } from "@/utils/navigation";
import { BackgroundMusicProvider } from "@/utils/backgroundMusic";
import { IntroProvider } from "@/utils/intro";
import { TraductionsProvider } from "@/utils/traductions";
import type { Locale } from "@/utils/traductions/locale";
import Intro from "./Intro";
import Detail from "@/components/gallery/Detail";
import Fade from "@/components/mypc/Fade";
import Boot from "@/components/mypc/Boot";
import Desktop from "@/components/mypc/Desktop";
import PreloadTrigger from "@/components/mypc/PreloadTrigger";
import Cursor from "./Cursor";
import Music from "./Music";
import WarningMobile from "./WarningMobile";
import BackgroundVideo from "./BackgroundVideo";

const Scene = dynamic(() => import("@/components/scene/Scene"), { ssr: false });

export default function HomeClient({ initialLocale }: { initialLocale: Locale }) {
  return (
    <TraductionsProvider initialLocale={initialLocale}>
      <IntroProvider>
        <NavigationProvider>
          <BackgroundMusicProvider>
            <main className="w-screen h-dvh">
              <BackgroundVideo />
              <Cursor />
              <Music />
              <Scene />
              <Detail />
              <PreloadTrigger />
              <Fade />
              <Boot />
              <Desktop />
            </main>
            <WarningMobile />
            <Intro />
          </BackgroundMusicProvider>
        </NavigationProvider>
      </IntroProvider>
    </TraductionsProvider>
  );
}