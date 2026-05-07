import Link from "next/link";
import { Heart, MapPin, ClipboardList, ShieldCheck } from "lucide-react";
import { getSession } from "@/lib/auth";
import LogoutButton from "./LogoutButton";

export default async function Navbar() {
  const session = await getSession();
  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-rose-500 text-white p-2 rounded-xl group-hover:bg-rose-600 transition-colors">
              <Heart size={20} className="fill-white/20" />
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900">
              CareMap KH
            </span>
          </Link>

          <div className="hidden sm:flex items-center space-x-2">
            {!session ? (
              <>
                <Link href="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-rose-600 transition-colors">Log In</Link>
                <Link href="/signup" className="px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-700 transition-colors">Sign Up</Link>
              </>
            ) : (
              <>
                <NavLink href="/map" icon={<MapPin size={18} />} label="Map" />
                <NavLink href="/report" icon={<ClipboardList size={18} />} label="Submit Report" />
                {session.role === "ADMIN" && (
                  <NavLink href="/admin" icon={<ShieldCheck size={18} />} label="Admin" />
                )}
                <div className="pl-4 ml-2 border-l border-gray-200">
                  <LogoutButton />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-rose-600 hover:bg-rose-50 transition-all duration-200"
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
