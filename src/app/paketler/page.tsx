import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { CheckCircle, X } from "lucide-react";

const dolumcuPaketler = [
  {
    name: "Starter",
    desc: "Küçük ölçekli dolumcular için",
    features: [
      { text: "100 Tüp", ok: true },
      { text: "QR Kod Oluşturma", ok: true },
      { text: "Müşteri Yönetimi", ok: true },
      { text: "Personel Yönetimi", ok: true },
      { text: "Stok Yönetimi", ok: false },
      { text: "Teklif Oluşturma", ok: false },
      { text: "Cari Hesaplar", ok: false },
    ],
  },
  {
    name: "Professional",
    desc: "Büyüyen dolumcular için",
    popular: true,
    features: [
      { text: "500 Tüp", ok: true },
      { text: "QR Kod Oluşturma", ok: true },
      { text: "Müşteri Yönetimi", ok: true },
      { text: "Personel Yönetimi", ok: true },
      { text: "Stok Yönetimi", ok: true },
      { text: "Teklif Oluşturma", ok: true },
      { text: "Cari Hesaplar", ok: false },
    ],
  },
  {
    name: "Enterprise",
    desc: "Büyük ölçekli operasyonlar için",
    features: [
      { text: "Sınırsız Tüp", ok: true },
      { text: "QR Kod Oluşturma", ok: true },
      { text: "Müşteri Yönetimi", ok: true },
      { text: "Personel Yönetimi", ok: true },
      { text: "Stok Yönetimi", ok: true },
      { text: "Teklif Oluşturma", ok: true },
      { text: "Cari Hesaplar", ok: true },
    ],
  },
];

export default function PaketlerPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-4">Fiyatlandırma</h1>
          <p className="text-gray-600 text-center mb-12 max-w-xl mx-auto">
            İhtiyacınıza en uygun paketi seçin. Tüm paketlerde 14 gün ücretsiz deneme hakkı.
          </p>

          <h2 className="text-2xl font-bold mb-6">Dolumcu / Bayi Paketleri</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {dolumcuPaketler.map((p) => (
              <div key={p.name} className={`bg-white rounded-xl p-6 border-2 ${p.popular ? "border-red-600 shadow-lg" : "border-gray-200"}`}>
                {p.popular && <span className="text-xs font-bold text-red-600">EN POPÜLER</span>}
                <h3 className="text-xl font-bold mt-1">{p.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{p.desc}</p>
                <p className="text-sm text-gray-600 mb-6 font-medium">Fiyat bilgisi için iletişime geçin</p>
                <ul className="space-y-3 mb-6">
                  {p.features.map((f) => (
                    <li key={f.text} className="flex items-center gap-2 text-sm">
                      {f.ok ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-gray-300" />
                      )}
                      <span className={f.ok ? "" : "text-gray-400"}>{f.text}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/kayit"
                  className={`block text-center py-2 rounded-lg font-semibold text-sm ${
                    p.popular ? "bg-red-600 text-white hover:bg-red-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Başla
                </Link>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold mb-6">Fabrika / İşletme Paketleri</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mb-16">
            <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
              <h3 className="text-xl font-bold">Ücretsiz</h3>
              <p className="text-sm text-gray-500 mb-4">Dolumcunuzun verilerini görüntüleyin</p>
              <ul className="space-y-3 mb-6 text-sm">
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Tüp görüntüleme</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> QR doğrulama</li>
                <li className="flex items-center gap-2"><X className="h-4 w-4 text-gray-300" /> <span className="text-gray-400">Bakım uyarıları</span></li>
                <li className="flex items-center gap-2"><X className="h-4 w-4 text-gray-300" /> <span className="text-gray-400">Raporlar ve Excel export</span></li>
              </ul>
              <Link href="/kayit" className="block text-center py-2 rounded-lg font-semibold text-sm bg-gray-100 text-gray-700 hover:bg-gray-200">
                Ücretsiz Başla
              </Link>
            </div>
            <div className="bg-white rounded-xl p-6 border-2 border-red-600 shadow-lg">
              <h3 className="text-xl font-bold">Premium</h3>
              <p className="text-sm text-gray-500 mb-4">Tam kontrol ve raporlama</p>
              <ul className="space-y-3 mb-6 text-sm">
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Tüp görüntüleme</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> QR doğrulama</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Bakım uyarıları</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Raporlar ve Excel export</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Kendi tüp ekleme</li>
              </ul>
              <Link href="/kayit" className="block text-center py-2 rounded-lg font-semibold text-sm bg-red-600 text-white hover:bg-red-700">
                Başla
              </Link>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-8 text-center">
            <h3 className="text-lg font-bold mb-2">Sorularınız mı var?</h3>
            <p className="text-gray-600 text-sm mb-4">
              Fiyat bilgisi ve özel teklifler için bizimle iletişime geçin.
            </p>
            <p className="text-sm">
              <strong>Email:</strong> kgmdanismanlik@gmail.com | <strong>Telefon:</strong> +90 554 379 16 32
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
