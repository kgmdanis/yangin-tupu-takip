# 🎨 TüpTakip Arayüz Güncellemesi

## 📁 Güncellenecek Dosyalar

```
yangin-tupu-takip/
├── public/
│   └── logo.png              ← KGM logosu (YENİ)
├── src/
│   ├── app/
│   │   ├── page.tsx          ← Landing page (DEĞİŞTİR)
│   │   └── globals.css       ← Animasyonlar (DEĞİŞTİR)
│   └── components/
│       └── Sidebar.tsx       ← Sidebar (DEĞİŞTİR)
```

## 🚀 Sunucuya Yükleme (SSH ile)

### 1. SSH Bağlan
```bash
ssh root@45.81.113.230
```

### 2. Proje Klasörüne Git
```bash
cd /var/www/yangin-tupu-takip
```

### 3. Dosyaları Güncelle

**Logo ekle:**
```bash
# Logo dosyasını SCP ile yükle (Windows'tan):
scp C:\path\to\logo.png root@45.81.113.230:/var/www/yangin-tupu-takip/public/logo.png
```

**Veya doğrudan sunucuda base64'ten çevir:**
```bash
# Logo zaten var ise bu adımı atla
```

### 4. Dosyaları Güncelle (Manuel)
Aşağıdaki dosyaları sunucuda düzenle:

```bash
# Landing page
nano src/app/page.tsx
# İçeriği yapıştır, Ctrl+X, Y, Enter

# Globals CSS
nano src/app/globals.css
# İçeriği yapıştır

# Sidebar
nano src/components/Sidebar.tsx
# İçeriği yapıştır
```

### 5. Build ve Restart
```bash
npm run build
pm2 restart yangin-tupu
```

### 6. Kontrol Et
```bash
pm2 logs yangin-tupu --lines 20
```

---

## 🎯 Alternatif: GitHub Üzerinden

### 1. Lokal'de Değişiklikleri Yap
Windows'ta:
```bash
cd C:\Projects\yangin-tupu-takip
# Dosyaları güncelle
```

### 2. Git Push
```bash
git add .
git commit -m "🎨 Yeni tasarım: Landing page, sidebar, animasyonlar"
git push origin main
```

### 3. Sunucuda Pull
```bash
ssh root@45.81.113.230
cd /var/www/yangin-tupu-takip
git pull origin main
npm run build
pm2 restart yangin-tupu
```

---

## ✅ Değişiklikler

### Landing Page (page.tsx)
- ✨ Animasyonlu arka plan (blur circles)
- 🔥 Yangın tüpü SVG animasyonu
- 📱 QR kod animasyonu
- 🎨 Gradient text ve butonlar
- 📊 İstatistik kartları
- 💰 Fiyat paketleri
- 🌈 Hover efektleri

### Sidebar (Sidebar.tsx)
- 🌙 Koyu tema
- 🔸 Turuncu/kırmızı vurgular
- 🖼️ KGM logosu
- 📍 Aktif sayfa göstergesi
- 🔔 Bildirim badge
- ↔️ Daraltılabilir (collapse)
- 👤 Kullanıcı bilgisi

### Global CSS (globals.css)
- 🎭 Custom scrollbar
- ✨ Float animasyonu
- 💫 Slide animasyonları
- 🔥 Fire gradient
- 🪟 Glass efekti
- 💡 Glow efektleri

---

## 🎨 Marka

- **İsim:** TüpTakip
- **Alt Marka:** KGM Dijital
- **Ana Renk:** Turuncu → Kırmızı gradient (#f97316 → #ef4444)
- **Arka Plan:** Koyu gri (#111827, #1f2937)
- **Vurgu:** Yeşil (başarı), Mavi (bilgi), Sarı (uyarı), Kırmızı (tehlike)
