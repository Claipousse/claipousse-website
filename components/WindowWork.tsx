'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';

//struct for pc's info
interface PCData {
  id: number;
  image: string;
  name: string;
  components: string[];
  description: string;
}

//struct for coding projects
interface ProjectData {
  id: number;
  image: string;
  title: string;
  paragraph1: string;
  paragraph2: string;
}

//we write each infos for each pc, then i'll use it later
const PC_DATA: PCData[] = [
  {
    id: 1,
    image: '/images/other/pc1.webp',
    name: 'My pc :)',
    components: ['[Component 1]', '[Component 2]', '[Component 3]', '[Component 4]'],
    description: '[Description paragraph for PC 1]'
  },
  {
    id: 2,
    image: '/images/other/pc2.webp',
    name: 'Basic V1',
    components: ['[Component 1]', '[Component 2]', '[Component 3]', '[Component 4]'],
    description: '[Description paragraph for PC 2]'
  },
  {
    id: 3,
    image: '/images/other/pc3.webp',
    name: 'Snow White V1',
    components: ['[Component 1]', '[Component 2]', '[Component 3]', '[Component 4]'],
    description: '[Description paragraph for PC 3]'
  }
];

//coding projects data
const PROJECT_DATA: ProjectData[] = [
  {
    id: 1,
    image: '/images/projects/ledgerone.png',
    title: 'LedgerOne',
    paragraph1: "a manual expense manager web app, coded for a test to join my school's junior enterprise. i made it using vanilla frontend (html/css/js) and python for the backend, with fastAPI, sqlite, etc",
    paragraph2: "i don't host it online, you can test it locally via the github repository <a href='https://github.com/Claipousse/LedgerOne' target='_blank'>here</a>."
  },
  {
    id: 2,
    image: '/images/projects/kattack.png',
    title: 'Kattack',
    paragraph1: "a vampire survivor-like browser game made with kaplay game engine. the game is abandonware, unfinished, and ugly asf, but a fun break from my usual projects. you can play this shitty game on <a href='https://claipousse.itch.io/kattack' target='_blank'>itch.io</a>.",
    paragraph2: "i made the game with kaplay, which is a javascript game engine (pretty fun to use!!), you can check the github repository <a href='https://github.com/Claipousse/kattack' target='_blank'>here</a>."
  },
  {
    id: 3,
    image: '/images/projects/wsc.png',
    title: 'Windows Storage Cleaner',
    paragraph1: "a cli tool written in Rust that deletes temporary files and directories, a lot of browser caches, and other windows junk to free some space.",
    paragraph2: "you can download the .exe file <a href='https://github.com/Claipousse/Windows-System-Cleaner/releases/tag/v0.1.2' target='_blank'>here</a>, and check the <a href='https://github.com/Claipousse/Windows-System-Cleaner' target='_blank'>source code</a> if you think it's a nasty, mischievous virus :D"
  },
  {
    id: 4,
    image: '/images/projects/web.png',
    title: 'This Website',
    paragraph1: "i wanted to create a small website to add to my social media bios for something more personalized :) i also wanted to do it to learn how to use react and how to host a website.",
    paragraph2: "i explain in more detail about the stack i used in the faq, but again, i let the source code <a href='https://github.com/Claipousse/claipousse-website' target='_blank'>here</a>."
  }
];

export default function WindowWork() {
  const [selectedPC, setSelectedPC] = useState<PCData | null>(null);

  return (
    <div style={{ paddingLeft: '2rem' }}>
      {/* cybersecurity */}
      <div className="mb-12 mt-6">
        <h2
          className="font-bold mb-2"
          style={{
            fontSize: 'clamp(1.125rem, 2vw, 1.5rem)',
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.05em'
          }}
        >
          CYBERSECURITY
        </h2>
        <p
          className="text-dark-gray mb-3"
          style={{
            fontSize: 'clamp(1rem, 1.75vw, 1.25rem)',
            lineHeight: '1.4',
            fontFamily: 'var(--font-body)'
          }}
        >
          unfortunately, I won't be able to put much in it, mainly because I'm still learning about it. however i...
        </p>
        <ul
          className="text-dark-gray"
          style={{
            fontSize: 'clamp(1rem, 1.75vw, 1.25rem)',
            lineHeight: '1.4',
            fontFamily: 'var(--font-body)',
            listStyle: 'disc',
            paddingLeft: '1.5rem'
          }}
        >
          <li>am taking classes and practising on CTFs independently</li>
          <li>have participated in CTFs and bug bounties in my city (reserved for students).</li>
          <li>administer the VPS for my school's CTF website with another student</li>
          <li>use <s>arch</s> mint, btw.</li>
        </ul>
      </div>

      {/* coding projects */}
      <div className="mb-14">
        <h2
          className="font-bold mb-4"
          style={{
            fontSize: 'clamp(1.125rem, 2vw, 1.5rem)',
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.05em'
          }}
        >
          CODING PROJECTS
        </h2>

        {/* project cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
          {PROJECT_DATA.map((project) => (
            <div
              key={project.id}
              style={{
                display: 'flex',
                gap: 'clamp(1rem, 2vw, 1.5rem)',
                alignItems: 'flex-start'
              }}
            >
              {/* project image */}
              <div
                style={{
                  width: 'clamp(150px, 18vw, 220px)',
                  height: 'clamp(150px, 18vw, 220px)',
                  flexShrink: 0,
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
                  sizes="180px"
                />
              </div>

              {/* project info */}
              <div style={{ flex: 1 }}>
                {/* title */}
                <h3
                  style={{
                    fontSize: 'clamp(1.125rem, 2vw, 1.5rem)',
                    fontFamily: 'var(--font-body)',
                    fontWeight: 700,
                    color: '#5136f0',
                    marginBottom: 'clamp(0.5rem, 1vw, 0.75rem)'
                  }}
                >
                  {project.title}
                </h3>

                {/* paragraph 1 */}
                <p
                  className="text-dark-gray"
                  style={{
                    fontSize: 'clamp(0.9rem, 1.5vw, 1.125rem)',
                    lineHeight: '1.5',
                    fontFamily: 'var(--font-body)',
                    marginBottom: 'clamp(0.5rem, 1vw, 0.75rem)'
                  }}
                  dangerouslySetInnerHTML={{ __html: project.paragraph1 }}>
                </p>

                {/* paragraph 2 */}
                <p
                  className="text-dark-gray"
                  style={{
                    fontSize: 'clamp(0.9rem, 1.5vw, 1.125rem)',
                    lineHeight: '1.5',
                    fontFamily: 'var(--font-body)'
                  }}

                  dangerouslySetInnerHTML={{ __html: project.paragraph2 }}>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* services */}
      <div className="mb-6">
        <h2
          className="font-bold mb-2"
          style={{
            fontSize: 'clamp(1.125rem, 2vw, 1.5rem)',
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.05em'
          }}
        >
          SERVICES
        </h2>
        <p
          className="text-dark-gray mb-3"
          style={{
            fontSize: 'clamp(1rem, 1.75vw, 1.25rem)',
            lineHeight: '1.6',
            fontFamily: 'var(--font-body)'
          }}
        >
          [Services paragraph]
        </p>

        {/* pc photos grid */}
        <div
          className="grid grid-cols-3"
          style={{
            gap: 'clamp(0.75rem, 1.5vw, 1.5rem)',
            maxWidth: '100%'
          }}
        >
          {PC_DATA.map((pc) => (
            <div
              key={pc.id}
              className="cursor-pointer transition-transform hover:scale-105"
              onClick={() => setSelectedPC(pc)}
              style={{
                aspectRatio: '1/1',
                position: 'relative',
                borderRadius: '0.5rem',
                overflow: 'hidden',
                boxShadow: '0px 4px 0px rgba(0, 0, 0, 0.15)'
              }}
            >
              <Image
                src={pc.image}
                alt={pc.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          ))}
        </div>
      </div>

      {/* pc modal */}
      {selectedPC && typeof window !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 flex items-center justify-center"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            zIndex: 9999,
            animation: 'fadeIn 0.25s ease-out'
          }}
          onClick={() => setSelectedPC(null)}
        >
          <div
            style={{
              position: 'relative',
              width: '1200px',
              height: '900px'
            }}
          >
            <Image
              src={selectedPC.image}
              alt={selectedPC.name}
              fill
              className="object-contain"
              sizes="1200px"
            />
          </div>
        </div>,
        document.body
      )}

      <style jsx global>{`
        a {
          color: #5136f0;
          text-decoration: underline;
          font-weight: 700;
        }

        a:hover {
          opacity: 0.8;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

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
          border-radius: 10px;
        }

        div::-webkit-scrollbar-thumb:hover {
          background-color: #a4a4a4;
        }
      `}</style>
    </div>
  );
}