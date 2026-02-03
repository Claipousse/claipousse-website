'use client';

import { useState, useEffect } from 'react';

interface MobileSlideProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileSlide({ title, children, isOpen, onClose }: MobileSlideProps) {
  const [isClosing, setIsClosing] = useState(false);

  //handle close with animation
  const handleClose = () => {
    const closeSound = new Audio('/sfx/close.mp3');
    closeSound.volume = 0.4;
    closeSound.play();
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300); //300ms of animation
  };

  //play open sound when slide appears
  useEffect(() => {
    if (isOpen) {
      const openSound = new Audio('/sfx/open.mp3');
      openSound.volume = 0.4;
      openSound.play();
    }
  }, [isOpen]);

  if (!isOpen && !isClosing) return null;

  return (
    <>
      {/*dark overlay behind*/}
      <div 
        className="fixed inset-0 bg-black z-40"
        style={{
          opacity: isClosing ? 0 : 0.5,
          transition: 'opacity 0.3s ease-out',
          pointerEvents: 'none'
        }}
      />

      {/*slide container*/}
      <div
        className="fixed inset-x-0 bottom-0 z-50 bg-white flex flex-col"
        style={{
          maxHeight: 'calc(100vh - 5rem)',
          borderTopLeftRadius: '1rem',
          borderTopRightRadius: '1rem',
          transform: isClosing ? 'translateY(100%)' : 'translateY(0)',
          transition: 'transform 0.3s ease-out'
        }}
      >
        {/* fixed header */}
        <div className="bg-dark-gray flex items-center justify-between px-4 py-3 rounded-t-xl flex-shrink-0">
          <h2 
            className="text-white font-mono text-lg"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {title}
          </h2>
          
          {/* close button with double chevron */}
          <button
            onClick={handleClose}
            className="text-white text-2xl hover-scale-lg flex items-center justify-center"
            style={{ width: '32px', height: '32px' }}
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="3" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <polyline points="7 13 12 18 17 13"></polyline>
              <polyline points="7 6 12 11 17 6"></polyline>
            </svg>
          </button>
        </div>

        {/* scrollable content */}
        <div className="overflow-y-auto p-6 custom-scrollbar flex-1">
          {children}
        </div>
      </div>
    </>
  );
}