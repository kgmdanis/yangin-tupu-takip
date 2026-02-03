"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function YeniMusteriPage() {
  const { userData } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ firmaAdi: "", yetkili: "", telefon: "", email: "", adres: "", il: "", ilce: "", notlar: "" });

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData || userData.hesapDurumu === "askida") return;
    setLoading(true);
    try {
      await addDoc(collection(db, "musteriler"), {
        ...form, ownerId: userData.id, fabrikaUserId: null, davetGonderildi: false, davetTarihi: null,
        createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
      });
      router.push("/dashboard/musteriler");
    } catch { alert("Hata oluştu."); } finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Yeni Müşteri</h1>
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2"><Label>Firma Adı *</Label><Input value={form.firmaAdi} onChange={(e) => set("firmaAdi", e.target.value)} required /></div>
              <div className="space-y-2"><Label>Yetkili Kişi *</Label><Input value={form.yetkili} onChange={(e) => set("yetkili", e.target.value)} required /></div>
              <div className="space-y-2"><Label>Telefon</Label><Input value={form.telefon} onChange={(e) => set("telefon", e.target.value)} /></div>
              <div className="space-y-2"><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} /></div>
              <div className="space-y-2"><Label>İl</Label><Input value={form.il} onChange={(e) => set("il", e.target.value)} /></div>
              <div className="space-y-2"><Label>İlçe</Label><Input value={form.ilce} onChange={(e) => set("ilce", e.target.value)} /></div>
              <div className="space-y-2 md:col-span-2"><Label>Adres</Label><Input value={form.adres} onChange={(e) => set("adres", e.target.value)} /></div>
              <div className="space-y-2 md:col-span-2"><Label>Notlar</Label><Textarea value={form.notlar} onChange={(e) => set("notlar", e.target.value)} /></div>
            </div>
            <div className="flex gap-4 pt-4">
              <Button type="submit" className="bg-red-600 hover:bg-red-700" disabled={loading}>{loading ? "Kaydediliyor..." : "Kaydet"}</Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>İptal</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
