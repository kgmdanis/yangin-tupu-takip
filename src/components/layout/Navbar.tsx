"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/#ozellikler", label: "Özellikler" },
    { href: "/paketler", label: "Fiyatlandırma" },
    { href: "/#iletisim", label: "İletişim" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl text-red-600">
          Yangın Tüpü Takip
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm text-gray-600 hover:text-gray-900">
              {l.label}
            </Link>
          ))}
          <Link href="/giris">
            <Button variant="ghost">Giriş Yap</Button>
          </Link>
          <Link href="/kayit">
            <Button className="bg-red-600 hover:bg-red-700">Kayıt Ol</Button>
          </Link>
        </nav>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <div className="flex flex-col gap-4 mt-8">
              {links.map((l) => (
                <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-lg">
                  {l.label}
                </Link>
              ))}
              <Link href="/giris" onClick={() => setOpen(false)}>
                <Button variant="outline" className="w-full">Giriş Yap</Button>
              </Link>
              <Link href="/kayit" onClick={() => setOpen(false)}>
                <Button className="w-full bg-red-600 hover:bg-red-700">Kayıt Ol</Button>
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
