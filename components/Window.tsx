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
}

export default function Window({ title, children, onClose, initialX, initialY, onPositionChange, onFocus, zIndex }: WindowProps) {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [isClosing, setIsClosing] = useState(false);
  const nodeRef = useRef<HTMLDivElement>(null);

  //handle drag
  const handleDrag = (e: any, data: any) => {
    setPosition({ x: data.x, y: data.y });
    onPositionChange(data.x, data.y);
  };

  //handle close with animation
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 250);
  };

  //focus window on click anywhere
  const handleWindowClick = () => {
    onFocus();
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".drag-handle"
      position={position}
      onDrag={handleDrag}
      bounds="parent"
      onMouseDown={onFocus}
    >
      <div
        ref={nodeRef}
        className={`fixed bg-white border-2 border-gray-light rounded-2xl transition-flat ${isClosing ? 'window-close' : 'window-open'}`}
        style={{
          zIndex: zIndex,
          boxShadow: '0px 5px 0px rgba(0, 0, 0, 0.15)',
          maxWidth: '90vw',
          maxHeight: '85vh',
          minWidth: '400px'
        }}
        onClick={handleWindowClick}
      >
        {/* grey draggable header */}
        <div
          className="drag-handle bg-dark-gray rounded-t-xl h-14 flex items-center justify-between px-4 cursor-move select-none"
        >
          <span className="text-white font-mono font-bold text-sm">{title}</span>
          <button
            className="text-white hover:text-gray-light transition-colors font-mono text-sm"
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
          >
            [x]
          </button>
        </div>

        {/* content with scroll */}
        <div className="overflow-y-auto p-6" style={{ maxHeight: 'calc(85vh - 56px)' }}>
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
            animation: windowClose 0.25s ease-in;
            transform-origin: center;
          }
        `}</style>
      </div>
    </Draggable>
  );
}