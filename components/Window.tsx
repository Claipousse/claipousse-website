'use client';

import { useState, useRef } from 'react';
import Draggable from 'react-draggable';

interface WindowProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  initialX: number;
  initialY: number;
  onPositionChange: (x: number, y: number) => void;
  onFocus: () => void;
  zIndex: number;
  customMaxWidth?: string;
  customMinWidth?: string;
  customMaxHeight?: string;
}

export default function Window({ 
  title, 
  children, 
  onClose, 
  initialX, 
  initialY, 
  onPositionChange, 
  onFocus, 
  zIndex,
  customMaxWidth,
  customMinWidth,
  customMaxHeight
}: WindowProps) {
  const [isClosing, setIsClosing] = useState(false);
  const nodeRef = useRef<HTMLDivElement>(null);

  const maxWidth = customMaxWidth || 'clamp(550px, 55vw, 850px)';
  const minWidth = customMinWidth || '550px';
  const maxHeight = customMaxHeight || '85vh';

  //handle close with animation
  const handleClose = () => {
    const closeSound = new Audio('/sfx/close.mp3');
    closeSound.volume = 0.5;
    closeSound.play();
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 250);
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".drag-handle"
      defaultPosition={{ x: initialX, y: initialY }}
      onStart={onFocus}
      bounds="parent"
    >
      <div ref={nodeRef} className="absolute" style={{ zIndex: zIndex }} onClick={onFocus}>
        {/*animation wrapper*/}
        <div className={`bg-white border-2 border-gray-light rounded-2xl ${isClosing ? 'window-close' : 'window-open'}`}
          style={{
            boxShadow: '0px 5px 0px rgba(0, 0, 0, 0.15)',
            maxWidth: maxWidth,
            maxHeight: maxHeight,
            minWidth: minWidth,
            overflow:'hidden'
          }}
        >
          {/* grey draggable header */}
          <div className="drag-handle bg-dark-gray rounded-t-xl h-14 flex items-center justify-between px-4 cursor-move select-none">
            <span className="text-white font-mono text-lg" style={{ fontFamily: 'var(--font-mono)' }}>{title}</span>
            <button
              className="text-white font-mono text-lg transition-transform hover:scale-110"
              onClick={(e) => {
                e.stopPropagation();
                handleClose();
              }}
            >
              [x]
            </button>
          </div>

          {/* content with scroll */}
          <div className="overflow-y-auto p-6" style={{ maxHeight: `calc(${maxHeight} - 56px)`}}>
            {children}
          </div>

          <style jsx>{`
            @keyframes windowOpen {
              from {
                transform: scale(0);
                opacity: 0;
              }
              to {
                transform: scale(1);
                opacity: 1;
              }
            }

            @keyframes windowClose {
              from {
                transform: scale(1);
                opacity: 1;
              }
              to {
                transform: scale(0);
                opacity: 0;
              }
            }

            .window-open {
              animation: windowOpen 0.25s ease-out;
              transform-origin: center;
            }

            .window-close {
              animation: windowClose 0.25s ease-in forwards;
              transform-origin: center;
            }
          `}</style>
        </div>
      </div>
    </Draggable>
  );
}