"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, deleteDoc, collection, query, where, getDocs, serverTimestamp } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Trash2, Save, Edit2 } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale/tr";
import type { Musteri, Tup } from "@/types";

export default function MusteriDetayPage() {
  const { id } = useParams<{ id: string }>();
  const { userData } = useAuth();
  const router = useRouter();
  const [musteri, setMusteri] = useState<Musteri | null>(null);
  const [tupler, setTupler] = useState<Tup[]>([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      const d = await getDoc(doc(db, "musteriler", id));
      if (d.exists()) {
        const data = { id: d.id, ...d.data() } as Musteri;
        setMusteri(data);
        setForm({ firmaAdi: data.firmaAdi, yetkili: data.yetkili, telefon: data.telefon, email: data.email, adres: data.adres, il: data.il, ilce: data.ilce });
      }
      const tSnap = await getDocs(query(collection(db, "tupler"), where("musteriId", "==", id)));
      setTupler(tSnap.docs.map((d) => ({ id: d.id, ...d.data() }) as Tup));
      setLoading(false);
    };
    load();
  }, [id]);

  const handleSave = async () => {
    await updateDoc(doc(db, "musteriler", id), { ...form, updatedAt: serverTimestamp() });
    setEditing(false);
    setMusteri((p) => p ? { ...p, ...form } : p);
  };

  const handleDelete = async () => {
    if (!confirm("Bu müşteriyi silmek istediğinize emin misiniz?")) return;
    await deleteDoc(doc(db, "musteriler", id));
    router.push("/dashboard/musteriler");
  };

  const askida = userData?.hesapDurumu === "askida";
  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" /></div>;
  if (!musteri) return <div className="text-center py-12 text-gray-500">Müşteri bulunamadı.</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold">{musteri.firmaAdi}</h1>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Müşteri Bilgileri</CardTitle>
          <div className="flex gap-2">
            {editing ? (
              <Button size="sm" onClick={handleSave} disabled={askida}><Save className="h-4 w-4 mr-1" />Kaydet</Button>
            ) : (
              <Button size="sm" variant="outline" onClick={() => setEditing(true)} disabled={askida}><Edit2 className="h-4 w-4 mr-1" />Düzenle</Button>
            )}
            <Button size="sm" variant="destructive" onClick={handleDelete} disabled={askida}><Trash2 className="h-4 w-4" /></Button>
          </div>
        </CardHeader>
        <CardContent>
          {editing ? (
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(form).map(([k, v]) => (
                <div key={k} className="space-y-1">
                  <Label className="capitalize">{k}</Label>
                  <Input value={v as string} onChange={(e) => setForm((p: any) => ({ ...p, [k]: e.target.value }))} />
                </div>
              ))}
            </div>
          ) : (
            <dl className="grid grid-cols-2 gap-4 text-sm">
              {[["Firma Adı", musteri.firmaAdi], ["Yetkili", musteri.yetkili], ["Telefon", musteri.telefon], ["Email", musteri.email], ["Adres", musteri.adres], ["İl", musteri.il], ["İlçe", musteri.ilce]].map(([l, v]) => (
                <div key={l}><dt className="text-gray-500">{l}</dt><dd className="font-medium">{v || "-"}</dd></div>
              ))}
            </dl>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Tüpler ({tupler.length})</CardTitle></CardHeader>
        <CardContent>
          {tupler.length === 0 ? <p className="text-gray-500 text-sm">Bu müşteriye ait tüp yok.</p> : (
            <Table>
              <TableHeader><TableRow><TableHead>Seri No</TableHead><TableHead>Tip</TableHead><TableHead>Kapasite</TableHead><TableHead>Durum</TableHead></TableRow></TableHeader>
              <TableBody>
                {tupler.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium">{t.seriNo}</TableCell>
                    <TableCell><Badge variant="outline">{t.tip}</Badge></TableCell>
                    <TableCell>{t.kapasite}</TableCell>
                    <TableCell>{t.durum}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
