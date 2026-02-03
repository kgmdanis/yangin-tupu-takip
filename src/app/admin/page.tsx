"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, Cylinder } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale/tr";
import type { User } from "@/types";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ toplam: 0, aktif: 0, bekleyen: 0, askida: 0, tupSayisi: 0 });
  const [sonKayitlar, setSonKayitlar] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const usersSnap = await getDocs(query(collection(db, "users"), where("kullaniciTipi", "!=", "admin")));
      const users = usersSnap.docs.map((d) => ({ id: d.id, ...d.data() }) as User);
      const tupSnap = await getDocs(collection(db, "tupler"));

      setStats({
        toplam: users.length,
        aktif: users.filter((u) => u.hesapDurumu === "aktif").length,
        bekleyen: users.filter((u) => u.hesapDurumu === "beklemede").length,
        askida: users.filter((u) => u.hesapDurumu === "askida").length,
        tupSayisi: tupSnap.size,
      });

      const sorted = [...users].sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
      setSonKayitlar(sorted.slice(0, 10));
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" /></div>;

  const cards = [
    { label: "Toplam Firma", value: stats.toplam, icon: Building2, color: "text-blue-600" },
    { label: "Aktif", value: stats.aktif, icon: Users, color: "text-green-600" },
    { label: "Bekleyen", value: stats.bekleyen, icon: Users, color: "text-yellow-600" },
    { label: "Askıda", value: stats.askida, icon: Users, color: "text-orange-600" },
    { label: "Toplam Tüp", value: stats.tupSayisi, icon: Cylinder, color: "text-purple-600" },
  ];

  const durumStyle: Record<string, string> = { aktif: "bg-green-100 text-green-800", beklemede: "bg-yellow-100 text-yellow-800", askida: "bg-orange-100 text-orange-800", iptal: "bg-red-100 text-red-800" };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {cards.map((c) => (
          <Card key={c.label}><CardContent className="p-4 flex items-center gap-3"><c.icon className={`h-8 w-8 ${c.color}`} /><div><p className="text-xs text-gray-500">{c.label}</p><p className="text-xl font-bold">{c.value}</p></div></CardContent></Card>
        ))}
      </div>
      <Card>
        <CardHeader><CardTitle>Son Kayıtlar</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow><TableHead>Firma</TableHead><TableHead>Tip</TableHead><TableHead>Paket</TableHead><TableHead>Durum</TableHead><TableHead>Tarih</TableHead></TableRow></TableHeader>
            <TableBody>
              {sonKayitlar.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.firmaAdi}</TableCell>
                  <TableCell><Badge variant="outline">{u.kullaniciTipi}</Badge></TableCell>
                  <TableCell>{u.paket}</TableCell>
                  <TableCell><span className={`px-2 py-1 rounded text-xs font-medium ${durumStyle[u.hesapDurumu]}`}>{u.hesapDurumu}</span></TableCell>
                  <TableCell className="text-sm">{u.createdAt ? format(u.createdAt.toDate(), "dd.MM.yyyy", { locale: tr }) : "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
