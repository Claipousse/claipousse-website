'use client';

import { useEffect } from 'react';

export function useExternalLinkClick() {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      if (link) {
        const clickSound = new Audio('/sfx/click.mp3');
        clickSound.volume = 1;
        clickSound.play();
      }
    };
    document.addEventListener('click', handleClick);
    return () => {document.removeEventListener('click', handleClick)};
  }, []);
}