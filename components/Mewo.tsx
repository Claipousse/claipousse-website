'use client';
import Image from 'next/image';

export default function Mewo() {
    const handleClick = () => {
        //play meow at each click
        const meow = new Audio('/sfx/mewo.mp3')
        meow.play();
    };

     return (
        <div 
            className="cursor-pointer hover:scale-110 transition-transform" 
            onClick={handleClick}
            style={{
                width: 'clamp(2rem, 3vw, 3rem)',
                height: 'clamp(2rem, 3vw, 3rem)'
            }}
        >
            <Image 
                src="/images/interactive/mewo.webp" 
                alt="mewo the cat :3" 
                width={48} 
                height={48} 
                className="object-contain w-full h-full" 
                draggable={false}
                unoptimized={true}
            />
        </div>
    );
}