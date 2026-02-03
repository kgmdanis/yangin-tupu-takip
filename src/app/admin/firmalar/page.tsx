"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale/tr";
import type { User } from "@/types";

const durumStyle: Record<string, string> = { aktif: "bg-green-100 text-green-800", beklemede: "bg-yellow-100 text-yellow-800", askida: "bg-orange-100 text-orange-800", iptal: "bg-red-100 text-red-800" };

export default function FirmalarPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filtered, setFiltered] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [tipFilter, setTipFilter] = useState("all");
  const [durumFilter, setDurumFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const snap = await getDocs(query(collection(db, "users"), where("kullaniciTipi", "!=", "admin")));
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as User);
      setUsers(data);
      setFiltered(data);
      setLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    let result = users;
    if (tipFilter !== "all") result = result.filter((u) => u.kullaniciTipi === tipFilter);
    if (durumFilter !== "all") result = result.filter((u) => u.hesapDurumu === durumFilter);
    if (search) result = result.filter((u) => u.firmaAdi.toLowerCase().includes(search.toLowerCase()));
    setFiltered(result);
  }, [search, tipFilter, durumFilter, users]);

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" /></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Firmalar</h1>
      <div className="flex gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Firma ara..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Select value={tipFilter} onValueChange={setTipFilter}><SelectTrigger className="w-40"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Tüm Tipler</SelectItem><SelectItem value="dolumcu">Dolumcu</SelectItem><SelectItem value="fabrika">Fabrika</SelectItem></SelectContent></Select>
        <Select value={durumFilter} onValueChange={setDurumFilter}><SelectTrigger className="w-40"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Tüm Durumlar</SelectItem><SelectItem value="aktif">Aktif</SelectItem><SelectItem value="beklemede">Beklemede</SelectItem><SelectItem value="askida">Askıda</SelectItem><SelectItem value="iptal">İptal</SelectItem></SelectContent></Select>
      </div>
      <Card><CardContent className="p-0">
        <Table>
          <TableHeader><TableRow><TableHead>Firma Adı</TableHead><TableHead>Yetkili</TableHead><TableHead>Tip</TableHead><TableHead>Paket</TableHead><TableHead>Durum</TableHead><TableHead>Kayıt</TableHead></TableRow></TableHeader>
          <TableBody>
            {filtered.map((u) => (
              <TableRow key={u.id}>
                <TableCell><Link href={`/admin/firmalar/${u.id}`} className="text-red-600 hover:underline font-medium">{u.firmaAdi}</Link></TableCell>
                <TableCell>{u.yetkili}</TableCell>
                <TableCell><Badge variant="outline">{u.kullaniciTipi}</Badge></TableCell>
                <TableCell>{u.paket}</TableCell>
                <TableCell><span className={`px-2 py-1 rounded text-xs font-medium ${durumStyle[u.hesapDurumu]}`}>{u.hesapDurumu}</span></TableCell>
                <TableCell className="text-sm">{u.createdAt ? format(u.createdAt.toDate(), "dd.MM.yyyy", { locale: tr }) : "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>
    </div>
  );
}
