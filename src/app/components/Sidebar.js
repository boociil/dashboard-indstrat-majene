"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  TrendingUp,
  Sprout,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    {
      name: "Home",
      href: "/",
      icon: LayoutDashboard,
    },
    {
      name: "Kemiskinan",
      href: "/kemiskinan",
      icon: Users,
    },
    {
      name: "PDRB",
      href: "/pdrb",
      icon: BarChart3,
    },
    {
      name: "Inflasi",
      href: "/inflasi",
      icon: TrendingUp,
    },
    {
      name: "Pertanian",
      href: "/pertanian",
      icon: Sprout,
    },
  ];

  return (
    <aside className="w-64 bg-[#f8f9fa] border-r border-slate-200/80 flex flex-col h-screen sticky top-0">
      {/* Brand Logo Header */}
      <div className="p-6 border-b border-slate-200/80 flex items-center gap-3">
        <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm shadow-blue-500/20">
          M
        </div>
        <div>
          <h1 className="font-bold text-slate-800 tracking-tight leading-none text-sm">
            Dashboard Majene
          </h1>
          <span className="text-[11px] font-medium text-slate-400">
            Topik Strategis
          </span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <div className="px-2 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Menu Utama
        </div>
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <>
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3  px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600"}`}
                />
                {item.name}
              </Link>
              {item.name === "Home" && (
                <div className="px-2 text-[10px] mt-8 font-bold text-slate-400 uppercase tracking-wider">
                  Data
                </div>
              )}
            </>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-6 border-t border-slate-200/80 text-center">
        <p className="text-[11px] text-slate-400 font-medium">
          BPS Majene © 2026
        </p>
      </div>
    </aside>
  );
}
