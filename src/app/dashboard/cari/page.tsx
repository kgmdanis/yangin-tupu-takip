"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, addDoc, serverTimestamp, Timestamp, orderBy } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale/tr";
import { PAKET_LIMITLERI, Cari, Musteri, CariIslemTipi } from "@/types";

export default function CariPage() {
  const { userData } = useAuth();
  const [cariler, setCariler] = useState<Cari[]>([]);
  const [musteriler, setMusteriler] = useState<Musteri[]>([]);
  const [filterMusteri, setFilterMusteri] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ musteriId: "", islemTipi: "borc" as CariIslemTipi, tutar: 0, aciklama: "", belgeNo: "", tarih: "" });
  const [loading, setLoading] = useState(true);

  const hasAccess = PAKET_LIMITLERI[userData?.paket || "starter"]?.cari;

  const load = async () => {
    if (!userData) return;
    const cQ = query(collection(db, "cari"), where("ownerId", "==", userData.id));
    const cSnap = await getDocs(cQ);
    setCariler(cSnap.docs.map((d) => ({ id: d.id, ...d.data() }) as Cari));
    const mQ = query(collection(db, "musteriler"), where("ownerId", "==", userData.id));
    const mSnap = await getDocs(mQ);
    setMusteriler(mSnap.docs.map((d) => ({ id: d.id, ...d.data() }) as Musteri));
    setLoading(false);
  };

  useEffect(() => { load(); }, [userData]);

  if (!hasAccess) return <div className="text-center py-16"><h1 className="text-2xl font-bold mb-4">Cari Hesaplar</h1><p className="text-gray-500">Bu özellik Enterprise paketinde kullanılabilir.</p></div>;

  const filtered = filterMusteri === "all" ? cariler : cariler.filter((c) => c.musteriId === filterMusteri);
  const toplamBorc = filtered.filter((c) => c.islemTipi === "borc").reduce((s, c) => s + c.tutar, 0);
  const toplamAlacak = filtered.filter((c) => c.islemTipi === "alacak").reduce((s, c) => s + c.tutar, 0);
  const askida = userData?.hesapDurumu === "askida";

  const handleSave = async () => {
    if (!userData) return;
    await addDoc(collection(db, "cari"), {
      ownerId: userData.id, musteriId: form.musteriId, islemTipi: form.islemTipi, tutar: form.tutar,
      aciklama: form.aciklama, belgeNo: form.belgeNo,
      tarih: form.tarih ? Timestamp.fromDate(new Date(form.tarih)) : serverTimestamp(),
      createdAt: serverTimestamp(),
    });
    setDialogOpen(false);
    setForm({ musteriId: "", islemTipi: "borc", tutar: 0, aciklama: "", belgeNo: "", tarih: "" });
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Cari Hesaplar</h1>
        <Button className="bg-red-600 hover:bg-red-700" onClick={() => setDialogOpen(true)} disabled={askida}><Plus className="h-4 w-4 mr-2" />Yeni İşlem</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><CardContent className="p-4"><p className="text-sm text-gray-500">Toplam Borç</p><p className="text-2xl font-bold text-red-600">{toplamBorc.toLocaleString("tr-TR")} ₺</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-gray-500">Toplam Alacak</p><p className="text-2xl font-bold text-green-600">{toplamAlacak.toLocaleString("tr-TR")} ₺</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-gray-500">Net Bakiye</p><p className="text-2xl font-bold">{(toplamAlacak - toplamBorc).toLocaleString("tr-TR")} ₺</p></CardContent></Card>
      </div>

      <Select value={filterMusteri} onValueChange={setFilterMusteri}>
        <SelectTrigger className="w-64"><SelectValue placeholder="Müşteri filtrele" /></SelectTrigger>
        <SelectContent><SelectItem value="all">Tüm Müşteriler</SelectItem>{musteriler.map((m) => <SelectItem key={m.id} value={m.id}>{m.firmaAdi}</SelectItem>)}</SelectContent>
      </Select>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Yeni Cari İşlem</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Müşteri</Label>
              <Select value={form.musteriId} onValueChange={(v) => setForm({ ...form, musteriId: v })}>
                <SelectTrigger><SelectValue placeholder="Seçin" /></SelectTrigger>
                <SelectContent>{musteriler.map((m) => <SelectItem key={m.id} value={m.id}>{m.firmaAdi}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>İşlem Tipi</Label>
              <Select value={form.islemTipi} onValueChange={(v) => setForm({ ...form, islemTipi: v as CariIslemTipi })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="borc">Borç</SelectItem><SelectItem value="alacak">Alacak</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Tutar (₺)</Label><Input type="number" value={form.tutar} onChange={(e) => setForm({ ...form, tutar: +e.target.value })} /></div>
            <div className="space-y-2"><Label>Açıklama</Label><Input value={form.aciklama} onChange={(e) => setForm({ ...form, aciklama: e.target.value })} /></div>
            <div className="space-y-2"><Label>Belge No</Label><Input value={form.belgeNo} onChange={(e) => setForm({ ...form, belgeNo: e.target.value })} /></div>
            <div className="space-y-2"><Label>Tarih</Label><Input type="date" value={form.tarih} onChange={(e) => setForm({ ...form, tarih: e.target.value })} /></div>
            <Button onClick={handleSave} className="w-full bg-red-600 hover:bg-red-700" disabled={!form.musteriId || !form.tutar}>Kaydet</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Card><CardContent className="p-0">
        <Table>
          <TableHeader><TableRow><TableHead>Tarih</TableHead><TableHead>Belge No</TableHead><TableHead>Açıklama</TableHead><TableHead className="text-right">Borç</TableHead><TableHead className="text-right">Alacak</TableHead></TableRow></TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center text-gray-500 py-8">İşlem bulunamadı.</TableCell></TableRow>
            ) : filtered.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="text-sm">{c.tarih ? format(c.tarih.toDate(), "dd.MM.yyyy", { locale: tr }) : "-"}</TableCell>
                <TableCell>{c.belgeNo || "-"}</TableCell>
                <TableCell>{c.aciklama}</TableCell>
                <TableCell className="text-right text-red-600">{c.islemTipi === "borc" ? `${c.tutar.toLocaleString("tr-TR")} ₺` : ""}</TableCell>
                <TableCell className="text-right text-green-600">{c.islemTipi === "alacak" ? `${c.tutar.toLocaleString("tr-TR")} ₺` : ""}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>
    </div>
  );
}
