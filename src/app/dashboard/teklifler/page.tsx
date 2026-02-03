"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale/tr";
import { PAKET_LIMITLERI, Teklif } from "@/types";

const durumStyle: Record<string, string> = {
  taslak: "bg-gray-100 text-gray-800", gonderildi: "bg-blue-100 text-blue-800",
  onaylandi: "bg-green-100 text-green-800", reddedildi: "bg-red-100 text-red-800",
};

export default function TekliflerPage() {
  const { userData } = useAuth();
  const [teklifler, setTeklifler] = useState<Teklif[]>([]);
  const [loading, setLoading] = useState(true);

  const hasAccess = PAKET_LIMITLERI[userData?.paket || "starter"]?.teklif;

  useEffect(() => {
    if (!userData || !hasAccess) { setLoading(false); return; }
    const load = async () => {
      const q = query(collection(db, "teklifler"), where("ownerId", "==", userData.id));
      const snap = await getDocs(q);
      setTeklifler(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Teklif));
      setLoading(false);
    };
    load();
  }, [userData, hasAccess]);

  if (!hasAccess) return <div className="text-center py-16"><h1 className="text-2xl font-bold mb-4">Teklifler</h1><p className="text-gray-500">Bu özellik Professional ve üzeri paketlerde kullanılabilir.</p></div>;
  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Teklifler</h1>
        <Link href="/dashboard/teklifler/yeni"><Button className="bg-red-600 hover:bg-red-700" disabled={userData?.hesapDurumu === "askida"}><Plus className="h-4 w-4 mr-2" />Yeni Teklif</Button></Link>
      </div>
      <Card><CardContent className="p-0">
        <Table>
          <TableHeader><TableRow><TableHead>Teklif No</TableHead><TableHead>Tarih</TableHead><TableHead>Toplam</TableHead><TableHead>Durum</TableHead></TableRow></TableHeader>
          <TableBody>
            {teklifler.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="text-center text-gray-500 py-8">Teklif bulunamadı.</TableCell></TableRow>
            ) : teklifler.map((t) => (
              <TableRow key={t.id}>
                <TableCell><Link href={`/dashboard/teklifler/${t.id}`} className="text-red-600 hover:underline font-medium">{t.teklifNo}</Link></TableCell>
                <TableCell className="text-sm">{t.tarih ? format(t.tarih.toDate(), "dd.MM.yyyy", { locale: tr }) : "-"}</TableCell>
                <TableCell className="font-medium">{t.genelToplam?.toLocaleString("tr-TR")} ₺</TableCell>
                <TableCell><span className={`px-2 py-1 rounded text-xs font-medium ${durumStyle[t.durum]}`}>{t.durum}</span></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>
    </div>
  );
}
