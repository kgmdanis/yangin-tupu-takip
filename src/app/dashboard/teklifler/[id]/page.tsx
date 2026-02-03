"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale/tr";
import type { Teklif, TeklifDurumu } from "@/types";

export default function TeklifDetayPage() {
  const { id } = useParams<{ id: string }>();
  const { userData } = useAuth();
  const router = useRouter();
  const [teklif, setTeklif] = useState<Teklif | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getDoc(doc(db, "teklifler", id)).then((d) => {
      if (d.exists()) setTeklif({ id: d.id, ...d.data() } as Teklif);
      setLoading(false);
    });
  }, [id]);

  const changeDurum = async (durum: TeklifDurumu) => {
    await updateDoc(doc(db, "teklifler", id), { durum, updatedAt: serverTimestamp() });
    setTeklif((p) => p ? { ...p, durum } : p);
  };

  const handleDelete = async () => {
    if (!confirm("Bu teklifi silmek istediğinize emin misiniz?")) return;
    await deleteDoc(doc(db, "teklifler", id));
    router.push("/dashboard/teklifler");
  };

  const fmtDate = (ts: any) => ts ? format(ts.toDate(), "dd.MM.yyyy", { locale: tr }) : "-";
  const askida = userData?.hesapDurumu === "askida";

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" /></div>;
  if (!teklif) return <div className="text-center py-12 text-gray-500">Teklif bulunamadı.</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{teklif.teklifNo}</h1>
        <div className="flex gap-2 items-center">
          <Select value={teklif.durum} onValueChange={(v) => changeDurum(v as TeklifDurumu)} disabled={askida}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="taslak">Taslak</SelectItem>
              <SelectItem value="gonderildi">Gönderildi</SelectItem>
              <SelectItem value="onaylandi">Onaylandı</SelectItem>
              <SelectItem value="reddedildi">Reddedildi</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="destructive" size="sm" onClick={handleDelete} disabled={askida}><Trash2 className="h-4 w-4" /></Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-4 text-sm mb-6">
            <div><span className="text-gray-500">Tarih:</span> <strong>{fmtDate(teklif.tarih)}</strong></div>
            <div><span className="text-gray-500">Geçerlilik:</span> <strong>{fmtDate(teklif.gecerlilikTarihi)}</strong></div>
          </div>

          <Table>
            <TableHeader><TableRow><TableHead>Açıklama</TableHead><TableHead className="text-right">Miktar</TableHead><TableHead>Birim</TableHead><TableHead className="text-right">Birim Fiyat</TableHead><TableHead className="text-right">Toplam</TableHead></TableRow></TableHeader>
            <TableBody>
              {teklif.kalemler?.map((k, i) => (
                <TableRow key={i}>
                  <TableCell>{k.aciklama}</TableCell>
                  <TableCell className="text-right">{k.miktar}</TableCell>
                  <TableCell>{k.birim}</TableCell>
                  <TableCell className="text-right">{k.birimFiyat.toLocaleString("tr-TR")} ₺</TableCell>
                  <TableCell className="text-right">{k.toplam.toLocaleString("tr-TR")} ₺</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex justify-end mt-4">
            <div className="w-64 space-y-1 text-sm">
              <div className="flex justify-between"><span>Ara Toplam:</span><span>{teklif.araToplam?.toLocaleString("tr-TR")} ₺</span></div>
              <div className="flex justify-between"><span>KDV (%{teklif.kdvOrani}):</span><span>{teklif.kdvTutar?.toLocaleString("tr-TR")} ₺</span></div>
              <div className="flex justify-between font-bold text-base border-t pt-2"><span>Genel Toplam:</span><span>{teklif.genelToplam?.toLocaleString("tr-TR")} ₺</span></div>
            </div>
          </div>

          {teklif.notlar && <div className="mt-6 p-3 bg-gray-50 rounded text-sm"><strong>Notlar:</strong> {teklif.notlar}</div>}
        </CardContent>
      </Card>
    </div>
  );
}
