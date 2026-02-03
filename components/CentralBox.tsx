'use client';

import Niko from './Niko';
import Music from './Music';
import Desktop from './Desktop';
import Mobile from './Mobile';
import { useExternalLinkClick } from '@/hooks/useExternalLinkClick';

export default function CentralBox() {
  useExternalLinkClick(); //click sound on every external links

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* animated video background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 z-0 w-full h-full object-cover"
        style={{
          willChange: 'transform',
          transform: 'translate3d(0, 0, 0)',
          backfaceVisibility: 'hidden',
          pointerEvents: 'none',
        }}
      >
        <source src="/images/background.webm" type="video/webm" />
      </video>

      {/* desktop version - hidden < 768px */}
      <div className="hidden md:block">
        <Desktop/>
      </div>
      
      {/* mobile version - hidden >= 768px */}
      <div className="block md:hidden">
        <Mobile/>
      </div>
      
      {/* cats (visible on both versions) */}
      <Niko/>
      <Music/>
    </div>
  );
}