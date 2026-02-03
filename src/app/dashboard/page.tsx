"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy, limit, Timestamp } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Cylinder, AlertTriangle, AlertOctagon, Activity, Package } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale/tr";
import { PAKET_LIMITLERI } from "@/types";
import type { Tup, Islem } from "@/types";

export default function DashboardPage() {
  const { userData } = useAuth();
  const [stats, setStats] = useState({ toplam: 0, yaklasan: 0, geciken: 0, buAy: 0 });
  const [sonIslemler, setSonIslemler] = useState<Islem[]>([]);
  const [yaklesanTupler, setYaklesanTupler] = useState<Tup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userData) return;
    const load = async () => {
      try {
        const now = new Date();
        const thirtyDaysLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

        // Fetch tüpler
        const tupQ = query(collection(db, "tupler"), where("ownerId", "==", userData.id));
        const tupSnap = await getDocs(tupQ);
        const tupler = tupSnap.docs.map((d) => ({ id: d.id, ...d.data() }) as Tup);

        let yaklasan = 0;
        let geciken = 0;
        const yaklesanList: Tup[] = [];

        tupler.forEach((t) => {
          if (t.sonrakiDolumTarihi) {
            const tarih = t.sonrakiDolumTarihi.toDate();
            if (tarih < now) {
              geciken++;
            } else if (tarih <= thirtyDaysLater) {
              yaklasan++;
              yaklesanList.push(t);
            }
          }
        });

        // Fetch islemler this month
        const islemQ = query(
          collection(db, "islemler"),
          where("ownerId", "==", userData.id),
          where("createdAt", ">=", Timestamp.fromDate(monthStart))
        );
        const islemSnap = await getDocs(islemQ);

        // Son islemler
        const sonQ = query(
          collection(db, "islemler"),
          where("ownerId", "==", userData.id),
          orderBy("createdAt", "desc"),
          limit(5)
        );
        const sonSnap = await getDocs(sonQ);

        setStats({
          toplam: tupler.length,
          yaklasan,
          geciken,
          buAy: islemSnap.size,
        });
        setSonIslemler(sonSnap.docs.map((d) => ({ id: d.id, ...d.data() }) as Islem));
        setYaklesanTupler(yaklesanList.slice(0, 5));
      } catch (err) {
        console.error("Dashboard verisi yüklenemedi:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" />
      </div>
    );
  }

  const paketInfo = PAKET_LIMITLERI[userData?.paket || "starter"];

  const cards = [
    { label: "Toplam Tüp", value: stats.toplam, icon: Cylinder, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Bakımı Yaklaşan", value: stats.yaklasan, icon: AlertTriangle, color: "text-yellow-600", bg: "bg-yellow-50" },
    { label: "Bakımı Geciken", value: stats.geciken, icon: AlertOctagon, color: "text-red-600", bg: "bg-red-50" },
    { label: "Bu Ay İşlemler", value: stats.buAy, icon: Activity, color: "text-green-600", bg: "bg-green-50" },
  ];

  const islemTipiLabel: Record<string, string> = {
    dolum: "Dolum", bakim: "Bakım", hidroTest: "Hidro Test", kontrol: "Kontrol", satis: "Satış", hurda: "Hurda",
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardContent className="flex items-center gap-4 p-6">
              <div className={`p-3 rounded-lg ${c.bg}`}>
                <c.icon className={`h-6 w-6 ${c.color}`} />
              </div>
              <div>
                <p className="text-sm text-gray-500">{c.label}</p>
                <p className="text-2xl font-bold">{c.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Son İşlemler</CardTitle>
          </CardHeader>
          <CardContent>
            {sonIslemler.length === 0 ? (
              <p className="text-gray-500 text-sm">Henüz işlem yok.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tarih</TableHead>
                    <TableHead>İşlem</TableHead>
                    <TableHead>Personel</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sonIslemler.map((i) => (
                    <TableRow key={i.id}>
                      <TableCell className="text-sm">
                        {i.tarih ? format(i.tarih.toDate(), "dd MMM yyyy", { locale: tr }) : "-"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{islemTipiLabel[i.islemTipi] || i.islemTipi}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">{i.personelAdi}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Bakımı Yaklaşan Tüpler</CardTitle>
          </CardHeader>
          <CardContent>
            {yaklesanTupler.length === 0 ? (
              <p className="text-gray-500 text-sm">Bakımı yaklaşan tüp yok.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Seri No</TableHead>
                    <TableHead>Tip</TableHead>
                    <TableHead>Sonraki Dolum</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {yaklesanTupler.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="font-medium text-sm">{t.seriNo}</TableCell>
                      <TableCell><Badge variant="outline">{t.tip}</Badge></TableCell>
                      <TableCell className="text-sm">
                        {t.sonrakiDolumTarihi ? format(t.sonrakiDolumTarihi.toDate(), "dd MMM yyyy", { locale: tr }) : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
