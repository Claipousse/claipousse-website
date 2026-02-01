import Image from 'next/image';

export default function WindowAbout() {
  return (
    <div className="window-content" style={{ paddingLeft: '2rem' }}>
      {/* header with photo, name and description */}
      <div className="flex items-center gap-6 mb-6">
        <div className="flex-shrink-0">
          <Image
            src="/images/other/myself.webp"
            alt="Claipousse"
            width={150} height={150}
            className="rounded-full object-cover border-2 border-gray-light"
            style={{ width: 'clamp(100px, 12vw, 150px)', height: 'clamp(100px, 12vw, 150px)' }}
            draggable={false}
          />
        </div>
        <div>
          <h1
            className="font-bold"
            style={{fontSize: 'clamp(1.75rem, 3.5vw, 3rem)', color: '#5136f0', fontFamily: 'var(--font-title)',}}
          >
            Claipousse / Clem
          </h1>
          <p
            className="text-dark-gray"
            style={{fontSize: 'clamp(1.125rem, 2vw, 1.5rem)', fontFamily: 'var(--font-body)'}}
          >
            french student, big nerd
          </p>
        </div>
      </div>

      {/* intro paragraph with list */}
      <div className="mb-6">
        <p className="text-body-lg text-dark-gray mb-3">
          hi! i'm claipousse, i...
        </p>
        
        <ul className="custom-list text-body-lg text-dark-gray">
          <li>study computer science and cybersecurity.</li>
          <li>have 2 beautiful cats</li>
          <li>am the world first cat lover in the entire universe !!</li>
        </ul>
      </div>

      {/* favorites games */}
      <div className="mb-6">
        <h2 className="section-header mb-2">
          FAVORITES GAMES
        </h2>
        <ul className="custom-list text-body-lg text-dark-gray mb-3">
          <li>Omori</li>
          <li>Oneshot</li>
          <li>Plants vs. Zombies GW2</li>
          <li>Minecraft</li>
          <li>Dofus</li>
        </ul>
        
        <p className="text-body-lg text-dark-gray">
          there is a LOT of games i love but didn&apos;t finished : Persona 5, Yume Nikki, Eastward, Monster Hunter Wilds, Fear & Hunger, ...
        </p>
      </div>

      {/* favorites mangas/animes */}
      <div className="mb-6">
        <h2 className="section-header mb-2">
          FAVORITES MANGAS/ANIMES
        </h2>
        <ul className="custom-list text-body-lg text-dark-gray mb-3">
          <li>Dr. Stone</li>
          <li>Chainsaw Man</li>
          <li>Death Note</li>
          <li>Hajime No Ippo</li>
          <li>Full Metal Alchemist</li>
          <li>Dungeon Meshi</li>
          <li>Shino can&apos;t say her name</li>
        </ul>
        
        <p className="text-body-lg text-dark-gray">
          there is again a huge amount of pieces i want to put here, here is my (incomplete) <a href="https://myanimelist.net/profile/Claipousse" target="_blank" rel="noopener noreferrer">MyAnimeList</a>.
        </p>
      </div>

      {/* other interests */}
      <div className="mb-6">
        <h2 className="section-header mb-2">
          OTHER INTERESTS
        </h2>
        <ul className="custom-list text-body-lg text-dark-gray">
          <li>cats.</li>
          <li>building PCs</li>
          <li>drawing</li>
          <li>cooking by feel</li>
          <li>handcraft</li>
        </ul>
      </div>
    </div>
  );
}