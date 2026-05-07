export default function Home() {
  return (
    <div className="flex-1 flex flex-col relative w-full h-[calc(100vh-64px)]">
      {/* 
        This is where the large, interactive Map View will go in Step 4.
        For now, it's a placeholder.
      */}
      <div className="absolute inset-0 bg-rose-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl max-w-md border border-rose-100">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">Map View (Coming Soon)</h1>
          <p className="text-gray-600 mb-8">
            This page will display all the submitted reports on a large, interactive map. Only logged-in users can see this.
          </p>
          <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
        </div>
      </div>
    </div>
  );
}
