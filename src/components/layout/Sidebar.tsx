 "use client";

import Link from "next/link";
import { Package, PlusCircle, LayoutDashboard } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const path = usePathname();
  const links = [
    { href: "/products", label: "Products", icon: Package },
    { href: "/products/new", label: "Add Product", icon: PlusCircle }
  ];
  return (
    <aside className="hidden w-64 shrink-0 border-r bg-slate-950 text-white md:block">
      <div className="sticky top-0 flex h-screen flex-col">
        <div className="flex h-16 items-center gap-3 border-b border-white/10 px-6 text-xl font-bold"><LayoutDashboard /> Product Admin</div>
        <nav className="space-y-2 p-4">
          {links.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${path === href || (href === "/products" && path.startsWith("/products/") && !path.includes("/new")) ? "bg-white/10 text-white" : "text-slate-300 hover:bg-white/5 hover:text-white"}`}>
              <Icon size={19} /> {label}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}