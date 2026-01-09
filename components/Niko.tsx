'use client';
import Image from 'next/image';

export default function Niko() {
    const handleClick = () => {
        //play meow at each click
        const meow = new Audio('/sfx/niko.mp3')
        meow.play();
    };

    return (
        <div className="fixed bottom-8 left-8 z-50 cursor-pointer" onClick={handleClick} style={{width: 'clamp(4rem, 10vw, 7.5rem)', height: 'clamp(4rem, 10vw, 7.5rem)'}}>
            <Image src="/images/interactive/niko.webp" alt="super cute niko :)" width={120} height={120} className="object-contain hover:scale-110 transition-transform w-full h-full" draggable={false} />
        </div>
    );
}