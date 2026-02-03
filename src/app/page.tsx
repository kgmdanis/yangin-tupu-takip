"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Shield, 
  QrCode, 
  Bell, 
  BarChart3, 
  CheckCircle2, 
  ArrowRight,
  Flame,
  Calendar,
  FileCheck,
  Smartphone,
  Clock,
  Building2,
  AlertTriangle,
  Wrench,
  ClipboardCheck,
  ScanLine,
  BadgeCheck,
  Timer,
  MapPin
} from "lucide-react";

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [scanLine, setScanLine] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    
    const scanInterval = setInterval(() => {
      setScanLine((prev) => (prev >= 100 ? 0 : prev + 2));
    }, 50);

    const stepInterval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 3000);

    return () => {
      clearInterval(scanInterval);
      clearInterval(stepInterval);
    };
  }, []);

  const processSteps = [
    { icon: <QrCode className="w-6 h-6" />, title: "QR Kod Oluştur", desc: "Her tüpe özel kod" },
    { icon: <ScanLine className="w-6 h-6" />, title: "Telefonla Tara", desc: "Anında bilgiye eriş" },
    { icon: <Wrench className="w-6 h-6" />, title: "Bakım Kaydet", desc: "Dijital kayıt tut" },
    { icon: <Bell className="w-6 h-6" />, title: "Hatırlatma Al", desc: "Otomatik bildirim" },
  ];

  const stats = [
    { value: "50.000+", label: "Takip Edilen Tüp", icon: <Flame className="w-5 h-5" /> },
    { value: "1.200+", label: "Aktif İşletme", icon: <Building2 className="w-5 h-5" /> },
    { value: "%100", label: "Yasal Uyumluluk", icon: <BadgeCheck className="w-5 h-5" /> },
    { value: "6 Ay", label: "Önceden Uyarı", icon: <Timer className="w-5 h-5" /> },
  ];

  const features = [
    {
      icon: <QrCode className="w-8 h-8" />,
      title: "QR Kod Etiketleme",
      description: "Her yangın tüpüne özel QR kod. Telefon kamerasıyla okutun, tüm bilgilere anında ulaşın.",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: <Bell className="w-8 h-8" />,
      title: "Bakım Hatırlatma",
      description: "6 aylık periyodik bakım, yıllık kontrol, 10 yıllık hidrostatik test hatırlatmaları.",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: <FileCheck className="w-8 h-8" />,
      title: "Dijital Sertifika",
      description: "Bakım sertifikaları, test raporları ve yasal belgeler dijital ortamda saklanır.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Lokasyon Takibi",
      description: "Hangi tüp nerede? Bina, kat, oda bazında konum takibi yapın.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Detaylı Raporlar",
      description: "Bakım geçmişi, maliyet analizi, uyumluluk raporları tek tıkla.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <AlertTriangle className="w-8 h-8" />,
      title: "Acil Durum Planı",
      description: "Yangın tüpü konumlarını gösteren acil durum haritaları oluşturun.",
      color: "from-red-500 to-rose-500"
    },
  ];

  const packages = [
    {
      name: "Başlangıç",
      price: "499",
      period: "ay",
      description: "Küçük işletmeler için",
      features: ["100 tüp kaydı", "1 lokasyon", "QR kod oluşturma", "E-posta hatırlatma", "Temel raporlar"],
      popular: false
    },
    {
      name: "Profesyonel",
      price: "999",
      period: "ay",
      description: "Büyüyen işletmeler için",
      features: ["500 tüp kaydı", "5 lokasyon", "Toplu QR etiket basımı", "SMS + E-posta bildirim", "Gelişmiş raporlar", "Personel yönetimi", "Öncelikli destek"],
      popular: true
    },
    {
      name: "Kurumsal",
      price: "2.499",
      period: "ay",
      description: "Büyük işletmeler için",
      features: ["Sınırsız tüp", "Sınırsız lokasyon", "API erişimi", "Özel entegrasyonlar", "Çoklu şirket desteği", "Yerinde eğitim", "7/24 öncelikli destek"],
      popular: false
    },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-hidden">
      {/* Animated Fire Background */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[150px] animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-600/5 rounded-full blur-[180px] animate-pulse" style={{animationDelay: '0.5s'}}></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 border-b border-gray-800/50 backdrop-blur-xl bg-gray-950/80 sticky top-0">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Image 
                src="/logo.png" 
                alt="KGM Logo" 
                width={48} 
                height={48}
                className="rounded-xl"
              />
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                  TüpTakip
                </span>
                <span className="block text-xs text-gray-500">Yangın Tüpü Yönetim Sistemi</span>
              </div>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <a href="#ozellikler" className="text-gray-400 hover:text-white transition text-sm">Özellikler</a>
              <a href="#nasil-calisir" className="text-gray-400 hover:text-white transition text-sm">Nasıl Çalışır?</a>
              <a href="#fiyatlar" className="text-gray-400 hover:text-white transition text-sm">Fiyatlar</a>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/giris" className="text-gray-300 hover:text-white transition px-4 py-2">
                Giriş
              </Link>
              <Link 
                href="/kayit" 
                className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl font-medium hover:shadow-lg hover:shadow-orange-500/25 transition-all transform hover:scale-105 flex items-center gap-2"
              >
                <Flame className="w-4 h-4" />
                Ücretsiz Dene
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-16 pb-24">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Content */}
            <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-sm mb-6">
                <Shield className="w-4 h-4" />
                <span>İş Güvenliği Mevzuatına %100 Uyumlu</span>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
                <span className="text-white">Yangın Tüpü</span>
                <br />
                <span className="bg-gradient-to-r from-orange-400 via-red-500 to-yellow-500 bg-clip-text text-transparent">
                  Takip Sistemi
                </span>
              </h1>
              
              <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                Tüm yangın söndürme cihazlarınızı <strong className="text-orange-400">QR kod</strong> ile takip edin. 
                Bakım zamanlarını kaçırmayın, <strong className="text-orange-400">yasal yükümlülüklerinizi</strong> kolayca yerine getirin.
              </p>

              {/* Key Benefits */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-3 text-gray-300">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span>6 Aylık Bakım Takibi</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span>Otomatik Hatırlatma</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span>Dijital Sertifikalar</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span>Anlık Raporlama</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/kayit" 
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl font-semibold text-lg hover:shadow-2xl hover:shadow-orange-500/30 transition-all transform hover:scale-105"
                >
                  <Flame className="w-5 h-5" />
                  14 Gün Ücretsiz Dene
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                </Link>
                <Link 
                  href="#demo" 
                  className="inline-flex items-center gap-3 px-8 py-4 border border-gray-700 rounded-2xl font-semibold text-lg hover:border-orange-500/50 hover:bg-orange-500/5 transition"
                >
                  <Smartphone className="w-5 h-5" />
                  Demo İzle
                </Link>
              </div>
            </div>

            {/* Right - Fire Extinguisher Visual */}
            <div className={`relative transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="relative">
                {/* Glow */}
                <div className="absolute inset-0 bg-gradient-to-b from-orange-500/20 to-red-600/20 rounded-[40px] blur-3xl"></div>
                
                {/* Main Card */}
                <div className="relative bg-gradient-to-b from-gray-900 to-gray-950 rounded-[32px] p-8 border border-gray-800 shadow-2xl">
                  
                  {/* Fire Extinguisher SVG - Large */}
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      {/* Flame effects behind */}
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-20 h-20 bg-orange-500/20 rounded-full blur-2xl animate-pulse"></div>
                      
                      <svg viewBox="0 0 120 240" className="w-40 h-64 drop-shadow-2xl">
                        {/* Tank Body */}
                        <defs>
                          <linearGradient id="tankBody" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#DC2626" />
                            <stop offset="30%" stopColor="#EF4444" />
                            <stop offset="70%" stopColor="#EF4444" />
                            <stop offset="100%" stopColor="#B91C1C" />
                          </linearGradient>
                          <linearGradient id="tankShine" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="transparent" />
                            <stop offset="40%" stopColor="rgba(255,255,255,0.1)" />
                            <stop offset="60%" stopColor="rgba(255,255,255,0.1)" />
                            <stop offset="100%" stopColor="transparent" />
                          </linearGradient>
                        </defs>
                        
                        {/* Main Tank */}
                        <rect x="25" y="60" width="70" height="150" rx="12" fill="url(#tankBody)" />
                        <rect x="25" y="60" width="70" height="150" rx="12" fill="url(#tankShine)" />
                        
                        {/* Tank Top */}
                        <ellipse cx="60" cy="60" rx="35" ry="8" fill="#B91C1C" />
                        
                        {/* Valve Assembly */}
                        <rect x="45" y="35" width="30" height="30" rx="4" fill="#374151" />
                        <rect x="50" y="40" width="20" height="8" rx="2" fill="#4B5563" />
                        
                        {/* Handle */}
                        <path d="M50 38 L50 15 Q50 10 55 10 L65 10 Q70 10 70 15 L70 38" 
                              stroke="#6B7280" strokeWidth="6" fill="none" strokeLinecap="round"/>
                        <rect x="48" y="5" width="24" height="12" rx="4" fill="#4B5563" />
                        
                        {/* Trigger */}
                        <path d="M75 45 L85 40 L88 45 L78 52 Z" fill="#374151" />
                        
                        {/* Hose */}
                        <path d="M85 48 Q100 55 98 75 Q96 95 105 115" 
                              stroke="#1F2937" strokeWidth="8" fill="none" strokeLinecap="round"/>
                        <ellipse cx="105" cy="118" rx="6" ry="4" fill="#111827" />
                        
                        {/* Label Area */}
                        <rect x="35" y="90" width="50" height="70" rx="4" fill="white" />
                        
                        {/* Label Content */}
                        <text x="60" y="108" textAnchor="middle" fontSize="8" fill="#DC2626" fontWeight="bold">YANGIN</text>
                        <text x="60" y="120" textAnchor="middle" fontSize="8" fill="#DC2626" fontWeight="bold">SÖNDÜRÜCÜ</text>
                        
                        {/* Fire Icon on Label */}
                        <path d="M55 130 Q60 125 60 132 Q62 128 65 132 Q65 138 60 142 Q55 138 55 130" fill="#EF4444" />
                        
                        <text x="60" y="155" textAnchor="middle" fontSize="6" fill="#666">ABC KURU KİMYEVİ</text>
                        
                        {/* Pressure Gauge */}
                        <circle cx="60" cy="180" r="15" fill="#1F2937" stroke="#374151" strokeWidth="2" />
                        <circle cx="60" cy="180" r="10" fill="#111827" />
                        {/* Gauge zones */}
                        <path d="M52 180 A8 8 0 0 1 60 172" stroke="#EF4444" strokeWidth="2" fill="none" />
                        <path d="M60 172 A8 8 0 0 1 68 180" stroke="#22C55E" strokeWidth="2" fill="none" />
                        <path d="M68 180 A8 8 0 0 1 60 188" stroke="#EF4444" strokeWidth="2" fill="none" />
                        {/* Needle - pointing to green */}
                        <line x1="60" y1="180" x2="66" y2="175" stroke="white" strokeWidth="1.5" />
                        <circle cx="60" cy="180" r="2" fill="white" />
                        
                        {/* Bottom */}
                        <ellipse cx="60" cy="210" rx="35" ry="6" fill="#991B1B" />
                        <rect x="45" y="210" width="30" height="8" fill="#1F2937" />
                      </svg>
                    </div>
                  </div>

                  {/* QR Code Scanner Overlay */}
                  <div className="absolute top-6 right-6 w-24 h-24 bg-white rounded-xl p-2 shadow-xl">
                    <div className="relative w-full h-full bg-gray-100 rounded-lg overflow-hidden">
                      {/* QR Pattern */}
                      <div className="absolute inset-2 grid grid-cols-6 gap-0.5">
                        {[...Array(36)].map((_, i) => (
                          <div 
                            key={i} 
                            className={`rounded-sm ${
                              [0,1,2,5,6,11,12,17,18,23,24,29,30,31,32,35].includes(i) 
                                ? 'bg-gray-900' 
                                : Math.random() > 0.6 ? 'bg-gray-900' : 'bg-white'
                            }`}
                          />
                        ))}
                      </div>
                      {/* Scan Line */}
                      <div 
                        className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent"
                        style={{ top: `${scanLine}%` }}
                      />
                      {/* Corner Markers */}
                      <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-red-500"></div>
                      <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-red-500"></div>
                      <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-red-500"></div>
                      <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-red-500"></div>
                    </div>
                    <p className="text-center text-[8px] text-gray-500 mt-1 font-mono">TT-2024-0001</p>
                  </div>

                  {/* Info Cards */}
                  <div className="space-y-3 mt-4">
                    <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 rounded-xl p-3">
                      <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">Bakım Durumu</p>
                        <p className="text-xs text-green-400">Geçerli - Son: 15.01.2026</p>
                      </div>
                      <span className="px-2 py-1 bg-green-500/20 rounded-full text-xs text-green-400">OK</span>
                    </div>
                    
                    <div className="flex items-center gap-3 bg-blue-500/10 border border-blue-500/20 rounded-xl p-3">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">Sonraki Bakım</p>
                        <p className="text-xs text-blue-400">15.07.2026 (162 gün)</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 bg-orange-500/10 border border-orange-500/20 rounded-xl p-3">
                      <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-orange-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">Konum</p>
                        <p className="text-xs text-orange-400">A Blok, 2. Kat, Koridor</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-12 border-y border-gray-800/50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl mb-3 text-orange-400">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-gray-500 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="nasil-calisir" className="relative z-10 py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Nasıl <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">Çalışır?</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              4 basit adımda yangın tüpü takibini dijitale taşıyın
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {processSteps.map((step, index) => (
              <div
                key={index}
                className={`relative bg-gray-900/50 rounded-2xl p-6 border transition-all duration-500 ${
                  activeStep === index 
                    ? 'border-orange-500 shadow-lg shadow-orange-500/20 scale-105' 
                    : 'border-gray-800 hover:border-gray-700'
                }`}
              >
                <div className={`absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  activeStep === index 
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' 
                    : 'bg-gray-800 text-gray-400'
                }`}>
                  {index + 1}
                </div>
                
                {index < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 text-gray-700">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                )}

                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${
                  activeStep === index 
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' 
                    : 'bg-gray-800 text-gray-400'
                }`}>
                  {step.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="ozellikler" className="relative z-10 py-24 bg-gray-900/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Güçlü <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">Özellikler</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Yangın güvenliği yönetimini kolaylaştıran profesyonel araçlar
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-gray-900/50 backdrop-blur rounded-2xl p-6 border border-gray-800 hover:border-orange-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/5"
              >
                <div className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r ${feature.color} rounded-xl mb-4 text-white transform group-hover:scale-110 transition`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance Section */}
      <section className="relative z-10 py-24">
        <div className="container mx-auto px-6">
          <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-3xl p-8 lg:p-12 border border-orange-500/20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 rounded-full text-orange-400 text-sm mb-6">
                  <Shield className="w-4 h-4" />
                  <span>Yasal Uyumluluk</span>
                </div>
                <h2 className="text-3xl font-bold mb-4">
                  Mevzuata Uygun<br />
                  <span className="text-orange-400">Bakım Takibi</span>
                </h2>
                <p className="text-gray-400 mb-6">
                  6331 sayılı İş Sağlığı ve Güvenliği Kanunu ve ilgili yönetmeliklere uygun olarak 
                  yangın söndürme cihazlarınızın periyodik bakım ve kontrollerini takip edin.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-gray-300">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span>6 aylık periyodik bakım kontrolü</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-300">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span>Yıllık genel kontrol ve test</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-300">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span>10 yıllık hidrostatik test takibi</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-300">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span>Dijital bakım sertifikaları</span>
                  </li>
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-900/80 rounded-2xl p-6 border border-gray-800">
                  <Wrench className="w-8 h-8 text-orange-400 mb-3" />
                  <h4 className="font-semibold mb-1">6 Aylık Bakım</h4>
                  <p className="text-gray-500 text-sm">Görsel kontrol, ağırlık, basınç</p>
                </div>
                <div className="bg-gray-900/80 rounded-2xl p-6 border border-gray-800">
                  <ClipboardCheck className="w-8 h-8 text-blue-400 mb-3" />
                  <h4 className="font-semibold mb-1">Yıllık Kontrol</h4>
                  <p className="text-gray-500 text-sm">Detaylı test ve sertifika</p>
                </div>
                <div className="bg-gray-900/80 rounded-2xl p-6 border border-gray-800">
                  <Timer className="w-8 h-8 text-purple-400 mb-3" />
                  <h4 className="font-semibold mb-1">10 Yıl Test</h4>
                  <p className="text-gray-500 text-sm">Hidrostatik basınç testi</p>
                </div>
                <div className="bg-gray-900/80 rounded-2xl p-6 border border-gray-800">
                  <FileCheck className="w-8 h-8 text-green-400 mb-3" />
                  <h4 className="font-semibold mb-1">Sertifikalar</h4>
                  <p className="text-gray-500 text-sm">Dijital arşiv ve raporlar</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="fiyatlar" className="relative z-10 py-24 bg-gray-900/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Şeffaf <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">Fiyatlandırma</span>
            </h2>
            <p className="text-gray-400">İşletmenizin büyüklüğüne uygun paketi seçin</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {packages.map((pkg, index) => (
              <div
                key={index}
                className={`relative bg-gray-900/80 backdrop-blur rounded-2xl p-8 border transition-all hover:-translate-y-1 ${
                  pkg.popular 
                    ? 'border-orange-500 shadow-xl shadow-orange-500/10' 
                    : 'border-gray-800 hover:border-gray-700'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full text-sm font-medium flex items-center gap-1">
                    <Flame className="w-3 h-3" />
                    En Popüler
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-1">{pkg.name}</h3>
                <p className="text-gray-500 text-sm mb-4">{pkg.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{pkg.price}</span>
                  <span className="text-gray-400"> ₺/{pkg.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-300 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/kayit"
                  className={`block text-center py-3 rounded-xl font-medium transition ${
                    pkg.popular 
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:shadow-lg hover:shadow-orange-500/25' 
                      : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                >
                  Başla
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24">
        <div className="container mx-auto px-6">
          <div className="relative bg-gradient-to-r from-orange-600 to-red-600 rounded-3xl p-12 text-center overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-20 h-20 border-4 border-white rounded-full"></div>
              <div className="absolute bottom-10 right-10 w-32 h-32 border-4 border-white rounded-full"></div>
            </div>

            <div className="relative z-10">
              <Flame className="w-16 h-16 mx-auto mb-6 text-white/80" />
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Yangın Güvenliğini Dijitale Taşıyın
              </h2>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                14 gün ücretsiz deneyin. Kredi kartı gerekmez.
              </p>
              <Link
                href="/kayit"
                className="inline-flex items-center gap-3 px-10 py-5 bg-white text-gray-900 rounded-2xl font-semibold text-lg hover:shadow-2xl transition-all transform hover:scale-105"
              >
                <Flame className="w-5 h-5 text-orange-500" />
                Hemen Ücretsiz Başla
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="KGM Logo" width={40} height={40} className="rounded-lg" />
              <div>
                <span className="font-bold text-lg">TüpTakip</span>
                <span className="block text-xs text-gray-500">KGM Dijital</span>
              </div>
            </div>
            <div className="flex items-center gap-6 text-gray-500 text-sm">
              <span>kgmdanismanlik@gmail.com</span>
              <span>+90 554 379 16 32</span>
            </div>
            <div className="text-gray-500 text-sm">
              © 2026 KGM Dijital. Tüm hakları saklıdır.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
