// need a special component for mobile version because its slightly different than the desktop version
import Image from 'next/image';

export default function MobileLinks() {
  const links = [
    { name: 'discord', url: 'https://discord.com/users/609413089938505728', icon: 'discord.webp' },
    { name: 'github', url: 'https://github.com/Claipousse', icon: 'github.webp' },
    { name: 'steam', url: 'https://steamcommunity.com/id/claipousse', icon: 'steam.webp' },
    { name: 'telegram', url: 'https://t.me/Claipousse', icon: 'telegram.webp' },
    { name: 'instagram', url: 'https://instagram.com/0xclement', icon: 'instagram.webp' },
    { name: 'youtube', url: 'https://youtube.com/@claipousse', icon: 'youtube.webp' }
  ];

  return (
    <div className="flex flex-col gap-3">
      {links.map((link) => (
        <a key={link.name} href={link.url} target="_blank" className="flex items-center gap-4 p-4 border-2 border-gray-light rounded-lg hover-scale bg-white" style={{ transition: 'all 0.2s ease' }}>
          {/* icon */}
          <div className="flex-shrink-0" style={{ width: '48px', height: '48px' }}>
            <Image src={`/images/socials/${link.icon}`} alt={link.name} width={48} height={48} className="w-full h-full object-contain drop-shadow-icon" draggable={false}/>
          </div>
          
          {/* label */}
          <span 
            className="text-dark-gray font-bold"
            style={{ fontSize: '1.125rem', fontFamily: 'var(--font-mono)'}}
          >
            {link.name}
          </span>
        </a>
      ))}
    </div>
  );
}