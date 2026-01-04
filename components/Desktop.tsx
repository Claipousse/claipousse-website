import Image from 'next/image';

export default function Desktop() {
    const icons = [
        { name: 'about', file: 'about.webp', label: 'about' },
        { name: 'links', file: 'links.webp', label: 'links' },
        { name: 'work', file: 'work.webp', label: 'work' },
        { name: 'faq', file: 'faq.webp', label: 'faq' },
        { name: 'contact', file: 'contact.webp', label: 'contact' }
    ];

    return (
        <div className="min-h-screen flex items-center justify-center p-8">
            {/* main frame with fluid sizing */}
            <div className="w-full bg-white border-2 border-gray-light rounded-2xl transition-flat relative z-10" style={{
                boxShadow: '0px 5px 0px rgba(0, 0, 0, 0.15)',
                maxWidth: 'clamp(600px, 60vw, 900px)',
                padding: 'clamp(2rem, 4vw, 4rem) clamp(2rem, 3vw, 3rem)'
            }}
            >
                {/* grey bar at top */}
                <div className="bg-dark-gray rounded-t-xl border-gray-light absolute top-0 left-0 right-0" style={{ height: 'clamp(2.5rem, 3.5vw, 3.5rem)' }}></div>
                <div className="flex flex-col items-center" style={{ gap: 'clamp(2rem, 3vw, 3rem)', marginTop: 'clamp(3rem, 4vw, 4rem)' }}>

                    {/* centered text responsive */}
                    <div className="text-center">
                        <h1 className="font-body mb-3" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}>
                            hi! <span className="text-accent font-bold">i'm claipousse</span>
                        </h1>
                        <p className="text-dark-gray font-body" style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.875rem)' }}>
                            student in cybersecurity, cat enjoyer
                        </p>
                    </div>

                    {/* icons with fluid sizing */}
                    <div className="flex" style={{ gap: 'clamp(1.5rem, 2vw, 2rem)', marginTop: 'clamp(1rem, 2vw, 2rem)' }}>
                        {icons.map((icon) => (
                            <div key={icon.name} className='flex flex-col items-center cursor-pointer transition-flat hover:scale-105' style={{ gap: 'clamp(0.25rem, 0.5vw, 0.5rem)' }}>
                                <div className="flex items-center justify-center" style={{ width: 'clamp(5rem, 6vw, 7.5rem)', height: 'clamp(5rem, 6vw, 7.5rem)' }}>
                                    <Image
                                        src={`/images/icons/${icon.file}`}
                                        alt={icon.name}
                                        width={100}
                                        height={100}
                                        className="object-contain w-full h-full"
                                        draggable={false}
                                    />
                                </div>
                                <span className="font-mono font-bold text-dark-gray" style={{ fontSize: 'clamp(0.875rem, 1.2vw, 1.125rem)' }}>
                                    {icon.label}
                                </span>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
}