import Image from 'next/image';

export default function WindowAbout() {
  return (
    <>
      {/* header with photo, name and description */}
      <div className="flex items-center gap-6 mb-6">
        <div className="flex-shrink-0">
          <Image
            src="/images/other/myself.webp"
            alt="Claipousse"
            width={120}
            height={120}
            className="rounded-full object-cover border-2 border-gray-light"
            style={{ 
              width: 'clamp(80px, 10vw, 120px)', 
              height: 'clamp(80px, 10vw, 120px)' 
            }}
            draggable={false}
          />
        </div>
        <div>
          <h1
            className="font-bold"
            style={{
              fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
              color: '#5136f0',
              fontFamily: 'var(--font-title)',
              marginBottom: '0.5rem'
            }}
          >
            Claipousse / Clem
          </h1>
          <p
            style={{
              fontSize: 'clamp(1rem, 1.8vw, 1.25rem)',
              color: '#5136f0',
              fontFamily: 'var(--font-body)'
            }}
          >
            [mini description placeholder]
          </p>
        </div>
      </div>

      {/* favorites games */}
      <div className="mb-6">
        <h2
          className="font-bold mb-2"
          style={{
            fontSize: 'clamp(1rem, 1.8vw, 1.25rem)',
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.05em'
          }}
        >
          FAVORITES GAMES
        </h2>
        <ul
          className="text-dark-gray mb-3"
          style={{
            fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
            lineHeight: '1.4',
            fontFamily: 'var(--font-body)',
            listStyle: 'disc',
            paddingLeft: '1.5rem'
          }}
        >
          <li>Omori</li>
          <li>Oneshot</li>
          <li>Plants vs. Zombies GW2</li>
          <li>Dofus</li>
          <li>Overwatch (toxic relationship tho...)</li>
        </ul>
        
        <p
          className="text-dark-gray"
          style={{
            fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
            lineHeight: '1.6',
            fontFamily: 'var(--font-body)'
          }}
        >
          there is a LOT of games i love but didn&apos;t finished : Persona 5, Yume Nikki, Eastward, Monster Hunter Wilds, Fear & Hunger, ...
        </p>
      </div>

      {/* favorites mangas/animes */}
      <div className="mb-6">
        <h2
          className="font-bold mb-2"
          style={{
            fontSize: 'clamp(1rem, 1.8vw, 1.25rem)',
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.05em'
          }}
        >
          FAVORITES MANGAS/ANIMES
        </h2>
        <ul
          className="text-dark-gray mb-3"
          style={{
            fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
            lineHeight: '1.4',
            fontFamily: 'var(--font-body)',
            listStyle: 'disc',
            paddingLeft: '1.5rem'
          }}
        >
          <li>Dr. Stone</li>
          <li>Chainsaw Man</li>
          <li>Death Note</li>
          <li>Hajime No Ippo</li>
          <li>Dungeon Meshi</li>
          <li>Shino can&apos;t say her name</li>
          <li>The boy and the dog</li>
        </ul>
        
        <p
          className="text-dark-gray"
          style={{
            fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
            lineHeight: '1.6',
            fontFamily: 'var(--font-body)'
          }}
        >
          there is again a huge amount of pieces i want to put here, here is my (uncomplete) <a href="https://myanimelist.net/profile/Claipousse" target="_blank" rel="noopener noreferrer" className="font-bold underline" style={{ color: '#5136f0' }}>MyAnimeList</a>.
        </p>
      </div>

      {/* other interests */}
      <div className="mb-6">
        <h2
          className="font-bold mb-2"
          style={{
            fontSize: 'clamp(1rem, 1.8vw, 1.25rem)',
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.05em'
          }}
        >
          OTHER INTERESTS
        </h2>
        <ul
          className="text-dark-gray"
          style={{
            fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
            lineHeight: '1.4',
            fontFamily: 'var(--font-body)',
            listStyle: 'disc',
            paddingLeft: '1.5rem'
          }}
        >
          <li>cats.</li>
          <li>building PCs</li>
          <li>drawing</li>
          <li>cooking by feel</li>
          <li>handcraft</li>
        </ul>
      </div>

      <style jsx>{`
        ul li::marker {
          font-size: 1.5em;
          color: #424242;
        }

        div {
          scrollbar-width: thin;
          scrollbar-color: #cecece transparent;
        }

        div::-webkit-scrollbar {
          width: 8px;
        }

        div::-webkit-scrollbar-track {
          background: transparent;
        }

        div::-webkit-scrollbar-thumb {
          background-color: #cecece;
          border-radius: 4px;
        }

        div::-webkit-scrollbar-thumb:hover {
          background-color: #a4a4a4;
        }
      `}</style>
    </>
  );
}