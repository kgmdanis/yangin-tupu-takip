"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, getDoc, limit } from "firebase/firestore";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale/tr";
import type { Tup, User, Musteri } from "@/types";

export default function DogrulaPage() {
  const { qrKod } = useParams<{ qrKod: string }>();
  const [tup, setTup] = useState<Tup | null>(null);
  const [firma, setFirma] = useState<string>("");
  const [musteri, setMusteri] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [found, setFound] = useState(false);

  useEffect(() => {
    if (!qrKod) return;
    const load = async () => {
      const q = query(collection(db, "tupler"), where("qrKod", "==", qrKod), limit(1));
      const snap = await getDocs(q);
      if (snap.empty) { setLoading(false); return; }
      const tupData = { id: snap.docs[0].id, ...snap.docs[0].data() } as Tup;
      setTup(tupData);
      setFound(true);

      const ownerDoc = await getDoc(doc(db, "users", tupData.ownerId));
      if (ownerDoc.exists()) setFirma((ownerDoc.data() as User).firmaAdi);

      if (tupData.musteriId) {
        const mDoc = await getDoc(doc(db, "musteriler", tupData.musteriId));
        if (mDoc.exists()) setMusteri((mDoc.data() as Musteri).firmaAdi);
      }
      setLoading(false);
    };
    load();
  }, [qrKod]);

  const fmtTs = (ts: any) => ts ? format(ts.toDate(), "dd.MM.yyyy", { locale: tr }) : "-";

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" /></div>;

  const durumColor: Record<string, string> = { aktif: "bg-green-100 text-green-800", pasif: "bg-gray-100 text-gray-800", hurda: "bg-red-100 text-red-800", kayip: "bg-yellow-100 text-yellow-800" };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          {found && tup ? (
            <div className="space-y-6">
              <div className="text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-3" />
                <h1 className="text-xl font-bold text-green-700">Doğrulanmış Yangın Söndürme Cihazı</h1>
              </div>
              <dl className="space-y-3 text-sm">
                {[
                  ["Dolumcu / Firma", firma],
                  musteri ? ["Müşteri", musteri] : null,
                  ["Tüp Tipi", `${tup.tip} - ${tup.kapasite}`],
                  ["Seri No", tup.seriNo],
                  ["Marka", tup.marka],
                  ["Son Dolum Tarihi", fmtTs(tup.sonDolumTarihi)],
                  ["Sonraki Dolum Tarihi", fmtTs(tup.sonrakiDolumTarihi)],
                  ["Hidro Test Tarihi", fmtTs(tup.hidroTestTarihi)],
                  ["Konum", tup.konum || "-"],
                ].filter((x): x is string[] => x !== null).map(([label, val]) => (
                  <div key={label as string} className="flex justify-between border-b pb-2">
                    <dt className="text-gray-500">{label}</dt>
                    <dd className="font-medium text-right">{val}</dd>
                  </div>
                ))}
                <div className="flex justify-between">
                  <dt className="text-gray-500">Durum</dt>
                  <dd><span className={`px-2 py-1 rounded text-xs font-medium ${durumColor[tup.durum]}`}>{tup.durum}</span></dd>
                </div>
              </dl>
            </div>
          ) : (
            <div className="text-center py-8">
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-3" />
              <h1 className="text-xl font-bold text-red-700">Bu QR kod sistemde bulunamadı</h1>
              <p className="text-gray-500 mt-2 text-sm">Lütfen QR kodu tekrar okutunuz.</p>
            </div>
          )}
          <div className="text-center mt-8 pt-4 border-t text-xs text-gray-400">
            Yangın Tüpü Takip Sistemi - KGM Dijital
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
