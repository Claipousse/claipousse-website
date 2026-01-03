import Image from 'next/image';

export default function CentralBox() {
  //all the icons of the page
  const icons = [
    { name: 'about', file: 'about.webp', label: 'about' },
    { name: 'links', file: 'links.webp', label: 'links' },
    { name: 'work', file: 'work.webp', label: 'work' },
    { name: 'faq', file: 'faq.webp', label: 'faq' },
    { name: 'contact', file: 'contact.webp', label: 'contact' }
  ]
  return (
    //animated omori background
    <div className="min-h-screen flex items-center justify-center p-8 relative overflow-hidden">
      <div className="fixed inset-0 z-0">
        <Image src="/images/background.webp" alt="background" fill className="object-cover" priority quality={100}/>
      </div>

      <div className="w-full max-w-3xl bg-white border-2 border-gray-light rounded-2xl transition-flat relative z-10" style={{ boxShadow: '0px 5px 0px rgba(0, 0, 0, 0.15)' }}> {/*main frame*/}
        <div className="bg-dark-gray rounded-t-xl h-14 border-gray-light"></div> {/*grey bar at the top*/}
        <div className="px-12 py-16 flex flex-col items-center gap-12"> {/*main content*/}
          <div className="h-6"></div> {/*top space*/}
          
          {/*centered text responsive*/}
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl mb-6 font-body">hi! <span className="text-accent font-bold">i'm claipousse</span></h1>
            <p className="text-dark-gray text-xl sm:text-2xl lg:text-3xl font-body">student in cybersecurity, cat enjoyer</p>
          </div>
          
          {/*icons at the bottom*/}
          <div className="flex gap-8 mt-8 mb-8">
            {icons.map((icon) => (
              <div key={icon.name} className='flex flex-col items-center gap-1 cursor-pointer transition-flat hover:scale-105'>
                <div className="w-24 h-24 flex items-center justify-center">
                  <Image src={`/images/icons/${icon.file}`} alt={icon.name} width={100} height={100} className="object-contain" /> {/*icons*/}
                </div> 
                <span className="text-lg font-mono font-bold text-dark-gray">{icon.label}</span> {/*text of the icons*/}
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}