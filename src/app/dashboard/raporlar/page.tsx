"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, FileSpreadsheet, Calendar, Users, Activity } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale/tr";
import type { Tup, Islem, Musteri } from "@/types";

function downloadCSV(filename: string, headers: string[], rows: string[][]) {
  const bom = "\uFEFF";
  const csv = [headers.join(";"), ...rows.map((r) => r.join(";"))].join("\n");
  const blob = new Blob([bom + csv], { type: "text/csv;charset=utf-8;" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
}

export default function RaporlarPage() {
  const { userData } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [tableData, setTableData] = useState<{ headers: string[]; rows: string[][] } | null>(null);

  const fmtTs = (ts: any) => ts ? format(ts.toDate(), "dd.MM.yyyy", { locale: tr }) : "-";

  const generateTupListesi = async () => {
    if (!userData) return;
    setLoading("tup");
    const snap = await getDocs(query(collection(db, "tupler"), where("ownerId", "==", userData.id)));
    const tupler = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Tup);
    const headers = ["Seri No", "Tip", "Kapasite", "Marka", "Konum", "Son Dolum", "Sonraki Dolum", "Durum"];
    const rows = tupler.map((t) => [t.seriNo, t.tip, t.kapasite, t.marka, t.konum || "", fmtTs(t.sonDolumTarihi), fmtTs(t.sonrakiDolumTarihi), t.durum]);
    setTableData({ headers, rows });
    downloadCSV("tup-listesi.csv", headers, rows);
    setLoading(null);
  };

  const generateBakimTakvimi = async () => {
    if (!userData) return;
    setLoading("bakim");
    const snap = await getDocs(query(collection(db, "tupler"), where("ownerId", "==", userData.id)));
    const tupler = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Tup)
      .filter((t) => t.sonrakiDolumTarihi)
      .sort((a, b) => a.sonrakiDolumTarihi!.toMillis() - b.sonrakiDolumTarihi!.toMillis());
    const headers = ["Seri No", "Tip", "Kapasite", "Sonraki Dolum", "Durum"];
    const rows = tupler.map((t) => [t.seriNo, t.tip, t.kapasite, fmtTs(t.sonrakiDolumTarihi), t.durum]);
    setTableData({ headers, rows });
    downloadCSV("bakim-takvimi.csv", headers, rows);
    setLoading(null);
  };

  const generateIslemGecmisi = async () => {
    if (!userData) return;
    setLoading("islem");
    const snap = await getDocs(query(collection(db, "islemler"), where("ownerId", "==", userData.id), orderBy("createdAt", "desc")));
    const islemler = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Islem);
    const headers = ["Tarih", "İşlem Tipi", "Personel", "Notlar"];
    const rows = islemler.map((i) => [fmtTs(i.tarih), i.islemTipi, i.personelAdi, i.notlar || ""]);
    setTableData({ headers, rows });
    downloadCSV("islem-gecmisi.csv", headers, rows);
    setLoading(null);
  };

  const reports = [
    { id: "tup", title: "Tüp Listesi", desc: "Tüm tüplerin listesini Excel olarak indirin.", icon: FileSpreadsheet, action: generateTupListesi },
    { id: "bakim", title: "Bakım Takvimi", desc: "Sonraki dolum tarihine göre sıralı tüp listesi.", icon: Calendar, action: generateBakimTakvimi },
    { id: "islem", title: "İşlem Geçmişi", desc: "Tüm işlemlerin listesi.", icon: Activity, action: generateIslemGecmisi },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Raporlar</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {reports.map((r) => (
          <Card key={r.id}>
            <CardHeader><r.icon className="h-8 w-8 text-red-600 mb-2" /><CardTitle className="text-base">{r.title}</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">{r.desc}</p>
              <Button onClick={r.action} disabled={loading === r.id} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />{loading === r.id ? "Hazırlanıyor..." : "Oluştur ve İndir"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {tableData && (
        <Card>
          <CardHeader><CardTitle className="text-base">Rapor Önizleme</CardTitle></CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader><TableRow>{tableData.headers.map((h) => <TableHead key={h}>{h}</TableHead>)}</TableRow></TableHeader>
              <TableBody>
                {tableData.rows.slice(0, 20).map((row, i) => (
                  <TableRow key={i}>{row.map((cell, j) => <TableCell key={j} className="text-sm">{cell}</TableCell>)}</TableRow>
                ))}
              </TableBody>
            </Table>
            {tableData.rows.length > 20 && <p className="text-sm text-gray-500 p-4">... ve {tableData.rows.length - 20} satır daha (CSV dosyasında tamamı mevcut)</p>}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
