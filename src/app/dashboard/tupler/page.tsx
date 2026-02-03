"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale/tr";
import { Tup, PAKET_LIMITLERI } from "@/types";

const durumRenk: Record<string, string> = {
  aktif: "bg-green-100 text-green-800",
  pasif: "bg-gray-100 text-gray-800",
  hurda: "bg-red-100 text-red-800",
  kayip: "bg-yellow-100 text-yellow-800",
};

export default function TuplerPage() {
  const { userData } = useAuth();
  const [tupler, setTupler] = useState<Tup[]>([]);
  const [filtered, setFiltered] = useState<Tup[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tipFilter, setTipFilter] = useState("all");

  useEffect(() => {
    if (!userData) return;
    const load = async () => {
      const q = query(collection(db, "tupler"), where("ownerId", "==", userData.id));
      const snap = await getDocs(q);
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Tup);
      setTupler(data);
      setFiltered(data);
      setLoading(false);
    };
    load();
  }, [userData]);

  useEffect(() => {
    let result = tupler;
    if (tipFilter !== "all") result = result.filter((t) => t.tip === tipFilter);
    if (search) result = result.filter((t) => t.seriNo.toLowerCase().includes(search.toLowerCase()));
    setFiltered(result);
  }, [search, tipFilter, tupler]);

  const askida = userData?.hesapDurumu === "askida";
  const limit = PAKET_LIMITLERI[userData?.paket || "starter"]?.maksTup || 0;
  const limitReached = tupler.length >= limit && limit !== Infinity;

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold">Tüpler</h1>
        {userData?.kullaniciTipi === "dolumcu" && (
          <Link href="/dashboard/tupler/yeni">
            <Button className="bg-red-600 hover:bg-red-700" disabled={askida || limitReached}>
              <Plus className="h-4 w-4 mr-2" /> Yeni Tüp Ekle
            </Button>
          </Link>
        )}
      </div>

      {limitReached && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded-md text-sm">
          Paket limitinize ulaştınız ({limit} tüp). Daha fazla tüp eklemek için paketinizi yükseltin.
        </div>
      )}

      <div className="flex gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Seri no ile ara..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Select value={tipFilter} onValueChange={setTipFilter}>
          <SelectTrigger className="w-[150px]"><SelectValue placeholder="Tip" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tümü</SelectItem>
            <SelectItem value="KKT">KKT</SelectItem>
            <SelectItem value="SK">SK</SelectItem>
            <SelectItem value="CO2">CO2</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Seri No</TableHead>
                <TableHead>Tip</TableHead>
                <TableHead>Kapasite</TableHead>
                <TableHead>Marka</TableHead>
                <TableHead>Son Dolum</TableHead>
                <TableHead>Durum</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center text-gray-500 py-8">Tüp bulunamadı.</TableCell></TableRow>
              ) : (
                filtered.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>
                      <Link href={`/dashboard/tupler/${t.id}`} className="text-red-600 hover:underline font-medium">{t.seriNo}</Link>
                    </TableCell>
                    <TableCell><Badge variant="outline">{t.tip}</Badge></TableCell>
                    <TableCell>{t.kapasite}</TableCell>
                    <TableCell>{t.marka}</TableCell>
                    <TableCell className="text-sm">{t.sonDolumTarihi ? format(t.sonDolumTarihi.toDate(), "dd.MM.yyyy", { locale: tr }) : "-"}</TableCell>
                    <TableCell><span className={`px-2 py-1 rounded text-xs font-medium ${durumRenk[t.durum]}`}>{t.durum}</span></TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
