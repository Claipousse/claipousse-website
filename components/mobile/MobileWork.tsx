'use client';

import Image from 'next/image';

interface ProjectData {
  id: number;
  image: string;
  title: string;
  paragraph1: string;
  paragraph2: string;
}

const PROJECT_DATA: ProjectData[] = [
  {
    id: 1,
    image: '/images/projects/ledgerone.webp',
    title: 'LedgerOne',
    paragraph1: "a manual expense manager web app, coded for a test to join my school's junior enterprise. i made it using vanilla frontend (html/css/js) and python for the backend, with fastAPI, sqlite, etc",
    paragraph2: "i don't host it online, you can test it locally via the github repository <a href='https://github.com/Claipousse/LedgerOne' target='_blank'>here</a>."
  },
  {
    id: 2,
    image: '/images/projects/kattack.webp',
    title: 'Kattack',
    paragraph1: "a vampire survivor-like browser game made with kaplay game engine. the game is abandonware, unfinished, and ugly asf, but a fun break from my usual projects. you can play this shitty game on <a href='https://claipousse.itch.io/kattack' target='_blank'>itch.io</a>.",
    paragraph2: "i made the game with kaplay, a javascript game engine pretty fun to use, you can check the github repository <a href='https://github.com/Claipousse/kattack' target='_blank'>here</a>."
  },
  {
    id: 3,
    image: '/images/projects/wsc.webp',
    title: 'Windows Storage Cleaner',
    paragraph1: "a cli tool written in Rust that deletes temporary files and directories, a lot of browser caches, and other windows junk to free some space.",
    paragraph2: "you can download the .exe file <a href='https://github.com/Claipousse/Windows-System-Cleaner/releases/tag/v0.1.2' target='_blank'>here</a>, and check the <a href='https://github.com/Claipousse/Windows-System-Cleaner' target='_blank'>source code</a> if you think it's a nasty, mischievous virus :D"
  },
  {
    id: 4,
    image: '/images/projects/web.webp',
    title: 'This Website',
    paragraph1: "i wanted to create a small website to add to my social media bios for something more personalized :) i also wanted to do it to learn how to use react and how to host a website.",
    paragraph2: "i explain in more detail about the stack i used in the faq, but again, i let the source code <a href='https://github.com/Claipousse/claipousse-website' target='_blank'>here</a>."
  }
];

export default function MobileWork() {
  return (
    <div className="window-content" style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
      {/* cybersecurity */}
      <div className="mb-12 mt-6">
        <h2 className="section-header mb-2">
          CYBERSECURITY
        </h2>
        <p className="text-body-lg-tight text-dark-gray mb-3">
          unfortunately, I won't be able to put much in it, mainly because I'm still learning about it. however i...
        </p>
        <ul className="custom-list text-body-lg text-dark-gray">
          <li>am taking classes and practising on CTFs independently</li>
          <li>have participated in CTFs and bug bounties in my city (reserved for students).</li>
          <li>administer the VPS for my school's CTF website with another student</li>
          <li>use <s>arch</s> mint, btw.</li>
        </ul>
      </div>

      {/* coding projects - mobile vertical layout */}
      <div className="mb-14">
        <h2 className="section-header mb-4">
          CODING PROJECTS
        </h2>

        {/* project cards - vertical layout */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {PROJECT_DATA.map((project) => (
            <div
              key={project.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                alignItems: 'center'
              }}
            >
              {/* project image */}
              <div
                style={{
                  width: '100%',
                  maxWidth: '280px',
                  aspectRatio: '1',
                  position: 'relative',
                  borderRadius: '0.75rem',
                  overflow: 'hidden',
                }}
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                  sizes="280px"
                />
              </div>

              {/* project info */}
              <div style={{ width: '100%' }}>
                {/* title */}
                <h3
                  style={{
                    fontSize: 'clamp(1.25rem, 5vw, 1.5rem)',
                    fontFamily: 'var(--font-body)',
                    fontWeight: 700,
                    color: '#5136f0',
                    marginBottom: '0.75rem',
                    textAlign: 'center'
                  }}
                >
                  {project.title}
                </h3>

                {/* paragraph 1 */}
                <p
                  className="text-dark-gray"
                  style={{
                    fontSize: 'clamp(0.875rem, 3.5vw, 1rem)',
                    lineHeight: '1.5',
                    fontFamily: 'var(--font-body)',
                    marginBottom: '0.5rem'
                  }}
                  dangerouslySetInnerHTML={{ __html: project.paragraph1 }}
                />

                {/* paragraph 2 */}
                <p
                  className="text-dark-gray"
                  style={{
                    fontSize: 'clamp(0.875rem, 3.5vw, 1rem)',
                    lineHeight: '1.5',
                    fontFamily: 'var(--font-body)'
                  }}
                  dangerouslySetInnerHTML={{ __html: project.paragraph2 }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* conclusion paragraph */}
        <p className="text-dark-gray" style={{ 
          fontSize: 'clamp(0.875rem, 3.5vw, 1rem)',
          lineHeight: '1.6',
          fontFamily: 'var(--font-body)',
          marginTop: '1.5rem'
        }}>
          you can see other projects i've done on my <a href='https://github.com/Claipousse' target='_blank'>github</a>, for now i'm only a beginner trying to get better :)
        </p>
      </div>
    </div>
  );
}