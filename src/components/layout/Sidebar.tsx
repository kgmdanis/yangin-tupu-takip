"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Users,
  Flame,
  Package,
  FileText,
  Wallet,
  QrCode,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bell,
  HelpCircle,
  Moon,
  Sun
} from "lucide-react";

interface SidebarProps {
  userRole?: "admin" | "musteri" | "personel";
  userName?: string;
  companyName?: string;
}

export default function Sidebar({ 
  userRole = "admin", 
  userName = "Kullanıcı",
  companyName = "Şirket"
}: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const menuItems = {
    admin: [
      { href: "/admin", icon: LayoutDashboard, label: "Dashboard", badge: null },
      { href: "/admin/musteriler", icon: Building2, label: "Müşteriler", badge: null },
      { href: "/admin/personel", icon: Users, label: "Personel", badge: null },
      { href: "/admin/tupler", icon: Flame, label: "Tüpler", badge: "128" },
      { href: "/admin/stok", icon: Package, label: "Stok", badge: null },
      { href: "/admin/teklifler", icon: FileText, label: "Teklifler", badge: "3" },
      { href: "/admin/cari", icon: Wallet, label: "Cari Hesap", badge: null },
      { href: "/admin/qr", icon: QrCode, label: "QR Kodlar", badge: null },
      { href: "/admin/raporlar", icon: BarChart3, label: "Raporlar", badge: null },
      { href: "/admin/ayarlar", icon: Settings, label: "Ayarlar", badge: null },
    ],
    musteri: [
      { href: "/musteri", icon: LayoutDashboard, label: "Dashboard", badge: null },
      { href: "/musteri/tupler", icon: Flame, label: "Tüplerim", badge: null },
      { href: "/musteri/bakimlar", icon: FileText, label: "Bakım Geçmişi", badge: null },
      { href: "/musteri/belgeler", icon: QrCode, label: "Belgeler", badge: null },
    ],
    personel: [
      { href: "/personel", icon: LayoutDashboard, label: "Dashboard", badge: null },
      { href: "/personel/gorevler", icon: FileText, label: "Görevlerim", badge: "5" },
      { href: "/personel/bakimlar", icon: Flame, label: "Bakımlar", badge: null },
      { href: "/personel/qr-okut", icon: QrCode, label: "QR Okut", badge: null },
    ],
  };

  const currentMenu = menuItems[userRole];

  return (
    <aside 
      className={`fixed left-0 top-0 h-screen bg-gray-900 border-r border-gray-800 transition-all duration-300 z-50 flex flex-col ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Logo & Brand */}
      <div className="p-4 border-b border-gray-800">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative">
            <Image 
              src="/logo.png" 
              alt="KGM Logo" 
              width={44} 
              height={44}
              className="rounded-xl"
            />
            {/* Online indicator */}
            <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-gray-900 rounded-full"></span>
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="font-bold text-lg bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                TüpTakip
              </h1>
              <p className="text-xs text-gray-500 truncate">KGM Dijital</p>
            </div>
          )}
        </Link>
      </div>

      {/* User Info */}
      {!collapsed && (
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center text-white font-bold">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{userName}</p>
              <p className="text-xs text-gray-500 truncate">{companyName}</p>
            </div>
            <button className="relative p-2 text-gray-400 hover:text-white transition">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {currentMenu.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-400 border border-orange-500/30"
                  : "text-gray-400 hover:text-white hover:bg-gray-800/50"
              }`}
            >
              <div className={`p-2 rounded-lg transition ${
                isActive 
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white" 
                  : "bg-gray-800 group-hover:bg-gray-700"
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              {!collapsed && (
                <>
                  <span className="flex-1 font-medium">{item.label}</span>
                  {item.badge && (
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                      isActive 
                        ? "bg-orange-500 text-white" 
                        : "bg-gray-700 text-gray-300"
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-gray-800 space-y-2">
        {/* Theme Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800/50 transition ${collapsed ? "justify-center" : ""}`}
        >
          <div className="p-2 rounded-lg bg-gray-800">
            {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </div>
          {!collapsed && <span className="font-medium">Tema</span>}
        </button>

        {/* Help */}
        <Link
          href="/yardim"
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800/50 transition ${collapsed ? "justify-center" : ""}`}
        >
          <div className="p-2 rounded-lg bg-gray-800">
            <HelpCircle className="w-5 h-5" />
          </div>
          {!collapsed && <span className="font-medium">Yardım</span>}
        </Link>

        {/* Logout */}
        <button
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition ${collapsed ? "justify-center" : ""}`}
        >
          <div className="p-2 rounded-lg bg-red-500/20">
            <LogOut className="w-5 h-5" />
          </div>
          {!collapsed && <span className="font-medium">Çıkış Yap</span>}
        </button>
      </div>

      {/* Collapse Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-gray-800 border border-gray-700 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </aside>
  );
}
