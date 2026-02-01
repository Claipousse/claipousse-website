'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Mewo from './Mewo';
import Window from './Window';
import WindowAbout from './WindowAbout';
import WindowLinks from './WindowLinks';
import WindowWork from './WindowWork';
import WindowFaq from './WindowFaq';

//spawn points (x:0, y:0 = center of the page), these are %, not px, the conversion is made with convertSpawnPointsToPixels()
const SPAWN_POINTS = {
    about: { x: -15, y: 5 },
    links: { x: -10, y: -10 },
    work: { x: 5, y: 3 },
    faq: { x: 10, y: 10 }
};

//window sizes
const WINDOW_SIZES = {
    about: {
        maxWidth: 'clamp(500px, 55vw, 750px)',
        minWidth: '500px',
        maxHeight: 'clamp(400px, 45vw, 600px)'
    },
    links: {
        maxWidth: 'clamp(375px, 35vw, 550px)',
        minWidth: '350px',
        maxHeight: '65vh'
    },
    work: {
        maxWidth: 'clamp(650px, 60vw, 850px)',
        minWidth: '650px',
        maxHeight: 'clamp(400px, 45vw, 600px)'
    },
    faq: {
        maxWidth: 'clamp(550px, 55vw, 700px)',
        minWidth: '550px',
        maxHeight: '43vh'
    }
};

type WindowType = 'about' | 'links' | 'work' | 'faq'; //name of each windows

interface WindowState {
    type: WindowType;
    position: { x: number; y: number };
    zIndex: number; //stack
}

export default function DesktopView() {
    const icons = [ //icons on the main frame
        { name: 'about', file: 'about.webp', label: 'about' },
        { name: 'links', file: 'links.webp', label: 'links' },
        { name: 'work', file: 'work.webp', label: 'work' },
        { name: 'faq', file: 'faq.webp', label: 'faq' }
    ];

    const [openWindows, setOpenWindows] = useState<WindowState[]>([]); //open windows (in a array)
    const [highestZIndex, setHighestZIndex] = useState(100);

    //need to comment this
    const [windowPositions, setWindowPositions] = useState<Record<WindowType, { x: number; y: number }>>(() => {
        if (typeof window === 'undefined') return {} as any;
        return convertSpawnPointsToPixels();
    });

    // convert percentage spawn points to pixel coordinates
    function convertSpawnPointsToPixels(): Record<WindowType, { x: number; y: number }> {
        const vw = window.innerWidth; //width of the browser
        const vh = window.innerHeight; //height of the browser
        
        const positions: Record<WindowType, { x: number; y: number }> = {} as any; //empty object, will store the converted coordinates
        
        Object.entries(SPAWN_POINTS).forEach(([type, point]) => { //object.entries convert object into array key/value
            positions[type as WindowType] = {
                //divided by 100 because it was a %, multiplied by the width/height of the viewport/browser
                x: (point.x / 100) * vw,
                y: (point.y / 100) * vh
            };
        });
        return positions;
    }

    // after f5 or any refresh, we clear localstorage (used to store the position of the windows after closing them)
    useEffect(() => {
        Object.keys(SPAWN_POINTS).forEach(type => {
            localStorage.removeItem(`window-${type}-position`);
        });
    }, []);

    // recalculate spawn points on window resize
    useEffect(() => {
    const movedWindows = new Set<WindowType>();
    const handleResize = () => {
        if (movedWindows.size === 0) { //if localstorage never checked
            Object.keys(SPAWN_POINTS).forEach(type => {
                if (localStorage.getItem(`window-${type as WindowType}-position`)) {
                    movedWindows.add(type as WindowType); //add the window in the set (4 in total)
                }
            });
        }
        const newDefaults = convertSpawnPointsToPixels();//convert % into px
        setWindowPositions(prev => {
            const updated = { ...prev };
            Object.keys(newDefaults).forEach(type => {
                const key = type as WindowType;
                if (!movedWindows.has(key)) {
                    updated[key] = newDefaults[key];
                }
            });
            return updated;
        });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
}, []);

    // open window (or bring to front if already open)
    const handleIconClick = useCallback((type: WindowType) => {
        const existingWindow = openWindows.find(w => w.type === type); //check if window already open
        if (existingWindow) { //if so, we just bring it to the front
            handleWindowFocus(type);
        } else { //if not, we open it, with an open sound
            const openSound = new Audio('/sfx/open.mp3');
            openSound.volume = 0.5;
            openSound.play();
            // check in localstorage if window has been moved during this session
            const savedPosition = localStorage.getItem(`window-${type}-position`);
            const position = savedPosition 
                ? JSON.parse(savedPosition)
                : windowPositions[type];

            setOpenWindows([...openWindows, {
                type,
                position: { ...position },
                zIndex: highestZIndex + 1
            }]);
            setHighestZIndex(highestZIndex + 1);
        }
    }, [openWindows, highestZIndex, windowPositions]);

    // close window
    const handleWindowClose = useCallback((type: WindowType) => {
        setOpenWindows(openWindows.filter(w => w.type !== type));
    }, [openWindows]);

    // update window position in localstorage (cleared on f5)
    const handlePositionChange = useCallback((type: WindowType, x: number, y: number) => {
        const newPosition = { x, y };
        localStorage.setItem(`window-${type}-position`, JSON.stringify(newPosition));
        
        // update state for current session
        setWindowPositions(prev => ({
            ...prev,
            [type]: newPosition
        }));
        
        // update openWindows
        setOpenWindows(windows =>
            windows.map(w =>
                w.type === type ? { ...w, position: newPosition } : w
            )
        );
    }, []);

    // Bring window to front
    const handleWindowFocus = useCallback((type: WindowType) => {
        const newZIndex = highestZIndex + 1;
        setOpenWindows(windows =>
            windows.map(w =>
                w.type === type ? { ...w, zIndex: newZIndex } : w
            )
        );
        setHighestZIndex(newZIndex);
    }, [highestZIndex, openWindows]);

    // Get window content component
    const getWindowContent = (type: WindowType) => {
        switch (type) {
            case 'about': return <WindowAbout />;
            case 'links': return <WindowLinks />;
            case 'work': return <WindowWork />;
            case 'faq': return <WindowFaq />;
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            {/* main frame with fluid sizing */}
            <div
                className="w-full bg-white border-2 border-gray-light rounded-2xl transition-flat relative z-10"
                style={{boxShadow: '0px 5px 0px rgba(0, 0, 0, 0.15)',maxWidth: 'clamp(500px, 50vw, 750px)',padding: 'clamp(2rem, 4vw, 4rem) clamp(2rem, 3vw, 4rem)'}}>
                {/* grey bar at top */}
                <div
                    className="bg-dark-gray rounded-t-xl border-gray-light absolute top-0 left-0 right-0 flex items-center justify-end pr-4"
                    style={{ height: 'clamp(2.5rem, 3.5vw, 3.5rem)' }}
                >
                    <Mewo />
                </div>

                <div className="flex flex-col items-center" style={{ gap: 'clamp(2rem, 3vw, 3rem)', marginTop: 'clamp(3rem, 5vw, 5rem)' }}>

                    {/* centered text responsive */}
                    <div className="text-center">
                        <h1 className="text-title font-bold mb-3">
                            hi! <span className="text-accent font-bold">i'm claipousse</span>
                        </h1>
                        <p className="text-subtitle text-dark-gray">
                            student in cybersecurity, cat enjoyer
                        </p>
                    </div>

                    {/* icons with fluid sizing */}
                    <div className="flex" style={{ gap: 'clamp(1rem, 2vw, 3rem)', marginTop: 'clamp(1rem, 2vw, 1rem)' }}>
                        {icons.map((icon) => (
                            <div
                                key={icon.name}
                                className='flex flex-col items-center cursor-pointer hover-scale'
                                style={{ gap: 'clamp(0.25rem, 0.5vw, 0.5rem)' }}
                                onClick={() => handleIconClick(icon.name as WindowType)}
                            >
                                <div
                                    className="flex items-center justify-center"
                                    style={{width: 'clamp(4.5rem, 5.5vw, 6.5rem)',height: 'clamp(4.5rem, 5.5vw, 6.5rem)'}}>
                                    <Image
                                        src={`/images/icons/${icon.file}`}
                                        alt={icon.name}
                                        width={100} height={100}
                                        className="object-contain w-full h-full drop-shadow-icon"
                                        draggable={false}
                                    />
                                </div>
                                <span className="text-mono-md text-dark-gray">
                                    {icon.label}
                                </span>
                            </div>
                        ))}
                    </div>

                </div>
            </div>

            {/* copyright at bottom - centered */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
                <p className="text-white font-mono text-sm">© 2026 claipousse</p>
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
                    customMaxWidth={WINDOW_SIZES[window.type].maxWidth}
                    customMinWidth={WINDOW_SIZES[window.type].minWidth}
                    customMaxHeight={WINDOW_SIZES[window.type].maxHeight}
                >
                    {getWindowContent(window.type)}
                </Window>
            ))}
        </div>
    );
}