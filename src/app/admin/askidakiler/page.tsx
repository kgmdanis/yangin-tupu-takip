"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { tr } from "date-fns/locale/tr";
import type { User } from "@/types";

export default function AskidakilerPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const snap = await getDocs(query(collection(db, "users"), where("hesapDurumu", "==", "askida")));
    setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as User));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const changeDurum = async (id: string, durum: string) => {
    await updateDoc(doc(db, "users", id), {
      hesapDurumu: durum,
      ...(durum === "aktif" ? { askiyaAlmaTarihi: null, askiyaAlmaNedeni: null } : {}),
      updatedAt: serverTimestamp(),
    });
    load();
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" /></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Askıdaki Hesaplar ({users.length})</h1>
      <Card><CardContent className="p-0">
        <Table>
          <TableHeader><TableRow><TableHead>Firma</TableHead><TableHead>Askıya Alınma</TableHead><TableHead>Neden</TableHead><TableHead>İşlem</TableHead></TableRow></TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="text-center text-gray-500 py-8">Askıdaki hesap yok.</TableCell></TableRow>
            ) : users.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">{u.firmaAdi}</TableCell>
                <TableCell className="text-sm">{u.askiyaAlmaTarihi ? format(u.askiyaAlmaTarihi.toDate(), "dd.MM.yyyy", { locale: tr }) : "-"}</TableCell>
                <TableCell className="text-sm text-gray-500">{u.askiyaAlmaNedeni || "-"}</TableCell>
                <TableCell className="space-x-2">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => changeDurum(u.id, "aktif")}>Aktif Et</Button>
                  <Button size="sm" variant="destructive" onClick={() => changeDurum(u.id, "iptal")}>İptal Et</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>
    </div>
  );
}
