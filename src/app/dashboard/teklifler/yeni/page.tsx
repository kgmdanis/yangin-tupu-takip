"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, addDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import type { Musteri, TeklifKalem } from "@/types";

export default function YeniTeklifPage() {
  const { userData } = useAuth();
  const router = useRouter();
  const [musteriler, setMusteriler] = useState<Musteri[]>([]);
  const [musteriId, setMusteriId] = useState("");
  const [tarih, setTarih] = useState(new Date().toISOString().split("T")[0]);
  const [gecerlilik, setGecerlilik] = useState(() => { const d = new Date(); d.setDate(d.getDate() + 30); return d.toISOString().split("T")[0]; });
  const [kalemler, setKalemler] = useState<TeklifKalem[]>([{ aciklama: "", miktar: 1, birim: "adet", birimFiyat: 0, toplam: 0 }]);
  const [kdvOrani, setKdvOrani] = useState(20);
  const [notlar, setNotlar] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userData) return;
    getDocs(query(collection(db, "musteriler"), where("ownerId", "==", userData.id))).then((snap) =>
      setMusteriler(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Musteri))
    );
  }, [userData]);

  const updateKalem = (i: number, field: string, val: any) => {
    const next = [...kalemler];
    (next[i] as any)[field] = val;
    next[i].toplam = next[i].miktar * next[i].birimFiyat;
    setKalemler(next);
  };

  const araToplam = kalemler.reduce((s, k) => s + k.toplam, 0);
  const kdvTutar = araToplam * kdvOrani / 100;
  const genelToplam = araToplam + kdvTutar;

  const handleSubmit = async () => {
    if (!userData) return;
    setLoading(true);
    const teklifNo = `TKL-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9999)).padStart(4, "0")}`;
    try {
      await addDoc(collection(db, "teklifler"), {
        ownerId: userData.id, musteriId, teklifNo,
        tarih: Timestamp.fromDate(new Date(tarih)),
        gecerlilikTarihi: Timestamp.fromDate(new Date(gecerlilik)),
        kalemler, araToplam, kdvOrani, kdvTutar, genelToplam,
        durum: "taslak", notlar,
        createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
      });
      router.push("/dashboard/teklifler");
    } catch { alert("Hata oluştu."); } finally { setLoading(false); }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Yeni Teklif</h1>
      <Card><CardContent className="pt-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Müşteri *</Label>
            <Select value={musteriId} onValueChange={setMusteriId}>
              <SelectTrigger><SelectValue placeholder="Seçin" /></SelectTrigger>
              <SelectContent>{musteriler.map((m) => <SelectItem key={m.id} value={m.id}>{m.firmaAdi}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2"><Label>Tarih</Label><Input type="date" value={tarih} onChange={(e) => setTarih(e.target.value)} /></div>
          <div className="space-y-2"><Label>Geçerlilik</Label><Input type="date" value={gecerlilik} onChange={(e) => setGecerlilik(e.target.value)} /></div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <Label className="text-base font-semibold">Kalemler</Label>
            <Button size="sm" variant="outline" onClick={() => setKalemler([...kalemler, { aciklama: "", miktar: 1, birim: "adet", birimFiyat: 0, toplam: 0 }])}><Plus className="h-4 w-4 mr-1" />Ekle</Button>
          </div>
          <div className="space-y-2">
            {kalemler.map((k, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-end">
                <div className="col-span-4"><Input placeholder="Açıklama" value={k.aciklama} onChange={(e) => updateKalem(i, "aciklama", e.target.value)} /></div>
                <div className="col-span-2"><Input type="number" placeholder="Miktar" value={k.miktar} onChange={(e) => updateKalem(i, "miktar", +e.target.value)} /></div>
                <div className="col-span-1"><Input placeholder="Birim" value={k.birim} onChange={(e) => updateKalem(i, "birim", e.target.value)} /></div>
                <div className="col-span-2"><Input type="number" placeholder="Birim Fiyat" value={k.birimFiyat} onChange={(e) => updateKalem(i, "birimFiyat", +e.target.value)} /></div>
                <div className="col-span-2 text-right font-medium text-sm py-2">{k.toplam.toLocaleString("tr-TR")} ₺</div>
                <div className="col-span-1"><Button size="sm" variant="ghost" onClick={() => setKalemler(kalemler.filter((_, j) => j !== i))} disabled={kalemler.length <= 1}><Trash2 className="h-4 w-4" /></Button></div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <div className="w-64 space-y-2 text-sm">
            <div className="flex justify-between"><span>Ara Toplam:</span><span>{araToplam.toLocaleString("tr-TR")} ₺</span></div>
            <div className="flex justify-between items-center"><span>KDV (%):</span><Input type="number" value={kdvOrani} onChange={(e) => setKdvOrani(+e.target.value)} className="w-16 h-8 text-right" /></div>
            <div className="flex justify-between"><span>KDV Tutar:</span><span>{kdvTutar.toLocaleString("tr-TR")} ₺</span></div>
            <div className="flex justify-between font-bold text-base border-t pt-2"><span>Genel Toplam:</span><span>{genelToplam.toLocaleString("tr-TR")} ₺</span></div>
          </div>
        </div>

        <div className="space-y-2"><Label>Notlar</Label><Textarea value={notlar} onChange={(e) => setNotlar(e.target.value)} /></div>

        <div className="flex gap-4">
          <Button onClick={handleSubmit} className="bg-red-600 hover:bg-red-700" disabled={loading || !musteriId}>{loading ? "Kaydediliyor..." : "Taslak Olarak Kaydet"}</Button>
          <Button variant="outline" onClick={() => router.back()}>İptal</Button>
        </div>
      </CardContent></Card>
    </div>
  );
}
