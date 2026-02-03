"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import type { Musteri } from "@/types";

export default function MusterilerPage() {
  const { userData } = useAuth();
  const [musteriler, setMusteriler] = useState<Musteri[]>([]);
  const [filtered, setFiltered] = useState<Musteri[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userData) return;
    const load = async () => {
      const q = query(collection(db, "musteriler"), where("ownerId", "==", userData.id));
      const snap = await getDocs(q);
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Musteri);
      setMusteriler(data);
      setFiltered(data);
      setLoading(false);
    };
    load();
  }, [userData]);

  useEffect(() => {
    if (!search) { setFiltered(musteriler); return; }
    setFiltered(musteriler.filter((m) => m.firmaAdi.toLowerCase().includes(search.toLowerCase())));
  }, [search, musteriler]);

  const askida = userData?.hesapDurumu === "askida";
  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold">Müşteriler</h1>
        <Link href="/dashboard/musteriler/yeni">
          <Button className="bg-red-600 hover:bg-red-700" disabled={askida}><Plus className="h-4 w-4 mr-2" />Yeni Müşteri</Button>
        </Link>
      </div>
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input placeholder="Firma adı ile ara..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Firma Adı</TableHead>
                <TableHead>Yetkili</TableHead>
                <TableHead>Telefon</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>İl</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center text-gray-500 py-8">Müşteri bulunamadı.</TableCell></TableRow>
              ) : filtered.map((m) => (
                <TableRow key={m.id}>
                  <TableCell><Link href={`/dashboard/musteriler/${m.id}`} className="text-red-600 hover:underline font-medium">{m.firmaAdi}</Link></TableCell>
                  <TableCell>{m.yetkili}</TableCell>
                  <TableCell>{m.telefon}</TableCell>
                  <TableCell>{m.email}</TableCell>
                  <TableCell>{m.il}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
