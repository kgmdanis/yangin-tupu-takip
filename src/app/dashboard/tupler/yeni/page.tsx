"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, addDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TUP_KAPASITELERI, TupTipi, Musteri, PAKET_LIMITLERI } from "@/types";

export default function YeniTupPage() {
  const { userData } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [musteriler, setMusteriler] = useState<Musteri[]>([]);

  const [seriNo, setSeriNo] = useState("");
  const [tip, setTip] = useState<TupTipi>("KKT");
  const [kapasite, setKapasite] = useState("");
  const [marka, setMarka] = useState("");
  const [musteriId, setMusteriId] = useState("");
  const [uretimTarihi, setUretimTarihi] = useState("");
  const [sonDolumTarihi, setSonDolumTarihi] = useState("");
  const [sonrakiDolumTarihi, setSonrakiDolumTarihi] = useState("");
  const [hidroTestTarihi, setHidroTestTarihi] = useState("");
  const [konum, setKonum] = useState("");

  useEffect(() => {
    if (!userData) return;
    const loadMusteriler = async () => {
      const q = query(collection(db, "musteriler"), where("ownerId", "==", userData.id));
      const snap = await getDocs(q);
      setMusteriler(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Musteri));
    };
    loadMusteriler();
  }, [userData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData || userData.hesapDurumu === "askida") return;
    setLoading(true);
    try {
      const toTs = (d: string) => d ? Timestamp.fromDate(new Date(d)) : null;
      await addDoc(collection(db, "tupler"), {
        ownerId: userData.id,
        musteriId: musteriId || null,
        seriNo,
        tip,
        kapasite,
        marka,
        uretimTarihi: toTs(uretimTarihi),
        hidroTestTarihi: toTs(hidroTestTarihi),
        sonrakiHidroTest: null,
        sonDolumTarihi: toTs(sonDolumTarihi),
        sonrakiDolumTarihi: toTs(sonrakiDolumTarihi),
        sonKontrolTarihi: null,
        konum,
        durum: "aktif",
        qrKod: crypto.randomUUID(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      router.push("/dashboard/tupler");
    } catch (err) {
      console.error(err);
      alert("Tüp eklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Yeni Tüp Ekle</h1>
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Seri No *</Label>
                <Input value={seriNo} onChange={(e) => setSeriNo(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Marka</Label>
                <Input value={marka} onChange={(e) => setMarka(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Tip *</Label>
                <Select value={tip} onValueChange={(v) => { setTip(v as TupTipi); setKapasite(""); }}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="KKT">KKT (Kuru Kimyevi Toz)</SelectItem>
                    <SelectItem value="SK">SK (Su/Köpüklü)</SelectItem>
                    <SelectItem value="CO2">CO2 (Karbondioksit)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Kapasite *</Label>
                <Select value={kapasite} onValueChange={setKapasite}>
                  <SelectTrigger><SelectValue placeholder="Seçin" /></SelectTrigger>
                  <SelectContent>
                    {TUP_KAPASITELERI[tip].map((k) => (
                      <SelectItem key={k} value={k}>{k}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {userData?.kullaniciTipi === "dolumcu" && (
                <div className="space-y-2 md:col-span-2">
                  <Label>Müşteri</Label>
                  <Select value={musteriId} onValueChange={setMusteriId}>
                    <SelectTrigger><SelectValue placeholder="Müşteri seçin (opsiyonel)" /></SelectTrigger>
                    <SelectContent>
                      {musteriler.map((m) => (
                        <SelectItem key={m.id} value={m.id}>{m.firmaAdi}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="space-y-2">
                <Label>Üretim Tarihi</Label>
                <Input type="date" value={uretimTarihi} onChange={(e) => setUretimTarihi(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Hidro Test Tarihi</Label>
                <Input type="date" value={hidroTestTarihi} onChange={(e) => setHidroTestTarihi(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Son Dolum Tarihi</Label>
                <Input type="date" value={sonDolumTarihi} onChange={(e) => setSonDolumTarihi(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Sonraki Dolum Tarihi</Label>
                <Input type="date" value={sonrakiDolumTarihi} onChange={(e) => setSonrakiDolumTarihi(e.target.value)} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Konum</Label>
                <Input value={konum} onChange={(e) => setKonum(e.target.value)} placeholder="Ör: A Blok 2. Kat" />
              </div>
            </div>
            <div className="flex gap-4 pt-4">
              <Button type="submit" className="bg-red-600 hover:bg-red-700" disabled={loading || !seriNo || !kapasite}>
                {loading ? "Kaydediliyor..." : "Kaydet"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>İptal</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
