export default function CentralBox() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white p-8"> {/*white page with content centered, padding 32px -> main page*/}
            <div className="w-full max-w-2xl border-2 border-light-gray rounded-2xl px-12 py-16 flex flex-col items-center gap-12"> {/*width 100%, 2px border #a3a3a3 rounded, intern padding 48px, vertical flex centered, 48px gap between each infant element*/}

                {/*80px blank space at the top of the main box*/}
                <div className="h-20"></div>

                {/* horizontaly centered 36px text, margin bottom 12px*/}
                <div className="text-center">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl mb-3">
                        hi! <span className="text-accent-green font-bold">i'm claipousse</span>
                    </h1>
                    <p className="text-dark-gray text-lg sm:text-xl lg:text-2xl">student in cybersecurity</p>
                </div>

                {/*icons at the bottom, for now temporary placeholders*/}
                <div className="flex gap-8 mt-16 mb-8"> {/*24px gap between each icons, margin top 64px, margin bottom 32px*/}
                    {['about', 'links', 'work', 'faq', 'contact'].map((name) => ( //5 grey squares 48x48px as placeholders 
                        <div
                            key={name}
                            className="w-14 h-14 bg-dark-gray rounded"
                            title={name}
                        />
                    ))}
                </div>

            </div>
        </div>
    );
}