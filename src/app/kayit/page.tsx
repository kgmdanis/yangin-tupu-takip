"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { KullaniciTipi } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function KayitPage() {
  const [kullaniciTipi, setKullaniciTipi] = useState<KullaniciTipi>("dolumcu");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [firmaAdi, setFirmaAdi] = useState("");
  const [yetkili, setYetkili] = useState("");
  const [telefon, setTelefon] = useState("");
  const [adres, setAdres] = useState("");
  const [il, setIl] = useState("");
  const [ilce, setIlce] = useState("");
  const [vergiDairesi, setVergiDairesi] = useState("");
  const [vergiNo, setVergiNo] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== passwordConfirm) {
      setError("Şifreler eşleşmiyor.");
      return;
    }
    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır.");
      return;
    }
    setLoading(true);
    try {
      await signUp(email, password, {
        firmaAdi, yetkili, telefon, adres, il, ilce, vergiDairesi, vergiNo, kullaniciTipi,
      });
      router.push("/dashboard");
    } catch {
      setError("Kayıt sırasında bir hata oluştu. Bu email zaten kullanılıyor olabilir.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="text-red-600 font-bold text-xl mb-2">Yangın Tüpü Takip Sistemi</div>
          <CardTitle>Kayıt Ol</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md">{error}</div>}

            <div className="flex gap-2">
              {(["dolumcu", "fabrika"] as KullaniciTipi[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setKullaniciTipi(t)}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium border transition-colors ${
                    kullaniciTipi === t
                      ? "bg-red-600 text-white border-red-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {t === "dolumcu" ? "Dolumcu / Bayi" : "Fabrika / İşletme"}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label>Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Şifre</Label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Şifre Tekrar</Label>
                <Input type="password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} required />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Firma Adı</Label>
                <Input value={firmaAdi} onChange={(e) => setFirmaAdi(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Yetkili Kişi</Label>
                <Input value={yetkili} onChange={(e) => setYetkili(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Telefon</Label>
                <Input value={telefon} onChange={(e) => setTelefon(e.target.value)} required />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Adres</Label>
                <Input value={adres} onChange={(e) => setAdres(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>İl</Label>
                <Input value={il} onChange={(e) => setIl(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>İlçe</Label>
                <Input value={ilce} onChange={(e) => setIlce(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Vergi Dairesi</Label>
                <Input value={vergiDairesi} onChange={(e) => setVergiDairesi(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Vergi No</Label>
                <Input value={vergiNo} onChange={(e) => setVergiNo(e.target.value)} />
              </div>
            </div>

            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={loading}>
              {loading ? "Kayıt yapılıyor..." : "Kayıt Ol"}
            </Button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-4">
            Zaten hesabınız var mı?{" "}
            <Link href="/giris" className="text-red-600 hover:underline">Giriş Yap</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
