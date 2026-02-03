import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { CheckCircle, QrCode, Bell, Users, Package, FileText, BarChart3 } from "lucide-react";

const features = [
  { icon: QrCode, title: "QR Kod Takip", desc: "Her tüpe özel QR kod oluşturun, okutun, doğrulayın." },
  { icon: Bell, title: "Bakım Hatırlatma", desc: "Bakım tarihi yaklaşan tüpler için otomatik uyarılar." },
  { icon: Users, title: "Müşteri Yönetimi", desc: "Müşterilerinizi ve tüplerini tek panelden yönetin." },
  { icon: Package, title: "Stok Takibi", desc: "Tüp, yedek parça ve dolum malzemesi stoklarınız." },
  { icon: FileText, title: "Teklif Oluşturma", desc: "Profesyonel teklif formları hazırlayın." },
  { icon: BarChart3, title: "Raporlama", desc: "Detaylı raporlar ve Excel export." },
];

const steps = [
  { num: "1", title: "Kayıt Olun", desc: "Dolumcu veya fabrika olarak hızlıca kayıt olun." },
  { num: "2", title: "Tüpleri Ekleyin", desc: "Müşterilerinizin tüplerini sisteme kaydedin." },
  { num: "3", title: "QR Kod Oluşturun", desc: "Her tüp için QR kod oluşturup etiket yazdırın." },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-red-600 to-red-800 text-white py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Yangın Söndürme Cihazlarınızı Dijital Olarak Takip Edin
          </h1>
          <p className="text-lg md:text-xl text-red-100 mb-8 max-w-2xl mx-auto">
            QR kod teknolojisi ile tüm tüplerinizi kayıt altına alın, bakım takibini otomatikleştirin,
            müşterilerinize profesyonel hizmet sunun.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/kayit"
              className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-red-50 transition-colors"
            >
              Ücretsiz Deneyin
            </Link>
            <Link
              href="/giris"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              Giriş Yap
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="ozellikler" className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Özellikler</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f) => (
              <div key={f.title} className="bg-white p-6 rounded-xl shadow-sm border">
                <f.icon className="h-10 w-10 text-red-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Nasıl Çalışır?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s) => (
              <div key={s.num} className="text-center">
                <div className="w-16 h-16 bg-red-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {s.num}
                </div>
                <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
                <p className="text-gray-600 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For who */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Kimler İçin?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border">
              <h3 className="text-xl font-bold mb-4 text-red-600">Dolumcular / Bayiler İçin</h3>
              <ul className="space-y-3">
                {["Müşteri tüplerini kaydedin", "Dolum ve bakım işlemlerini takip edin", "QR kod oluşturup etiket yazdırın", "Stok ve teklif yönetimi yapın", "Müşterilerinize profesyonel hizmet sunun"].map((t) => (
                  <li key={t} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border">
              <h3 className="text-xl font-bold mb-4 text-red-600">Fabrikalar / İşletmeler İçin</h3>
              <ul className="space-y-3">
                {["Dolumcunun girdiği tüpleri görüntüleyin", "QR kod ile tüp doğrulama yapın", "Bakım uyarıları alın (Premium)", "Denetim raporları oluşturun (Premium)", "Tüm dolumcularınızı tek panelde takip edin"].map((t) => (
                  <li key={t} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing preview */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Fiyatlandırma</h2>
          <p className="text-gray-600 mb-12">İhtiyacınıza uygun paketi seçin</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { name: "Starter", tup: "100 Tüp", features: ["QR Kod Oluşturma", "Müşteri Yönetimi", "Personel Yönetimi"] },
              { name: "Professional", tup: "500 Tüp", features: ["Starter özellikleri", "Stok Yönetimi", "Teklif Oluşturma", "Gelişmiş Raporlar"], popular: true },
              { name: "Enterprise", tup: "Sınırsız Tüp", features: ["Professional özellikleri", "Cari Hesaplar", "Öncelikli Destek"] },
            ].map((p) => (
              <div key={p.name} className={`bg-white p-6 rounded-xl border-2 ${p.popular ? "border-red-600 shadow-lg" : "border-gray-200"}`}>
                {p.popular && <div className="text-xs font-bold text-red-600 mb-2">EN POPÜLER</div>}
                <h3 className="text-xl font-bold mb-1">{p.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{p.tup}</p>
                <ul className="text-sm text-left space-y-2 mb-6">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" /> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/paketler" className="block text-center text-red-600 font-semibold hover:underline text-sm">
                  Detaylı Bilgi
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="iletisim" className="bg-gray-900 text-gray-300 py-12 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-3">Yangın Tüpü Takip</h3>
            <p className="text-sm">Yangın söndürme cihazlarınızı dijital olarak takip edin.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Hızlı Bağlantılar</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/paketler" className="hover:text-white">Fiyatlandırma</Link></li>
              <li><Link href="/giris" className="hover:text-white">Giriş Yap</Link></li>
              <li><Link href="/kayit" className="hover:text-white">Kayıt Ol</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">İletişim</h4>
            <ul className="space-y-2 text-sm">
              <li>info@kgmdijital.com</li>
              <li>0332 XXX XX XX</li>
              <li>Konya, Türkiye</li>
            </ul>
          </div>
        </div>
        <div className="max-w-5xl mx-auto mt-8 pt-8 border-t border-gray-700 text-center text-sm">
          &copy; 2025 KGM Dijital. Tüm hakları saklıdır.
        </div>
      </footer>
    </div>
  );
}
