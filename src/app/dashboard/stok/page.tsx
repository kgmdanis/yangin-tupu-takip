"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { PAKET_LIMITLERI, Stok, StokKategori } from "@/types";

export default function StokPage() {
  const { userData } = useAuth();
  const [stoklar, setStoklar] = useState<Stok[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<StokKategori>("tup");
  const [form, setForm] = useState({ urunAdi: "", urunKodu: "", miktar: 0, birim: "adet", minimumStok: 0 });

  const hasAccess = PAKET_LIMITLERI[userData?.paket || "starter"]?.stok;

  const load = async () => {
    if (!userData) return;
    const q = query(collection(db, "stok"), where("ownerId", "==", userData.id));
    const snap = await getDocs(q);
    setStoklar(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Stok));
    setLoading(false);
  };

  useEffect(() => { load(); }, [userData]);

  if (!hasAccess) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold mb-4">Stok Yönetimi</h1>
        <p className="text-gray-500">Bu özellik Professional ve üzeri paketlerde kullanılabilir.</p>
      </div>
    );
  }

  const filtered = stoklar.filter((s) => s.kategori === activeTab);
  const askida = userData?.hesapDurumu === "askida";

  const handleSave = async () => {
    if (!userData) return;
    const data = { ...form, kategori: activeTab, ownerId: userData.id, tip: null, kapasite: null, durum: null, updatedAt: serverTimestamp() };
    if (editId) {
      await updateDoc(doc(db, "stok", editId), data);
    } else {
      await addDoc(collection(db, "stok"), { ...data, createdAt: serverTimestamp() });
    }
    setDialogOpen(false);
    setEditId(null);
    setForm({ urunAdi: "", urunKodu: "", miktar: 0, birim: "adet", minimumStok: 0 });
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Silmek istediğinize emin misiniz?")) return;
    await deleteDoc(doc(db, "stok", id));
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Stok Yönetimi</h1>
        <Button className="bg-red-600 hover:bg-red-700" onClick={() => { setEditId(null); setForm({ urunAdi: "", urunKodu: "", miktar: 0, birim: "adet", minimumStok: 0 }); setDialogOpen(true); }} disabled={askida}>
          <Plus className="h-4 w-4 mr-2" />Yeni Ekle
        </Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editId ? "Düzenle" : "Yeni Stok Ekle"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Ürün Adı *</Label><Input value={form.urunAdi} onChange={(e) => setForm({ ...form, urunAdi: e.target.value })} /></div>
            <div className="space-y-2"><Label>Ürün Kodu</Label><Input value={form.urunKodu} onChange={(e) => setForm({ ...form, urunKodu: e.target.value })} /></div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2"><Label>Miktar</Label><Input type="number" value={form.miktar} onChange={(e) => setForm({ ...form, miktar: +e.target.value })} /></div>
              <div className="space-y-2"><Label>Birim</Label><Input value={form.birim} onChange={(e) => setForm({ ...form, birim: e.target.value })} /></div>
              <div className="space-y-2"><Label>Min Stok</Label><Input type="number" value={form.minimumStok} onChange={(e) => setForm({ ...form, minimumStok: +e.target.value })} /></div>
            </div>
            <Button onClick={handleSave} className="w-full bg-red-600 hover:bg-red-700" disabled={!form.urunAdi}>Kaydet</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as StokKategori)}>
        <TabsList>
          <TabsTrigger value="tup">Tüpler</TabsTrigger>
          <TabsTrigger value="yedekParca">Yedek Parçalar</TabsTrigger>
          <TabsTrigger value="dolumMalzemesi">Dolum Malzemeleri</TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab}>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader><TableRow><TableHead>Ürün Adı</TableHead><TableHead>Kod</TableHead><TableHead>Miktar</TableHead><TableHead>Birim</TableHead><TableHead>Min Stok</TableHead><TableHead>İşlem</TableHead></TableRow></TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow><TableCell colSpan={6} className="text-center text-gray-500 py-8">Stok bulunamadı.</TableCell></TableRow>
                  ) : filtered.map((s) => (
                    <TableRow key={s.id} className={s.miktar < s.minimumStok ? "bg-red-50" : ""}>
                      <TableCell className="font-medium">{s.urunAdi}</TableCell>
                      <TableCell>{s.urunKodu}</TableCell>
                      <TableCell className={s.miktar < s.minimumStok ? "text-red-600 font-bold" : ""}>{s.miktar}</TableCell>
                      <TableCell>{s.birim}</TableCell>
                      <TableCell>{s.minimumStok}</TableCell>
                      <TableCell className="space-x-1">
                        <Button size="sm" variant="ghost" onClick={() => { setEditId(s.id); setForm({ urunAdi: s.urunAdi, urunKodu: s.urunKodu, miktar: s.miktar, birim: s.birim, minimumStok: s.minimumStok }); setDialogOpen(true); }} disabled={askida}><Edit2 className="h-4 w-4" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(s.id)} disabled={askida}><Trash2 className="h-4 w-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
