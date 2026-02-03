"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, query, where, getDocs, addDoc, deleteDoc, serverTimestamp, orderBy, Timestamp } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Download, Trash2, Plus } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale/tr";
import QRCode from "qrcode";
import type { Tup, Islem, Personel, IslemTipi } from "@/types";

const islemLabels: Record<string, string> = {
  dolum: "Dolum", bakim: "Bakım", hidroTest: "Hidro Test", kontrol: "Kontrol", satis: "Satış", hurda: "Hurda",
};

export default function TupDetayPage() {
  const { id } = useParams<{ id: string }>();
  const { userData } = useAuth();
  const router = useRouter();
  const [tup, setTup] = useState<Tup | null>(null);
  const [islemler, setIslemler] = useState<Islem[]>([]);
  const [personeller, setPersoneller] = useState<Personel[]>([]);
  const [qrUrl, setQrUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [islemForm, setIslemForm] = useState({ islemTipi: "dolum" as IslemTipi, personelId: "", notlar: "", tarih: "" });

  useEffect(() => {
    if (!id || !userData) return;
    const load = async () => {
      const tupDoc = await getDoc(doc(db, "tupler", id));
      if (!tupDoc.exists()) { setLoading(false); return; }
      const tupData = { id: tupDoc.id, ...tupDoc.data() } as Tup;
      setTup(tupData);

      const qr = await QRCode.toDataURL(`https://yangin.kgmdijital.com/dogrula/${tupData.qrKod}`, { width: 200 });
      setQrUrl(qr);

      const islemQ = query(collection(db, "islemler"), where("tupId", "==", id), orderBy("createdAt", "desc"));
      const islemSnap = await getDocs(islemQ);
      setIslemler(islemSnap.docs.map((d) => ({ id: d.id, ...d.data() }) as Islem));

      const perQ = query(collection(db, "personel"), where("ownerId", "==", userData.id), where("aktif", "==", true));
      const perSnap = await getDocs(perQ);
      setPersoneller(perSnap.docs.map((d) => ({ id: d.id, ...d.data() }) as Personel));

      setLoading(false);
    };
    load();
  }, [id, userData]);

  const handleIslemEkle = async () => {
    if (!tup || !userData) return;
    const personel = personeller.find((p) => p.id === islemForm.personelId);
    await addDoc(collection(db, "islemler"), {
      ownerId: userData.id,
      tupId: tup.id,
      musteriId: tup.musteriId,
      islemTipi: islemForm.islemTipi,
      tarih: islemForm.tarih ? Timestamp.fromDate(new Date(islemForm.tarih)) : serverTimestamp(),
      personelId: islemForm.personelId,
      personelAdi: personel ? `${personel.ad} ${personel.soyad}` : "",
      notlar: islemForm.notlar,
      oncekiDurum: tup.durum,
      yeniDurum: tup.durum,
      createdAt: serverTimestamp(),
    });
    setDialogOpen(false);
    setIslemForm({ islemTipi: "dolum", personelId: "", notlar: "", tarih: "" });
    // Reload
    const islemSnap = await getDocs(query(collection(db, "islemler"), where("tupId", "==", id), orderBy("createdAt", "desc")));
    setIslemler(islemSnap.docs.map((d) => ({ id: d.id, ...d.data() }) as Islem));
  };

  const handleDelete = async () => {
    if (!confirm("Bu tüpü silmek istediğinize emin misiniz?")) return;
    await deleteDoc(doc(db, "tupler", id));
    router.push("/dashboard/tupler");
  };

  const handleQrDownload = () => {
    const a = document.createElement("a");
    a.href = qrUrl;
    a.download = `QR-${tup?.seriNo || id}.png`;
    a.click();
  };

  const fmtDate = (ts: any) => ts ? format(ts.toDate(), "dd.MM.yyyy", { locale: tr }) : "-";
  const askida = userData?.hesapDurumu === "askida";

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" /></div>;
  if (!tup) return <div className="text-center py-12 text-gray-500">Tüp bulunamadı.</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold">Tüp Detay: {tup.seriNo}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader><CardTitle>Tüp Bilgileri</CardTitle></CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              {[
                ["Seri No", tup.seriNo],
                ["Tip", tup.tip],
                ["Kapasite", tup.kapasite],
                ["Marka", tup.marka],
                ["Konum", tup.konum || "-"],
                ["Durum", tup.durum],
                ["Üretim Tarihi", fmtDate(tup.uretimTarihi)],
                ["Hidro Test", fmtDate(tup.hidroTestTarihi)],
                ["Son Dolum", fmtDate(tup.sonDolumTarihi)],
                ["Sonraki Dolum", fmtDate(tup.sonrakiDolumTarihi)],
              ].map(([label, val]) => (
                <div key={label as string}>
                  <dt className="text-gray-500">{label}</dt>
                  <dd className="font-medium">{val}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>QR Kod</CardTitle></CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            {qrUrl && <img src={qrUrl} alt="QR" className="w-48 h-48" />}
            <Button variant="outline" size="sm" onClick={handleQrDownload}><Download className="h-4 w-4 mr-2" />İndir</Button>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700" disabled={askida}><Plus className="h-4 w-4 mr-2" />İşlem Ekle</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Yeni İşlem</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>İşlem Tipi</Label>
                <Select value={islemForm.islemTipi} onValueChange={(v) => setIslemForm({ ...islemForm, islemTipi: v as IslemTipi })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(islemLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Personel</Label>
                <Select value={islemForm.personelId} onValueChange={(v) => setIslemForm({ ...islemForm, personelId: v })}>
                  <SelectTrigger><SelectValue placeholder="Seçin" /></SelectTrigger>
                  <SelectContent>
                    {personeller.map((p) => <SelectItem key={p.id} value={p.id}>{p.ad} {p.soyad}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tarih</Label>
                <Input type="date" value={islemForm.tarih} onChange={(e) => setIslemForm({ ...islemForm, tarih: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Notlar</Label>
                <Textarea value={islemForm.notlar} onChange={(e) => setIslemForm({ ...islemForm, notlar: e.target.value })} />
              </div>
              <Button onClick={handleIslemEkle} className="w-full bg-red-600 hover:bg-red-700">Kaydet</Button>
            </div>
          </DialogContent>
        </Dialog>
        <Button variant="destructive" onClick={handleDelete} disabled={askida}><Trash2 className="h-4 w-4 mr-2" />Sil</Button>
      </div>

      <Card>
        <CardHeader><CardTitle>İşlem Geçmişi</CardTitle></CardHeader>
        <CardContent>
          {islemler.length === 0 ? <p className="text-gray-500 text-sm">Henüz işlem yok.</p> : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tarih</TableHead>
                  <TableHead>İşlem</TableHead>
                  <TableHead>Personel</TableHead>
                  <TableHead>Notlar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {islemler.map((i) => (
                  <TableRow key={i.id}>
                    <TableCell className="text-sm">{fmtDate(i.tarih)}</TableCell>
                    <TableCell><Badge variant="outline">{islemLabels[i.islemTipi] || i.islemTipi}</Badge></TableCell>
                    <TableCell className="text-sm">{i.personelAdi}</TableCell>
                    <TableCell className="text-sm text-gray-500">{i.notlar || "-"}</TableCell>
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
