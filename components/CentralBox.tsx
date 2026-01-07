import Cat from './Cat';
import Music from './Music';
import Desktop from './Desktop';
import Mobile from './Mobile';

export default function CentralBox() {
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
      <Cat/>
      <Music/>
    </div>
  );
}