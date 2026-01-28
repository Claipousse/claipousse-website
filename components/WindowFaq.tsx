'use client';

import { useState } from 'react';

interface FAQItem {
  id: number;
  question: string;
  points: string[];
}

const FAQ_DATA: FAQItem[] = [
  {
    id: 1,
    question: "what ressources & inspirations did you use for this website ?",
    points: [
      "icons are from icons8.com",
      "sfx are either from zapslat.com or oneshot's sfx",
      "the background and mewo (the black cat) are from omori",
      "toro inoue (the silly cat who plays music) is from meltgui",
      "niko (the cat on the bottom left) is from a pinterest post"
    ]
  },
  {
    id: 2,
    question: "what langages did you use to this website ?",
    points: [
      "i used react, next.js and tailwind to make this website",
      "to make the windows movable, i used the react-draggable library."
    ]
  },
  {
    id: 3,
    question: "do you want to play together ?",
    points: [
      "sure!! send me a message on steam or discord if you want :)"
    ]
  },
  {
    id: 4,
    question: "can you build me a pc and ship it to me ?",
    points: [
      "the only thing i do is assemble the pc at the customer's place. i don't order the components myself and don't ship it neither.",
      "i help the customer choose components based on their budget, performance goals, and aesthetic preferences, then I let them order the parts and come to assemble their PC, install the OS of their choice, perform updates, etc.",
      "as a student, I can't afford to make deliveries because I'm exposed to all the complications related to warranties and customer cancellations. (+ I would have to declare my income, which would piss me off)."
    ]
  },
  {
    id: 5,
    question: "do you take commissions for coding projects ?",
    points: [
      "yup! as long as these projects are related to programming languages i'm familiar with :)"
    ]
  }
];

export default function WindowFaq() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (id: number) => {
    //play sound
    const sound = new Audio('/sfx/faq.mp3');
    sound.volume = 0.5;
    sound.play();

    //toggle open/close
    if (openItems.includes(id)) {
      setOpenItems(openItems.filter(item => item !== id));
    } else {
      setOpenItems([...openItems, id]);
    }
  };

  return (
    <div>
      {/* faq list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {FAQ_DATA.map((item) => (
          <div key={item.id}>
            {/* question bar */}
            <div
              onClick={() => toggleItem(item.id)}
              style={{
                backgroundColor: '#e2d3ff',
                padding: '0.75rem 1.25rem',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'all 0.2s ease',
                borderRadius: '4px',
                position: 'relative',
                zIndex: 2
              }}
            >
              <span
                style={{
                  fontSize: 'clamp(0.75rem, 1.2vw, 0.875rem)',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  color: '#424242'
                }}
              >
                {item.question}
              </span>
              <span
                style={{
                  fontSize: '1.25rem',
                  color: '#424242',
                  transition: 'transform 0.3s ease',
                  transform: openItems.includes(item.id) ? 'rotate(180deg)' : 'rotate(0deg)'
                }}
              >
                ^
              </span>
            </div>

            {/* answer content*/}
            <div
              style={{
                maxHeight: openItems.includes(item.id) ? '500px' : '0',
                overflow: 'hidden',
                transition: 'max-height 0.15s linear, padding 0.15s linear, border-width 0.15s linear',
                backgroundColor: '#ffffff',
                padding: openItems.includes(item.id) ? '1rem 1.25rem' : '0 1.25rem',
                borderRadius: '6px',
                marginTop: '-7px',
                borderWidth: openItems.includes(item.id) ? '2px' : '0px',
                borderStyle: 'solid',
                borderColor: '#e2d3ff',
                position: 'relative',
                zIndex: 1,
                boxSizing: 'border-box'
              }}
            >
              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem'
                }}
              >
                {item.points.map((point, idx) => (
                  <li
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem'
                    }}
                  >
                    {/* round bullet */}
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        backgroundColor: '#424242',
                        borderRadius: '50%',
                        marginTop: '0.45rem',
                        flexShrink: 0
                      }}
                    />
                    <span
                      style={{
                        fontSize: 'clamp(0.7rem, 1vw, 0.8rem)',
                        lineHeight: '1.5',
                        fontFamily: 'var(--font-mono)',
                        color: '#424242',
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word'
                      }}
                    >
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
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