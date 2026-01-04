'use client';

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image';

export default function MusicCat() {
    const [isMuted, setIsMuted] = useState(true); //off by default
    const musicRef = useRef<HTMLAudioElement | null>(null);
    const isInitialized = useRef(false); //to prevent double initialisation

    useEffect(() => {

        //if already created -> we gtfo
        if (isInitialized.current) return;

        // create audio + properties only if it doesnt exist
        if (!musicRef.current) {
            musicRef.current = new Audio('/sfx/music.mp3'); //link to file .mp3
            musicRef.current.loop = true; // infinite loop
            musicRef.current.volume = 0; // default volume

            isInitialized.current = true; //once done we set on true to not do it again
        }

        return () => {
            // cleanup doesnt pause nor set on null
        };
    }, []);

    const handleClick = () => {
        if (!musicRef.current) return;

        //play stop sound when you click on the best singer cat ever
        const stopSound = new Audio('/sfx/stop_music.mp3');
        stopSound.play();

        //toggle behaviour (when you click on cat)
        if (isMuted) { //if it was muted, demute
            //start music if not already playing
            if (musicRef.current.paused) {
                musicRef.current.play();
            }
            musicRef.current.volume = 0.3; //set volume
            setIsMuted(false);
        }
        else { //if it was ON, turn OFF
            musicRef.current.volume = 0; //mute but keep playing in background
            setIsMuted(true);
        }
    };

    return (
        <div className="fixed bottom-8 right-8 z-50 cursor-pointer" onClick={handleClick} style={{width: 'clamp(4rem, 10vw, 7.5rem)', height: 'clamp(4rem, 10vw, 7.5rem)'}}>
            <Image src={`/images/interactive/${isMuted ? 'music-off.webp' : 'music-on.webp'}`} alt="michael catson" width={120} height={120} className="object-contain hover:scale-110 transition-transform w-full h-full" draggable={false} unoptimized={true}/>
        </div>
    );
}