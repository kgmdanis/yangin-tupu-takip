"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, collection, query, where, getDocs, serverTimestamp, Timestamp } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { tr } from "date-fns/locale/tr";
import type { User, Paket, HesapDurumu } from "@/types";

export default function FirmaDetayPage() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [paket, setPaket] = useState<Paket>("starter");
  const [askidaNeden, setAskidaNeden] = useState("");
  const [bitisTarihi, setBitisTarihi] = useState("");
  const [counts, setCounts] = useState({ tup: 0, musteri: 0, islem: 0 });

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      const d = await getDoc(doc(db, "users", id));
      if (d.exists()) {
        const data = { id: d.id, ...d.data() } as User;
        setUser(data);
        setPaket(data.paket);
      }
      const [tupSnap, musteriSnap, islemSnap] = await Promise.all([
        getDocs(query(collection(db, "tupler"), where("ownerId", "==", id))),
        getDocs(query(collection(db, "musteriler"), where("ownerId", "==", id))),
        getDocs(query(collection(db, "islemler"), where("ownerId", "==", id))),
      ]);
      setCounts({ tup: tupSnap.size, musteri: musteriSnap.size, islem: islemSnap.size });
      setLoading(false);
    };
    load();
  }, [id]);

  const updateDurum = async (durum: HesapDurumu) => {
    const updates: any = { hesapDurumu: durum, updatedAt: serverTimestamp() };
    if (durum === "askida") { updates.askiyaAlmaTarihi = serverTimestamp(); updates.askiyaAlmaNedeni = askidaNeden; }
    if (durum === "aktif") { updates.askiyaAlmaTarihi = null; updates.askiyaAlmaNedeni = null; }
    await updateDoc(doc(db, "users", id), updates);
    setUser((p) => p ? { ...p, hesapDurumu: durum } : p);
  };

  const updatePaket = async () => {
    await updateDoc(doc(db, "users", id), { paket, updatedAt: serverTimestamp() });
    setUser((p) => p ? { ...p, paket } : p);
    alert("Paket güncellendi.");
  };

  const updateBitis = async () => {
    if (!bitisTarihi) return;
    await updateDoc(doc(db, "users", id), { paketBitis: Timestamp.fromDate(new Date(bitisTarihi)), updatedAt: serverTimestamp() });
    alert("Bitiş tarihi güncellendi.");
  };

  const fmtTs = (ts: any) => ts ? format(ts.toDate(), "dd.MM.yyyy", { locale: tr }) : "-";
  const durumStyle: Record<string, string> = { aktif: "bg-green-100 text-green-800", beklemede: "bg-yellow-100 text-yellow-800", askida: "bg-orange-100 text-orange-800", iptal: "bg-red-100 text-red-800" };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" /></div>;
  if (!user) return <div className="text-center py-12 text-gray-500">Firma bulunamadı.</div>;

  const dolumcuPaketler: Paket[] = ["starter", "professional", "enterprise"];
  const fabrikaPaketler: Paket[] = ["fabrika_ucretsiz", "fabrika_premium"];
  const paketOptions = user.kullaniciTipi === "dolumcu" ? dolumcuPaketler : fabrikaPaketler;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">{user.firmaAdi}</h1>

      <div className="grid grid-cols-3 gap-4">
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold">{counts.tup}</p><p className="text-xs text-gray-500">Tüp</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold">{counts.musteri}</p><p className="text-xs text-gray-500">Müşteri</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold">{counts.islem}</p><p className="text-xs text-gray-500">İşlem</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Firma Bilgileri</CardTitle></CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            {[["Yetkili", user.yetkili], ["Email", user.email], ["Telefon", user.telefon], ["İl/İlçe", `${user.il} / ${user.ilce}`], ["Vergi Dairesi", user.vergiDairesi], ["Vergi No", user.vergiNo], ["Tip", user.kullaniciTipi], ["Kayıt", fmtTs(user.createdAt)]].map(([l, v]) => (
              <div key={l as string}><dt className="text-gray-500">{l}</dt><dd className="font-medium">{v || "-"}</dd></div>
            ))}
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Paket Yönetimi</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Mevcut:</span>
            <Badge>{user.paket}</Badge>
            <span className={`px-2 py-1 rounded text-xs font-medium ${durumStyle[user.hesapDurumu]}`}>{user.hesapDurumu}</span>
          </div>

          <div className="flex gap-2 items-end">
            <div className="space-y-1 flex-1"><Label>Paket Değiştir</Label>
              <Select value={paket} onValueChange={(v) => setPaket(v as Paket)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{paketOptions.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <Button onClick={updatePaket} className="bg-red-600 hover:bg-red-700">Kaydet</Button>
          </div>

          <div className="flex gap-2 items-end">
            <div className="space-y-1 flex-1"><Label>Paket Bitiş Tarihi Uzat</Label><Input type="date" value={bitisTarihi} onChange={(e) => setBitisTarihi(e.target.value)} /></div>
            <Button onClick={updateBitis} variant="outline">Uzat</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Durum Değiştir</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Button onClick={() => updateDurum("aktif")} className="bg-green-600 hover:bg-green-700" disabled={user.hesapDurumu === "aktif"}>Aktif Et</Button>
            <Button onClick={() => updateDurum("iptal")} variant="destructive" disabled={user.hesapDurumu === "iptal"}>İptal Et</Button>
          </div>
          <div className="space-y-2">
            <Label>Askıya Al (Neden)</Label>
            <Textarea value={askidaNeden} onChange={(e) => setAskidaNeden(e.target.value)} placeholder="Askıya alma nedeni..." />
            <Button onClick={() => updateDurum("askida")} variant="outline" disabled={user.hesapDurumu === "askida"}>Askıya Al</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
