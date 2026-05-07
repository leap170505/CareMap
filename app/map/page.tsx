import dynamic from "next/dynamic";

// Dynamically import MainMap so it only renders on the client side
// This is required because Leaflet relies on the browser 'window' object
const MainMap = dynamic(() => import("@/components/map/MainMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin"></div>
        <p className="font-medium">Loading Map...</p>
      </div>
    </div>
  ),
});

export default function MapPage() {
  return (
    <div className="flex-1 flex flex-col relative w-full h-[calc(100vh-64px)]">
      <MainMap />
    </div>
  );
}
