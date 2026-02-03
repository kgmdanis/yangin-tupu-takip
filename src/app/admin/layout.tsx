"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Building2, Clock, AlertTriangle, Settings, LogOut } from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/firmalar", label: "Firmalar", icon: Building2 },
  { href: "/admin/bekleyenler", label: "Bekleyenler", icon: Clock },
  { href: "/admin/askidakiler", label: "Askıdakiler", icon: AlertTriangle },
  { href: "/admin/ayarlar", label: "Ayarlar", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { firebaseUser, userData, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!firebaseUser) router.push("/giris");
      else if (userData?.kullaniciTipi !== "admin") router.push("/dashboard");
    }
  }, [firebaseUser, userData, loading, router]);

  if (loading || !userData || userData.kullaniciTipi !== "admin") {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" /></div>;
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h2 className="font-bold text-lg">Admin Panel</h2>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm ${active ? "bg-red-600 text-white" : "text-gray-300 hover:bg-gray-800"}`}>
                <item.icon className="h-5 w-5" />{item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-700">
          <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800" onClick={() => signOut()}>
            <LogOut className="h-5 w-5 mr-3" />Çıkış
          </Button>
        </div>
      </aside>
      <main className="flex-1 p-6 bg-gray-50">{children}</main>
    </div>
  );
}
