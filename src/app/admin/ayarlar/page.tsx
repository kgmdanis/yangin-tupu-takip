"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

export default function AdminAyarlarPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fiyatlar, setFiyatlar] = useState({
    dolumcu_starter: "750", dolumcu_professional: "2500", dolumcu_enterprise: "5000", fabrika_premium: "5000",
    dolumcu_periyot: "ay", fabrika_periyot: "yıl",
  });
  const [iletisim, setIletisim] = useState({ telefon: "0332 XXX XX XX", email: "info@kgmdijital.com", adres: "Konya, Türkiye" });
  const [askidaUyari, setAskidaUyari] = useState("Hesabınız askıya alınmıştır. Ödeme için bizimle iletişime geçin.");

  useEffect(() => {
    const load = async () => {
      const d = await getDoc(doc(db, "ayarlar", "site_ayarlari"));
      if (d.exists()) {
        const data = d.data();
        if (data.fiyatlar) setFiyatlar(data.fiyatlar);
        if (data.iletisim) setIletisim(data.iletisim);
        if (data.askidaUyari) setAskidaUyari(data.askidaUyari);
      }
      setLoading(false);
    };
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await setDoc(doc(db, "ayarlar", "site_ayarlari"), {
      fiyatlar, iletisim, askidaUyari, updatedAt: serverTimestamp(),
    });
    setSaving(false);
    alert("Ayarlar kaydedildi.");
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" /></div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Site Ayarları</h1>

      <Card>
        <CardHeader><CardTitle>Fiyatlar (Landing Page)</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Dolumcu Starter (₺)</Label><Input value={fiyatlar.dolumcu_starter} onChange={(e) => setFiyatlar({ ...fiyatlar, dolumcu_starter: e.target.value })} /></div>
            <div className="space-y-2"><Label>Dolumcu Professional (₺)</Label><Input value={fiyatlar.dolumcu_professional} onChange={(e) => setFiyatlar({ ...fiyatlar, dolumcu_professional: e.target.value })} /></div>
            <div className="space-y-2"><Label>Dolumcu Enterprise (₺)</Label><Input value={fiyatlar.dolumcu_enterprise} onChange={(e) => setFiyatlar({ ...fiyatlar, dolumcu_enterprise: e.target.value })} /></div>
            <div className="space-y-2"><Label>Fabrika Premium (₺)</Label><Input value={fiyatlar.fabrika_premium} onChange={(e) => setFiyatlar({ ...fiyatlar, fabrika_premium: e.target.value })} /></div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>İletişim Bilgileri</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2"><Label>Telefon</Label><Input value={iletisim.telefon} onChange={(e) => setIletisim({ ...iletisim, telefon: e.target.value })} /></div>
          <div className="space-y-2"><Label>Email</Label><Input value={iletisim.email} onChange={(e) => setIletisim({ ...iletisim, email: e.target.value })} /></div>
          <div className="space-y-2"><Label>Adres</Label><Input value={iletisim.adres} onChange={(e) => setIletisim({ ...iletisim, adres: e.target.value })} /></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Askıda Hesap Uyarı Metni</CardTitle></CardHeader>
        <CardContent>
          <Textarea value={askidaUyari} onChange={(e) => setAskidaUyari(e.target.value)} rows={3} />
        </CardContent>
      </Card>

      <Button onClick={handleSave} className="bg-red-600 hover:bg-red-700" disabled={saving}>{saving ? "Kaydediliyor..." : "Tüm Ayarları Kaydet"}</Button>
    </div>
  );
}
