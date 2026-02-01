import Image from 'next/image';

export default function WindowLinks() {
  return (
    <div 
      className="flex flex-col items-center justify-center"
      style={{ 
        padding: 'clamp(1rem, 2vw, 2rem) clamp(1.5rem, 3vw, 3rem)'
      }}
    >
      <div 
        className="grid grid-cols-3"
        style={{
          gap: 'clamp(1rem, 2vw, 1.5rem) clamp(1.5rem, 3vw, 2.5rem)',
          width: '100%',
          maxWidth: 'clamp(440px, 44vw, 680px)'
        }}
      >
        <a href="https://discord.com/users/609413089938505728" target="_blank" className="flex flex-col items-center cursor-pointer hover-scale" style={{ gap: 'clamp(0.25rem, 0.5vw, 0.5rem)' }}>
          <div style={{ width: 'clamp(4rem, 6vw, 6rem)', height: 'clamp(4rem, 6vw, 6rem)' }}>
            <Image src="/images/socials/discord.webp" alt="discord" width={128} height={128} className="w-full h-full object-contain drop-shadow-icon" draggable={false} />
          </div>
          <span className="text-mono-sm text-dark-gray text-center">discord</span>
        </a>

        <a href="https://github.com/Claipousse" target="_blank" className="flex flex-col items-center cursor-pointer hover-scale" style={{ gap: 'clamp(0.25rem, 0.5vw, 0.5rem)' }}>
          <div style={{ width: 'clamp(4rem, 6vw, 6rem)', height: 'clamp(4rem, 6vw, 6rem)' }}>
            <Image src="/images/socials/github.webp" alt="github" width={128} height={128} className="w-full h-full object-contain drop-shadow-icon" draggable={false} />
          </div>
          <span className="text-mono-sm text-dark-gray text-center">github</span>
        </a>

        <a href="https://steamcommunity.com/id/claipousse" target="_blank" className="flex flex-col items-center cursor-pointer hover-scale" style={{ gap: 'clamp(0.25rem, 0.5vw, 0.5rem)' }}>
          <div style={{ width: 'clamp(4rem, 6vw, 6rem)', height: 'clamp(4rem, 6vw, 6rem)' }}>
            <Image src="/images/socials/steam.webp" alt="steam" width={128} height={128} className="w-full h-full object-contain drop-shadow-icon" draggable={false} />
          </div>
          <span className="text-mono-sm text-dark-gray text-center">steam</span>
        </a>

        <a href="https://t.me/Claipousse" target="_blank" className="flex flex-col items-center cursor-pointer hover-scale" style={{ gap: 'clamp(0.25rem, 0.5vw, 0.5rem)' }}>
          <div style={{ width: 'clamp(4rem, 6vw, 6rem)', height: 'clamp(4rem, 6vw, 6rem)' }}>
            <Image src="/images/socials/telegram.webp" alt="telegram" width={128} height={128} className="w-full h-full object-contain drop-shadow-icon" draggable={false} />
          </div>
          <span className="text-mono-sm text-dark-gray text-center">telegram</span>
        </a>

        <a href="https://instagram.com/0xclement" target="_blank" className="flex flex-col items-center cursor-pointer hover-scale" style={{ gap: 'clamp(0.25rem, 0.5vw, 0.5rem)' }}>
          <div style={{ width: 'clamp(4rem, 6vw, 6rem)', height: 'clamp(4rem, 6vw, 6rem)' }}>
            <Image src="/images/socials/instagram.webp" alt="instagram" width={128} height={128} className="w-full h-full object-contain drop-shadow-icon" draggable={false} />
          </div>
          <span className="text-mono-sm text-dark-gray text-center">instagram</span>
        </a>

        <a href="https://youtube.com/@claipousse" target="_blank" className="flex flex-col items-center cursor-pointer hover-scale" style={{ gap: 'clamp(0.25rem, 0.5vw, 0.5rem)' }}>
          <div style={{ width: 'clamp(4rem, 6vw, 6rem)', height: 'clamp(4rem, 6vw, 6rem)' }}>
            <Image src="/images/socials/youtube.webp" alt="youtube" width={128} height={128} className="w-full h-full object-contain drop-shadow-icon" draggable={false} />
          </div>
          <span className="text-mono-sm text-dark-gray text-center">youtube</span>
        </a>
      </div>
    </div>
  );
}