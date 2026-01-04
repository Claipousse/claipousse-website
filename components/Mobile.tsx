import Image from 'next/image';

export default function Mobile() {
    const icons = [
        { name: 'about', file: 'about.webp', label: 'about' },
        { name: 'links', file: 'links.webp', label: 'links' },
        { name: 'work', file: 'work.webp', label: 'work' },
        { name: 'faq', file: 'faq.webp', label: 'faq' },
        { name: 'contact', file: 'contact.webp', label: 'contact' }
    ];

    return (
        <div className="min-h-screen flex flex-col items-center justify-between p-4 relative z-10">

            {/* top text centered with white outline */}
            <div className="text-center mt-8 mb-8">
                <h1 className="font-body font-bold mb-2" style={{
                    fontSize: 'clamp(2rem, 10vw, 3.5rem)',
                    WebkitTextStroke: '2px white',
                    paintOrder: 'stroke fill'
                }}>
                    hi! <span className="text-accent">i'm claipousse</span>
                </h1>
                <p className="text-dark-gray font-body" style={{
                    fontSize: 'clamp(1rem, 4vw, 1.5rem)',
                    WebkitTextStroke: '1px white',
                    paintOrder: 'stroke fill'
                }}>
                    student in cybersecurity, cat enjoyer
                </p>
            </div>

            {/* icons grid - 2x3 above 640px, 1x5 below */}
            <div className="w-full flex-grow flex items-center justify-center px-4">

                {/* 2x3 grid (≥640px) */}
                <div className="hidden sm:grid grid-cols-2 gap-4 max-w-md mx-auto">
                    {icons.slice(0, 4).map((icon) => (
                        <div key={icon.name} className="flex flex-col items-center gap-2 cursor-pointer transition-flat hover:scale-105">
                            <div className="flex items-center justify-center rounded-lg" style={{
                                backgroundColor: '#b782fc',
                                width: 'clamp(5rem, 18vw, 7rem)',
                                height: 'clamp(5rem, 18vw, 7rem)',
                                padding: 'clamp(0.75rem, 2vw, 1rem)'
                            }}>
                                <Image src={`/images/icons/${icon.file}`} alt={icon.name} width={80} height={80} className="object-contain w-full h-full" draggable={false} />
                            </div>
                            <span className="font-mono font-bold text-dark-gray" style={{ fontSize: 'clamp(0.75rem, 3vw, 1rem)' }}>{icon.label}</span>
                        </div>
                    ))}
                    <div className="col-span-2 flex justify-center">
                        <div className="flex flex-col items-center gap-2 cursor-pointer transition-flat hover:scale-105">
                            <div className="flex items-center justify-center rounded-lg" style={{
                                backgroundColor: '#b782fc',
                                width: 'clamp(5rem, 18vw, 7rem)',
                                height: 'clamp(5rem, 18vw, 7rem)',
                                padding: 'clamp(0.75rem, 2vw, 1rem)'
                            }}>
                                <Image src={`/images/icons/${icons[4].file}`} alt={icons[4].name} width={80} height={80} className="object-contain w-full h-full" draggable={false} />
                            </div>
                            <span className="font-mono font-bold text-dark-gray" style={{ fontSize: 'clamp(0.75rem, 3vw, 1rem)' }}>{icons[4].label}</span>
                        </div>
                    </div>
                </div>

                {/* 1x5 grid (<640px) */}
                <div className="grid sm:hidden grid-cols-1 gap-4 max-w-xs mx-auto">
                    {icons.map((icon) => (
                        <div key={icon.name} className="flex flex-col items-center gap-2 cursor-pointer transition-flat hover:scale-105">
                            <div className="flex items-center justify-center rounded-lg" style={{
                                backgroundColor: '#b782fc',
                                width: 'clamp(5rem, 25vw, 7rem)',
                                height: 'clamp(5rem, 25vw, 7rem)',
                                padding: 'clamp(0.75rem, 2vw, 1rem)'
                            }}>
                                <Image src={`/images/icons/${icon.file}`} alt={icon.name} width={80} height={80} className="object-contain w-full h-full" draggable={false} />
                            </div>
                            <span className="font-mono font-bold text-dark-gray" style={{ fontSize: 'clamp(0.75rem, 4vw, 1rem)' }}>{icon.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* copyright at bottom */}
            <div className="mb-20 text-center">
                <p className="text-dark-gray text-sm">© 2025 claipousse</p>
            </div>
        </div>
    );
}