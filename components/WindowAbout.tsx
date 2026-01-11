import Image from 'next/image';

export default function WindowAbout() {
  return (
    <div 
      className="flex flex-col"
      style={{
        padding: 'clamp(1.5rem, 3vw, 2.5rem)',
        width: '100%',
        maxWidth: 'clamp(550px, 55vw, 850px)'
      }}
    >
    <div className="p-6">
      {/*header*/}
      <div className="flex items-center gap-6 mb-6">
        <div className="flex-shrink-0">
          <Image
            src="/images/other/myself.webp"
            alt="Claipousse"
            width={120}
            height={120}
            className="rounded-full object-cover border-1 border-gray-light"
            style={{ width: 'clamp(80px, 10vw, 120px)', height: 'clamp(80px, 10vw, 120px)' }}
            draggable={false}
          />
        </div>
        <div>
          <h1
            className="font-bold"
            style={{
              fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
              color: '#5136f0',
              fontFamily: 'var(--font-title)'
            }}
          >
            Claipousse / Clem
          </h1>
        </div>
      </div>

      {/* Paragraphe intro */}
      <p
        className="text-dark-gray mb-6"
        style={{
          fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
          lineHeight: '1.6',
          fontFamily: 'var(--font-body)'
        }}
      >
        test
      </p>

      {/*fav games*/}
      <div className="mb-6">
        <h2
          className="font-bold mb-3"
          style={{
            fontSize: 'clamp(1rem, 1.8vw, 1.25rem)',
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.05em'
          }}
        >
          FAVORITES GAMES
        </h2>
        <ul
          className="text-dark-gray"
          style={{
            fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
            lineHeight: '1.8',
            fontFamily: 'var(--font-body)',
            listStyle: 'none',
            paddingLeft: '1.5rem'
          }}
        >
          <li style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '-1.5rem' }}>•</span>
            Omori
          </li>
          <li style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '-1.5rem' }}>•</span>
            Oneshot
          </li>
          <li style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '-1.5rem' }}>•</span>
            Plants vs. Zombies GW2
          </li>
          <li style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '-1.5rem' }}>•</span>
            Dofus
          </li>
          <li style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '-1.5rem' }}>•</span>
            Overwatch (toxic relationship tho...)
          </li>
        </ul>
      </div>
      <p
        className="text-dark-gray mb-6"
        style={{
          fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
          lineHeight: '1.6',
          fontFamily: 'var(--font-body)'
        }}
      >
        there is a LOT of games i love but didn't finished : Persona 5, Yume Nikki, Eastward, Monster Hunter Wilds, Fear & Hunger, ...
      </p>

      {/*fav mangas/animes*/}
      <div className="mb-6">
        <h2
          className="font-bold mb-3"
          style={{
            fontSize: 'clamp(1rem, 1.8vw, 1.25rem)',
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.05em'
          }}
        >
          FAVORITES MANGAS/ANIMES
        </h2>
        <ul
          className="text-dark-gray"
          style={{
            fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
            lineHeight: '1.8',
            fontFamily: 'var(--font-body)',
            listStyle: 'none',
            paddingLeft: '1.5rem'
          }}
        >
          <li style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '-1.5rem' }}>•</span>
            Dr. Stone
          </li>
          <li style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '-1.5rem' }}>•</span>
            Chainsaw Man
          </li>
          <li style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '-1.5rem' }}>•</span>
            Death Note
          </li>
          <li style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '-1.5rem' }}>•</span>
            Hajime No Ippo
          </li>
          <li style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '-1.5rem' }}>•</span>
            Dungeon Meshi
          </li>
          <li style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '-1.5rem' }}>•</span>
            Shino can't say her name
          </li>
          <li style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '-1.5rem' }}>•</span>
            The boy and the dog
          </li>
        </ul>
      </div>
      <p
        className="text-dark-gray mb-6"
        style={{
          fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
          lineHeight: '1.6',
          fontFamily: 'var(--font-body)'
        }}
      >
        there is again a huge amount of pieces i want to put here, here is my (uncomplete){' '}
        <a
          href="https://myanimelist.net/profile/YOUR_USERNAME"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold underline"
          style={{ color: '#5136f0' }}
        >
           MyAnimeList
        </a>
        .
      </p>

      {/*other interests*/}
      <div className="mb-6">
        <h2
          className="font-bold mb-3"
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
            lineHeight: '1.8',
            fontFamily: 'var(--font-body)',
            listStyle: 'none',
            paddingLeft: '1.5rem'
          }}
        >
          <li style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '-1.5rem' }}>•</span>
            cats.
          </li>
          <li style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '-1.5rem' }}>•</span>
            building PCs
          </li>
          <li style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '-1.5rem' }}>•</span>
            drawing
          </li>
          <li style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '-1.5rem' }}>•</span>
            cooking by feel
          </li>
          <li style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '-1.5rem' }}>•</span>
            handcraft
          </li>
        </ul>
      </div>

      <style jsx>{`
        /* Custom scrollbar pour correspondre aux photos */
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
    </div>
    </div>
  );
}