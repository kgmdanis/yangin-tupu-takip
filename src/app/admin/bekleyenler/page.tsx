"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, doc, updateDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { tr } from "date-fns/locale/tr";
import type { User } from "@/types";

export default function BekleyenlerPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const snap = await getDocs(query(collection(db, "users"), where("hesapDurumu", "==", "beklemede")));
    setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as User));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const aktifEt = async (u: User) => {
    const now = new Date();
    const bitis = new Date(now);
    if (u.kullaniciTipi === "dolumcu") bitis.setMonth(bitis.getMonth() + 1);
    else bitis.setFullYear(bitis.getFullYear() + 1);

    await updateDoc(doc(db, "users", u.id), {
      hesapDurumu: "aktif",
      paketBaslangic: Timestamp.fromDate(now),
      paketBitis: Timestamp.fromDate(bitis),
      updatedAt: serverTimestamp(),
    });
    load();
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" /></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Ödeme Bekleyenler ({users.length})</h1>
      <Card><CardContent className="p-0">
        <Table>
          <TableHeader><TableRow><TableHead>Firma</TableHead><TableHead>Tip</TableHead><TableHead>Paket</TableHead><TableHead>Kayıt Tarihi</TableHead><TableHead>İşlem</TableHead></TableRow></TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center text-gray-500 py-8">Bekleyen kayıt yok.</TableCell></TableRow>
            ) : users.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">{u.firmaAdi}</TableCell>
                <TableCell>{u.kullaniciTipi}</TableCell>
                <TableCell>{u.paket}</TableCell>
                <TableCell className="text-sm">{u.createdAt ? format(u.createdAt.toDate(), "dd.MM.yyyy", { locale: tr }) : "-"}</TableCell>
                <TableCell><Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => aktifEt(u)}>Aktif Et</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>
    </div>
  );
}
