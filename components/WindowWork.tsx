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

//we write each infos for each pc, then i'll use it later
const PC_DATA: PCData[] = [
  {
    id: 1, //first one
    image: '/images/other/pc1.webp',
    name: 'My pc :)',
    components: ['[Component 1]', '[Component 2]', '[Component 3]', '[Component 4]'],
    description: '[Description paragraph for PC 1]'
  },
  {
    id: 2, //second one
    image: '/images/other/pc2.webp',
    name: 'Basic V1',
    components: ['[Component 1]', '[Component 2]', '[Component 3]', '[Component 4]'],
    description: '[Description paragraph for PC 2]'
  },
  {
    id: 3, //third one
    image: '/images/other/pc3.webp',
    name: 'Snow White V1',
    components: ['[Component 1]', '[Component 2]', '[Component 3]', '[Component 4]'],
    description: '[Description paragraph for PC 3]'
  }
];

export default function WindowWork() {
  //for the modal, to know what info to show
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
          className="font-bold mb-2"
          style={{
            fontSize: 'clamp(1.125rem, 2vw, 1.5rem)',
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.05em'
          }}
        >
          CODING PROJECTS
        </h2>
        <p
          className="text-dark-gray"
          style={{
            fontSize: 'clamp(1rem, 1.75vw, 1.25rem)',
            lineHeight: '1.4',
            fontFamily: 'var(--font-body)'
          }}
        >
          many projects i've done have been to learn new programming languages, but there are some that were made to solve real issues such as...
        </p>
        <ul
          className="text-dark-gray mb-6"
          style={{
            fontSize: 'clamp(1rem, 1.75vw, 1.25rem)',
            lineHeight: '1.4',
            fontFamily: 'var(--font-body)',
            listStyle: 'disc',
            paddingLeft: '1.5rem'
          }}
        >
          <li>an expense manager web app, coded for a test to join my school's junior enterprise. made using vanilla js and python with fastAPI</li>
          <li>a vampire survivor-like browser game made with kaplay. the game is abandonware, unfinished, and ugly asf, but a fun break from my usual projects. you can play this shitty game here.</li>
          <li>a cli tool written in Rust that deletes temporary files and directories, browser caches, and other windows junk to free some space.</li>
          <li>this website ! made it with react and next.js, more informations about the assets i used in the faq.</li>
        </ul>
        <p
          className="text-dark-gray"
          style={{
            fontSize: 'clamp(1rem, 1.75vw, 1.25rem)',
            lineHeight: '1.6',
            fontFamily: 'var(--font-body)'
          }}
        >
          for more information and more projects, you can check out my github if you want.
        </p>
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

      <style jsx>{`
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