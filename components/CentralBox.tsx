import Image from 'next/image';
import Cat from './Cat';
import Music from './Music';
import Desktop from './Desktop';
import Mobile from './Mobile';

export default function CentralBox() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* animated background (both versions) */}
      <div className="fixed inset-0 z-0">
        <Image 
          src="/images/background.webp" 
          alt="background" 
          fill 
          className="object-cover" 
          priority 
          draggable={false} 
          unoptimized={true}
        />
      </div>

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