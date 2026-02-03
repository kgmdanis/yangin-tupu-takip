"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { PAKET_LIMITLERI } from "@/types";
import {
  LayoutDashboard,
  Cylinder,
  Users,
  UserCog,
  Package,
  FileText,
  Wallet,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

const allNavItems = [
  { href: "/dashboard", label: "Ana Sayfa", icon: LayoutDashboard, access: () => true },
  { href: "/dashboard/tupler", label: "Tüpler", icon: Cylinder, access: () => true },
  { href: "/dashboard/musteriler", label: "Müşteriler", icon: Users, access: (_p: string, t: string) => t === "dolumcu" },
  { href: "/dashboard/personel", label: "Personel", icon: UserCog, access: () => true },
  { href: "/dashboard/stok", label: "Stok", icon: Package, access: (p: string, t: string) => t === "dolumcu" && PAKET_LIMITLERI[p]?.stok },
  { href: "/dashboard/teklifler", label: "Teklifler", icon: FileText, access: (p: string, t: string) => t === "dolumcu" && PAKET_LIMITLERI[p]?.teklif },
  { href: "/dashboard/cari", label: "Cari", icon: Wallet, access: (p: string, t: string) => t === "dolumcu" && PAKET_LIMITLERI[p]?.cari },
  { href: "/dashboard/raporlar", label: "Raporlar", icon: BarChart3, access: () => true },
  { href: "/dashboard/ayarlar", label: "Ayarlar", icon: Settings, access: () => true },
];

function NavContent({ onItemClick }: { onItemClick?: () => void }) {
  const pathname = usePathname();
  const { userData, signOut } = useAuth();

  const paket = userData?.paket || "starter";
  const tip = userData?.kullaniciTipi || "dolumcu";
  const navItems = allNavItems.filter((item) => item.access(paket, tip));

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white w-64">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-bold truncate">{userData?.firmaAdi || "Firma"}</h2>
        <p className="text-xs text-gray-400 truncate">{userData?.email}</p>
      </div>
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onItemClick}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                active ? "bg-red-600 text-white" : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-700">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800"
          onClick={() => signOut()}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Çıkış Yap
        </Button>
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden lg:block h-screen sticky top-0">
      <NavContent />
    </aside>
  );
}

export function MobileSidebar() {
  const [open, setOpen] = useState(false);
  return (
    <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b">
      <h1 className="font-bold text-lg">Yangın Tüpü Takip</h1>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <NavContent onItemClick={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
