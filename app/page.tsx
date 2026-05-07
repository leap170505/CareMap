import Link from "next/link";
import { Heart, MapPin, ClipboardList } from "lucide-react";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full space-y-12 text-center">
        
        {/* Hero Section */}
        <div className="space-y-6">
          <div className="mx-auto w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center shadow-inner">
            <Heart size={40} className="text-rose-500 fill-rose-500/20" />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
            Welcome to <span className="text-rose-600">CareMap KH</span>
          </h1>
          <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto leading-relaxed">
            A community-driven platform to locate, track, and support people in need across Cambodia.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
          <Link
            href="/map"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-lg shadow-rose-600/30 transition-all hover:scale-105"
          >
            <MapPin size={20} />
            View the Map
          </Link>
          
          <Link
            href="/report"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl shadow-sm transition-all hover:scale-105"
          >
            <ClipboardList size={20} />
            Submit a Report
          </Link>
        </div>

      </div>
    </div>
  );
}
