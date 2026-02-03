import { useState, useEffect } from "react";

// SVG Icon Components
const Flame = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
  </svg>
);

const Shield = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const QrCode = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/>
    <rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/>
  </svg>
);

const Bell = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
  </svg>
);

const Wrench = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
  </svg>
);

const CheckCircle = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>
  </svg>
);

const ArrowRight = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
  </svg>
);

const Calendar = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/>
    <line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>
  </svg>
);

const MapPin = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);

export default function TupTakipLanding() {
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
    }, 2500);
    return () => {
      clearInterval(scanInterval);
      clearInterval(stepInterval);
    };
  }, []);

  const steps = [
    { icon: <QrCode className="w-5 h-5" />, title: "QR Kod Oluştur" },
    { icon: <Bell className="w-5 h-5" />, title: "Telefonla Tara" },
    { icon: <Wrench className="w-5 h-5" />, title: "Bakım Kaydet" },
    { icon: <CheckCircle className="w-5 h-5" />, title: "Hatırlatma Al" },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-orange-600/15 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-600/15 rounded-full blur-[120px] animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 border-b border-gray-800/50 backdrop-blur-xl bg-gray-950/80 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center text-orange-400 font-bold text-sm">
              K
            </div>
            <div>
              <span className="text-lg font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                TüpTakip
              </span>
              <span className="block text-[10px] text-gray-500 -mt-0.5">KGM Dijital</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="text-gray-400 text-sm px-3 py-1.5 hover:text-white transition">Giriş</button>
            <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg text-sm font-medium flex items-center gap-1.5 hover:shadow-lg hover:shadow-orange-500/25 transition-all hover:scale-105">
              <Flame className="w-3.5 h-3.5" />
              Ücretsiz Dene
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-4 pt-10 pb-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          {/* Left Content */}
          <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-xs mb-4">
              <Shield className="w-3 h-3" />
              <span>İSG Mevzuatına %100 Uyumlu</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
              <span className="text-white">Yangın Tüpü</span>
              <br />
              <span className="bg-gradient-to-r from-orange-400 via-red-500 to-yellow-500 bg-clip-text text-transparent">
                Takip Sistemi
              </span>
            </h1>
            
            <p className="text-gray-400 mb-6 text-sm leading-relaxed">
              Tüm yangın söndürme cihazlarınızı <strong className="text-orange-400">QR kod</strong> ile takip edin. 
              Bakım zamanlarını kaçırmayın, <strong className="text-orange-400">yasal yükümlülüklerinizi</strong> kolayca yerine getirin.
            </p>

            {/* Benefits */}
            <div className="grid grid-cols-2 gap-2 mb-6 text-sm">
              {["6 Aylık Bakım Takibi", "Otomatik Hatırlatma", "Dijital Sertifikalar", "Anlık Raporlama"].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-gray-300">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-xs">{item}</span>
                </div>
              ))}
            </div>
            
            <button className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl font-medium hover:shadow-xl hover:shadow-orange-500/30 transition-all hover:scale-105">
              <Flame className="w-4 h-4" />
              14 Gün Ücretsiz Dene
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </button>
          </div>

          {/* Right - Fire Extinguisher Card */}
          <div className={`relative transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="absolute inset-0 bg-gradient-to-b from-orange-500/20 to-red-600/20 rounded-3xl blur-2xl"></div>
            
            <div className="relative bg-gradient-to-b from-gray-900 to-gray-950 rounded-2xl p-5 border border-gray-800 shadow-2xl">
              {/* Fire Extinguisher */}
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-16 bg-orange-500/20 rounded-full blur-xl animate-pulse"></div>
                  
                  <svg viewBox="0 0 100 200" className="w-28 h-44 drop-shadow-xl">
                    <defs>
                      <linearGradient id="tank" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#DC2626" />
                        <stop offset="40%" stopColor="#EF4444" />
                        <stop offset="60%" stopColor="#EF4444" />
                        <stop offset="100%" stopColor="#B91C1C" />
                      </linearGradient>
                    </defs>
                    
                    {/* Tank */}
                    <rect x="20" y="50" width="60" height="130" rx="10" fill="url(#tank)" />
                    <ellipse cx="50" cy="50" rx="30" ry="6" fill="#B91C1C" />
                    
                    {/* Valve */}
                    <rect x="38" y="28" width="24" height="26" rx="3" fill="#374151" />
                    <path d="M42 30 L42 12 Q42 8 46 8 L54 8 Q58 8 58 12 L58 30" stroke="#6B7280" strokeWidth="5" fill="none" />
                    <rect x="40" y="4" width="20" height="10" rx="3" fill="#4B5563" />
                    
                    {/* Hose */}
                    <path d="M70 40 Q88 48 86 68 Q84 88 92 105" stroke="#1F2937" strokeWidth="6" fill="none" strokeLinecap="round"/>
                    
                    {/* Label */}
                    <rect x="28" y="75" width="44" height="60" rx="3" fill="white" />
                    <text x="50" y="92" textAnchor="middle" fontSize="7" fill="#DC2626" fontWeight="bold">YANGIN</text>
                    <text x="50" y="103" textAnchor="middle" fontSize="7" fill="#DC2626" fontWeight="bold">SÖNDÜRÜCÜ</text>
                    <path d="M45 112 Q50 107 50 114 Q52 110 55 114 Q55 120 50 124 Q45 120 45 112" fill="#EF4444" />
                    
                    {/* Gauge */}
                    <circle cx="50" cy="155" r="12" fill="#1F2937" stroke="#374151" strokeWidth="2" />
                    <circle cx="50" cy="155" r="7" fill="#111827" />
                    <line x1="50" y1="155" x2="55" y2="150" stroke="#22C55E" strokeWidth="1.5" />
                    <circle cx="50" cy="155" r="1.5" fill="white" />
                    
                    {/* Bottom */}
                    <ellipse cx="50" cy="180" rx="30" ry="5" fill="#991B1B" />
                  </svg>
                </div>
              </div>

              {/* QR Scanner */}
              <div className="absolute top-4 right-4 w-20 h-20 bg-white rounded-lg p-1.5 shadow-lg">
                <div className="relative w-full h-full bg-gray-100 rounded overflow-hidden">
                  <div className="absolute inset-1.5 grid grid-cols-5 gap-0.5">
                    {[...Array(25)].map((_, i) => (
                      <div key={i} className={`rounded-sm ${[0,1,4,5,9,15,19,20,21,24].includes(i) ? 'bg-gray-900' : Math.random() > 0.5 ? 'bg-gray-900' : 'bg-white'}`} />
                    ))}
                  </div>
                  <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent transition-all" style={{ top: `${scanLine}%` }} />
                  <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-red-500"></div>
                  <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-red-500"></div>
                  <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-red-500"></div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-red-500"></div>
                </div>
                <p className="text-center text-[7px] text-gray-500 mt-0.5 font-mono">TT-001</p>
              </div>

              {/* Status Cards */}
              <div className="space-y-2 mt-2">
                <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-lg p-2">
                  <div className="w-8 h-8 bg-green-500/20 rounded-md flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium">Bakım Durumu</p>
                    <p className="text-[10px] text-green-400">Geçerli - 15.01.2026</p>
                  </div>
                  <span className="px-1.5 py-0.5 bg-green-500/20 rounded text-[10px] text-green-400">OK</span>
                </div>
                
                <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-lg p-2">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-md flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium">Sonraki Bakım</p>
                    <p className="text-[10px] text-blue-400">15.07.2026 (162 gün)</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-lg p-2">
                  <div className="w-8 h-8 bg-orange-500/20 rounded-md flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium">Konum</p>
                    <p className="text-[10px] text-orange-400">A Blok, 2. Kat</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 py-8 border-y border-gray-800/50">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-4 gap-4">
          {[
            { val: "50K+", label: "Tüp" },
            { val: "1.2K+", label: "İşletme" },
            { val: "%100", label: "Uyumluluk" },
            { val: "6 Ay", label: "Ön Uyarı" },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">{s.val}</div>
              <div className="text-gray-500 text-xs">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">
            Nasıl <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">Çalışır?</span>
          </h2>
          
          <div className="grid grid-cols-4 gap-3">
            {steps.map((step, i) => (
              <div key={i} className={`relative bg-gray-900/50 rounded-xl p-4 border transition-all duration-500 ${activeStep === i ? 'border-orange-500 shadow-lg shadow-orange-500/20 scale-105' : 'border-gray-800'}`}>
                <div className={`absolute -top-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${activeStep === i ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-gray-800 text-gray-400'}`}>
                  {i + 1}
                </div>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 ${activeStep === i ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-gray-800 text-gray-400'}`}>
                  {step.icon}
                </div>
                <h3 className="text-sm font-medium">{step.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-10 px-4">
        <div className="max-w-2xl mx-auto bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-8 text-center">
          <Flame className="w-12 h-12 mx-auto mb-4 text-white/80" />
          <h2 className="text-2xl font-bold mb-2">Yangın Güvenliğini Dijitale Taşıyın</h2>
          <p className="text-white/80 mb-6 text-sm">14 gün ücretsiz • Kredi kartı gerekmez</p>
          <button className="inline-flex items-center gap-2 px-8 py-3 bg-white text-gray-900 rounded-xl font-semibold hover:shadow-xl transition-all hover:scale-105">
            <Flame className="w-4 h-4 text-orange-500" />
            Hemen Ücretsiz Başla
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800 py-6 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between text-gray-500 text-xs">
          <span>© 2026 KGM Dijital</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition">Hakkımızda</a>
            <a href="#" className="hover:text-white transition">İletişim</a>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
