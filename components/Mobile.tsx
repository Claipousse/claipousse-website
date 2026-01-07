import Image from 'next/image';

export default function MobileView() {
    const icons = [
        { name: 'about', file: 'about.webp', label: 'about' },
        { name: 'links', file: 'links.webp', label: 'links' },
        { name: 'work', file: 'work.webp', label: 'work' },
        { name: 'faq', file: 'faq.webp', label: 'faq' },
        { name: 'contact', file: 'contact.webp', label: 'contact' }
    ];

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 pb-24 relative z-10">

            {/* top text centered with white outline */}
            <div className="text-center mb-8">
                <h1 className="font-body font-bold mb-3" style={{
                    fontSize: 'clamp(2.25rem, 11vw, 4rem)',
                    WebkitTextStroke: '2px #0a0023',
                    color: '#FFFFFF',
                    fontFamily: 'var(--font-title)'
                }}>
                    hi! <span style={{ 
                        color: '#5136f0',
                        WebkitTextStroke: '4px white',
                        paintOrder: 'stroke fill'
                    }}>i'm claipousse</span>
                </h1>
                <p className="font-body" style={{
                    fontSize: 'clamp(1.25rem, 5vw, 1.75rem)',
                    WebkitTextStroke: '3px #0a0023',
                    paintOrder: 'stroke fill',
                    color: '#FFFFFF',
                    fontFamily: 'var(--font-body)'
                }}>
                    student in cybersecurity, cat enjoyer
                </p>
            </div>

            {/* icons grid - 2x3 by default in most case, 1x5 if you see the website on a fucking spaghetti */}
            <div className="w-full flex items-center justify-center px-4">

                {/*2x3 grid (≥200px)*/}
                <div className="hidden min-[200px]:grid grid-cols-2 gap-4 max-w-md mx-auto">
                    {icons.slice(0, 4).map((icon) => (
                        <div key={icon.name} className="flex flex-col items-center gap-2 cursor-pointer transition-flat hover:scale-105">
                            <div className="flex items-center justify-center rounded-lg" style={{
                                backgroundColor: '#7e62ff',
                                border: '3px solid white',
                                width: 'clamp(4rem, 20vw, 7rem)',
                                height: 'clamp(4rem, 20vw, 7rem)',
                                padding: 'clamp(0.5rem, 2vw, 1rem)'
                            }}>
                                <Image src={`/images/icons/${icon.file}`} alt={icon.name} width={80} height={80} className="object-contain w-full h-full" draggable={false} style={{ filter: 'drop-shadow(0px 6px 0px rgba(0, 0, 0, 0.25))' }} />
                            </div>
                            <span className="font-bold text-white" style={{ fontSize: 'clamp(0.85rem, 3vw, 1rem)', WebkitTextStroke: '3px #0a0023', paintOrder: 'stroke fill', fontFamily: 'var(--font-mono)'}}>{icon.label}</span>
                        </div>
                    ))}
                    {/*contact icon alone like a little chud in order to be in the center*/}
                    <div className="col-span-2 flex justify-center">
                        <div className="flex flex-col items-center gap-2 cursor-pointer transition-flat hover:scale-105">
                            <div className="flex items-center justify-center rounded-lg" style={{
                                backgroundColor: '#7e62ff',
                                border: '3px solid white',
                                width: 'clamp(4rem, 20vw, 7rem)',
                                height: 'clamp(4rem, 20vw, 7rem)',
                                padding: 'clamp(0.5rem, 2vw, 1rem)'
                            }}>
                                <Image src={`/images/icons/${icons[4].file}`} alt={icons[4].name} width={80} height={80} className="object-contain w-full h-full" draggable={false} style={{ filter: 'drop-shadow(0px 6px 0px rgba(0, 0, 0, 0.25))' }}/>
                            </div>
                            <span className="font-bold text-white" style={{ fontSize: 'clamp(0.85rem, 3vw, 1rem)', WebkitTextStroke: '3px #0a0023', paintOrder: 'stroke fill', fontFamily: 'var(--font-mono)'}}>{icons[4].label}</span>
                        </div>
                    </div>
                </div>

                {/*1x5 grid (<200px, spaghetti config)*/}
                <div className="grid min-[200px]:hidden grid-cols-1 gap-4 max-w-xs mx-auto">
                    {icons.map((icon) => (
                        <div key={icon.name} className="flex flex-col items-center gap-2 cursor-pointer transition-flat hover:scale-105">
                            <div className="flex items-center justify-center rounded-lg" style={{
                                backgroundColor: '#7e62ff',
                                border: '3px solid white',
                                width: 'clamp(4rem, 30vw, 6rem)',
                                height: 'clamp(4rem, 30vw, 6rem)',
                                padding: 'clamp(0.5rem, 2vw, 1rem)'
                            }}>
                                <Image src={`/images/icons/${icon.file}`} alt={icon.name} width={80} height={80} className="object-contain w-full h-full" draggable={false} style={{ filter: 'drop-shadow(0px 4px 0px rgba(0, 0, 0, 0.25))' }} />
                            </div>
                            <span className="font-bold text-white" style={{ fontSize: 'clamp(0.85rem, 4vw, 1rem)', WebkitTextStroke: '3px #0a0023', paintOrder: 'stroke fill', fontFamily: 'var(--font-mono)'}}>{icon.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}