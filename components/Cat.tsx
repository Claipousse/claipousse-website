'use client';

import {useState} from 'react';
import Image from 'next/image';

export default function Cat() {
    const [isBouncing, setIsBouncing] = useState(false);

    const handleClick = () => {
        //play meow at each click
        const meow = new Audio('/sfx/meow.mp3')
        meow.play();
    };

return (
    <div className={`fixed bottom-8 left-8 z-50 cursor-pointer transition-transform ${isBouncing ? 'animate-bounce-once' : ''}`} onClick={handleClick}>
       <Image src="/images/interactive/cat.webp" alt="super cute cat :)" width={120} height={120} className="object-contain hover:scale-110 transition-transform"/>
    </div>
  ); 
}