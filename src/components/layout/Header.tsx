 "use client";

import { LogOut, Package, UserCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white/95 px-4 backdrop-blur md:px-8">
      <div className="flex items-center gap-2 font-bold text-slate-900 md:hidden"><Package size={22} /> Admin</div>
      <div className="hidden md:block">
        <p className="text-sm font-medium text-slate-500">Product Management</p>
        <h1 className="text-lg font-bold text-slate-900">Admin Dashboard</h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 sm:flex">
          <UserCircle size={30} className="text-slate-400" />
          <div><p className="text-sm font-semibold">{user?.firstName} {user?.lastName}</p><p className="text-xs text-slate-500">@{user?.username}</p></div>
        </div>
        <button onClick={logout} className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium hover:bg-slate-50"><LogOut size={16} /> Logout</button>
      </div>
    </header>
  );
}