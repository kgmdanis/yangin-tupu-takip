"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, addDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import type { Personel } from "@/types";

export default function PersonelPage() {
  const { userData } = useAuth();
  const [personeller, setPersoneller] = useState<Personel[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ ad: "", soyad: "", telefon: "", gorev: "" });

  const load = async () => {
    if (!userData) return;
    const q = query(collection(db, "personel"), where("ownerId", "==", userData.id));
    const snap = await getDocs(q);
    setPersoneller(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Personel));
    setLoading(false);
  };

  useEffect(() => { load(); }, [userData]);

  const handleSave = async () => {
    if (!userData) return;
    if (editId) {
      await updateDoc(doc(db, "personel", editId), { ...form });
    } else {
      await addDoc(collection(db, "personel"), { ...form, ownerId: userData.id, aktif: true, createdAt: serverTimestamp() });
    }
    setDialogOpen(false);
    setEditId(null);
    setForm({ ad: "", soyad: "", telefon: "", gorev: "" });
    load();
  };

  const toggleAktif = async (p: Personel) => {
    await updateDoc(doc(db, "personel", p.id), { aktif: !p.aktif });
    load();
  };

  const openEdit = (p: Personel) => {
    setEditId(p.id);
    setForm({ ad: p.ad, soyad: p.soyad, telefon: p.telefon, gorev: p.gorev });
    setDialogOpen(true);
  };

  const openNew = () => {
    setEditId(null);
    setForm({ ad: "", soyad: "", telefon: "", gorev: "" });
    setDialogOpen(true);
  };

  const askida = userData?.hesapDurumu === "askida";
  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Personel</h1>
        <Button className="bg-red-600 hover:bg-red-700" onClick={openNew} disabled={askida}><Plus className="h-4 w-4 mr-2" />Yeni Personel</Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editId ? "Personel Düzenle" : "Yeni Personel"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Ad *</Label><Input value={form.ad} onChange={(e) => setForm({ ...form, ad: e.target.value })} /></div>
            <div className="space-y-2"><Label>Soyad *</Label><Input value={form.soyad} onChange={(e) => setForm({ ...form, soyad: e.target.value })} /></div>
            <div className="space-y-2"><Label>Telefon</Label><Input value={form.telefon} onChange={(e) => setForm({ ...form, telefon: e.target.value })} /></div>
            <div className="space-y-2"><Label>Görev</Label><Input value={form.gorev} onChange={(e) => setForm({ ...form, gorev: e.target.value })} /></div>
            <Button onClick={handleSave} className="w-full bg-red-600 hover:bg-red-700" disabled={!form.ad || !form.soyad}>Kaydet</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow><TableHead>Ad Soyad</TableHead><TableHead>Telefon</TableHead><TableHead>Görev</TableHead><TableHead>Durum</TableHead><TableHead>İşlemler</TableHead></TableRow></TableHeader>
            <TableBody>
              {personeller.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center text-gray-500 py-8">Personel bulunamadı.</TableCell></TableRow>
              ) : personeller.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.ad} {p.soyad}</TableCell>
                  <TableCell>{p.telefon}</TableCell>
                  <TableCell>{p.gorev}</TableCell>
                  <TableCell><Badge variant={p.aktif ? "default" : "secondary"}>{p.aktif ? "Aktif" : "Pasif"}</Badge></TableCell>
                  <TableCell className="space-x-2">
                    <Button size="sm" variant="outline" onClick={() => openEdit(p)} disabled={askida}>Düzenle</Button>
                    <Button size="sm" variant="ghost" onClick={() => toggleAktif(p)} disabled={askida}>{p.aktif ? "Pasif Yap" : "Aktif Yap"}</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
