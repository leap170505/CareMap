"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-rose-600 hover:text-white hover:bg-rose-500 transition-all duration-200 border border-rose-100"
    >
      <LogOut size={16} />
      <span>Sign out</span>
    </button>
  );
}
