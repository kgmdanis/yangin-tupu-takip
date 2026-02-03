"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { tr } from "date-fns/locale/tr";

export default function AyarlarPage() {
  const { userData, refreshUserData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ firmaAdi: "", yetkili: "", telefon: "", adres: "", il: "", ilce: "", vergiDairesi: "", vergiNo: "" });

  useEffect(() => {
    if (userData) {
      setForm({
        firmaAdi: userData.firmaAdi || "", yetkili: userData.yetkili || "", telefon: userData.telefon || "",
        adres: userData.adres || "", il: userData.il || "", ilce: userData.ilce || "",
        vergiDairesi: userData.vergiDairesi || "", vergiNo: userData.vergiNo || "",
      });
    }
  }, [userData]);

  const handleSave = async () => {
    if (!userData) return;
    setLoading(true);
    try {
      await updateDoc(doc(db, "users", userData.id), { ...form, updatedAt: serverTimestamp() });
      await refreshUserData();
      alert("Ayarlar kaydedildi.");
    } catch { alert("Hata oluştu."); } finally { setLoading(false); }
  };

  const askida = userData?.hesapDurumu === "askida";
  const fmtTs = (ts: any) => ts ? format(ts.toDate(), "dd.MM.yyyy", { locale: tr }) : "-";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Ayarlar</h1>

      <Card>
        <CardHeader><CardTitle>Firma Bilgileri</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2"><Label>Firma Adı</Label><Input value={form.firmaAdi} onChange={(e) => setForm({ ...form, firmaAdi: e.target.value })} /></div>
            <div className="space-y-2"><Label>Yetkili Kişi</Label><Input value={form.yetkili} onChange={(e) => setForm({ ...form, yetkili: e.target.value })} /></div>
            <div className="space-y-2"><Label>Telefon</Label><Input value={form.telefon} onChange={(e) => setForm({ ...form, telefon: e.target.value })} /></div>
            <div className="space-y-2 md:col-span-2"><Label>Adres</Label><Input value={form.adres} onChange={(e) => setForm({ ...form, adres: e.target.value })} /></div>
            <div className="space-y-2"><Label>İl</Label><Input value={form.il} onChange={(e) => setForm({ ...form, il: e.target.value })} /></div>
            <div className="space-y-2"><Label>İlçe</Label><Input value={form.ilce} onChange={(e) => setForm({ ...form, ilce: e.target.value })} /></div>
            <div className="space-y-2"><Label>Vergi Dairesi</Label><Input value={form.vergiDairesi} onChange={(e) => setForm({ ...form, vergiDairesi: e.target.value })} /></div>
            <div className="space-y-2"><Label>Vergi No</Label><Input value={form.vergiNo} onChange={(e) => setForm({ ...form, vergiNo: e.target.value })} /></div>
          </div>
          <Button onClick={handleSave} className="mt-6 bg-red-600 hover:bg-red-700" disabled={loading || askida}>{loading ? "Kaydediliyor..." : "Kaydet"}</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Paket Bilgisi</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div><span className="text-gray-500">Paket:</span> <Badge>{userData?.paket}</Badge></div>
            <div><span className="text-gray-500">Başlangıç:</span> {fmtTs(userData?.paketBaslangic)}</div>
            <div><span className="text-gray-500">Bitiş:</span> {fmtTs(userData?.paketBitis)}</div>
            <div><span className="text-gray-500">Durum:</span> <Badge variant={userData?.hesapDurumu === "aktif" ? "default" : "secondary"}>{userData?.hesapDurumu}</Badge></div>
          </div>
          <p className="text-sm text-gray-500 mt-4">Paket değişikliği için: <strong>info@kgmdijital.com</strong></p>
        </CardContent>
      </Card>
    </div>
  );
}
