export default function CentralBox() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-8">
      
      {/*main frame*/}
      <div className="w-full max-w-2xl bg-white border-2 border-gray-light rounded-2xl transition-flat" style={{ boxShadow: '0px 5px 0px rgba(0, 0, 0, 0.15)' }}>
        
        {/*grey bar at the top*/}
        <div className="bg-dark-gray rounded-t-xl h-12 border-b-2 border-gray-light"></div>
        
        {/*main content*/}
        <div className="px-12 py-16 flex flex-col items-center gap-12">
          
          {/*top space*/}
          <div className="h-12"></div>
          
          {/*centered text responsive*/}
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl mb-3 font-body">hi! <span className="text-accent font-bold">i'm claipousse</span></h1>
            <p className="text-dark-gray text-lg sm:text-xl lg:text-2xl font-body">student in cybersecurity, cat enjoyer</p>
          </div>
          
          {/*icons at the bottom*/}
          <div className="flex gap-8 mt-16 mb-8">
            {['about', 'links', 'work', 'faq', 'contact'].map((name) => (
              <div key={name} className="w-16 h-16 bg-dark-gray rounded-lg transition-flat cursor-pointer hover:-translate-y-1" style={{ boxShadow: '0px 4px 0px rgba(0, 0, 0, 0.2)' }} title={name} />
            ))}
          </div>
          
        </div>
      </div>
      
    </div>
  );
}