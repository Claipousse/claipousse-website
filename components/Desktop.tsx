'use client';

import { useState } from 'react';
import Image from 'next/image';
import Window from './Window';
import WindowAbout from './WindowAbout';
import WindowLinks from './WindowLinks';
import WindowWork from './WindowWork';
import WindowFaq from './WindowFaq';
import WindowContact from './WindowContact';

//spawn points inside main frame area
const SPAWN_POINTS = {
    about: { x: 0, y: 0 },
    links: { x: 0, y: 0 },
    work: { x: 0, y: 0 },
    faq: { x: 0, y: 0 },
    contact: { x: 0, y: 0 }
};

type WindowType = 'about' | 'links' | 'work' | 'faq' | 'contact';

interface WindowState {
    type: WindowType;
    position: { x: number; y: number };
    zIndex: number;
}

export default function DesktopView() {
    const icons = [
        { name: 'about', file: 'about.webp', label: 'about' },
        { name: 'links', file: 'links.webp', label: 'links' },
        { name: 'work', file: 'work.webp', label: 'work' },
        { name: 'faq', file: 'faq.webp', label: 'faq' },
        { name: 'contact', file: 'contact.webp', label: 'contact' }
    ];

    const [openWindows, setOpenWindows] = useState<WindowState[]>([]);
    const [highestZIndex, setHighestZIndex] = useState(100);

    //open window (or bring to front if already open)
    const handleIconClick = (type: WindowType) => {
        const existingWindow = openWindows.find(w => w.type === type);

        if (existingWindow) {
            //window already open, bring to front
            handleWindowFocus(type);
        } else {
            //play open sound
            const openSound = new Audio('/sfx/open.mp3');
            openSound.volume = 0.5;
            openSound.play();
            
            //open new window
            const spawnPoint = SPAWN_POINTS[type];
            setOpenWindows([...openWindows, {
                type,
                position: { ...spawnPoint },
                zIndex: highestZIndex + 1
            }]);
            setHighestZIndex(highestZIndex + 1);
        }
    };

    //close window
    const handleWindowClose = (type: WindowType) => {
        setOpenWindows(openWindows.filter(w => w.type !== type));
    };

    //update window position
    const handlePositionChange = (type: WindowType, x: number, y: number) => {
        setOpenWindows(openWindows.map(w =>
            w.type === type ? { ...w, position: { x, y } } : w
        ));
    };

    //bring window to front
    const handleWindowFocus = (type: WindowType) => {
        const newZIndex = highestZIndex + 1;
        setOpenWindows(openWindows.map(w =>
            w.type === type ? { ...w, zIndex: newZIndex } : w
        ));
        setHighestZIndex(newZIndex);
    };

    //get window content component
    const getWindowContent = (type: WindowType) => {
        switch (type) {
            case 'about': return <WindowAbout />;
            case 'links': return <WindowLinks />;
            case 'work': return <WindowWork />;
            case 'faq': return <WindowFaq />;
            case 'contact': return <WindowContact />;
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-8">
            {/* main frame with fluid sizing */}
            <div
                className="w-full bg-white border-2 border-gray-light rounded-2xl transition-flat relative z-10"
                style={{
                    boxShadow: '0px 5px 0px rgba(0, 0, 0, 0.15)',
                    maxWidth: 'clamp(550px, 55vw, 850px)',
                    padding: 'clamp(2rem, 4vw, 4rem) clamp(2rem, 3vw, 3rem)'
                }}
            >
                {/* grey bar at top */}
                <div
                    className="bg-dark-gray rounded-t-xl border-gray-light absolute top-0 left-0 right-0"
                    style={{ height: 'clamp(2.5rem, 3.5vw, 3.5rem)' }}
                ></div>

                <div className="flex flex-col items-center" style={{ gap: 'clamp(2rem, 3vw, 3rem)', marginTop: 'clamp(3rem, 4vw, 4rem)' }}>

                    {/* centered text responsive */}
                    <div className="text-center">
                        <h1
                            className="font-body font-bold mb-3"
                            style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}
                        >
                            hi! <span className="text-accent font-bold">i'm claipousse</span>
                        </h1>
                        <p
                            className="text-dark-gray font-body"
                            style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.875rem)' }}
                        >
                            student in cybersecurity, cat enjoyer
                        </p>
                    </div>

                    {/* icons with fluid sizing */}
                    <div className="flex" style={{ gap: 'clamp(1rem, 1.5vw, 1.5rem)', marginTop: 'clamp(1rem, 2vw, 2rem)' }}>
                        {icons.map((icon) => (
                            <div
                                key={icon.name}
                                className='flex flex-col items-center cursor-pointer transition-flat hover:scale-105'
                                style={{ gap: 'clamp(0.25rem, 0.5vw, 0.5rem)' }}
                                onClick={() => handleIconClick(icon.name as WindowType)}
                            >
                                <div
                                    className="flex items-center justify-center"
                                    style={{
                                        width: 'clamp(4.5rem, 5.5vw, 6.5rem)',
                                        height: 'clamp(4.5rem, 5.5vw, 6.5rem)'
                                    }}
                                >
                                    <Image
                                        src={`/images/icons/${icon.file}`}
                                        alt={icon.name}
                                        width={100}
                                        height={100}
                                        className="object-contain w-full h-full"
                                        draggable={false}
                                        style={{ filter: 'drop-shadow(0px 8px 0px rgba(0, 0, 0, 0.25))' }}
                                    />
                                </div>
                                <span
                                    className="font-mono font-bold text-dark-gray"
                                    style={{ fontSize: 'clamp(0.875rem, 1.2vw, 1.125rem)' }}
                                >
                                    {icon.label}
                                </span>
                            </div>
                        ))}
                    </div>

                </div>
            </div>

            {/* copyright at bottom - centered */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
                <p className="text-white font-mono text-sm">© 2025 claipousse</p>
            </div>

            {/* render open windows */}
            {openWindows.map((window) => (
                <Window
                    key={window.type}
                    title={window.type}
                    initialX={window.position.x}
                    initialY={window.position.y}
                    onClose={() => handleWindowClose(window.type)}
                    onPositionChange={(x, y) => handlePositionChange(window.type, x, y)}
                    onFocus={() => handleWindowFocus(window.type)}
                    zIndex={window.zIndex}
                >
                    {getWindowContent(window.type)}
                </Window>
            ))}
        </div>
    );
}