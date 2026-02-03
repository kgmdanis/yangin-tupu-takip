import { Timestamp } from "firebase/firestore";

// Kullanıcı Tipleri
export type KullaniciTipi = "dolumcu" | "fabrika" | "admin";
export type Paket = "starter" | "professional" | "enterprise" | "fabrika_ucretsiz" | "fabrika_premium";
export type HesapDurumu = "beklemede" | "aktif" | "askida" | "iptal";
export type TupTipi = "KKT" | "SK" | "CO2";
export type TupDurumu = "aktif" | "pasif" | "hurda" | "kayip";
export type IslemTipi = "dolum" | "bakim" | "hidroTest" | "kontrol" | "satis" | "hurda";
export type TeklifDurumu = "taslak" | "gonderildi" | "onaylandi" | "reddedildi";
export type CariIslemTipi = "borc" | "alacak";
export type StokKategori = "tup" | "yedekParca" | "dolumMalzemesi";
export type StokDurum = "bos" | "dolu";

export interface User {
  id: string;
  email: string;
  firmaAdi: string;
  yetkili: string;
  telefon: string;
  adres: string;
  il: string;
  ilce: string;
  vergiDairesi: string;
  vergiNo: string;
  kullaniciTipi: KullaniciTipi;
  paket: Paket;
  paketBaslangic: Timestamp | null;
  paketBitis: Timestamp | null;
  hesapDurumu: HesapDurumu;
  askiyaAlmaTarihi: Timestamp | null;
  askiyaAlmaNedeni: string | null;
  bagliDolumcular: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Musteri {
  id: string;
  ownerId: string;
  firmaAdi: string;
  yetkili: string;
  telefon: string;
  email: string;
  adres: string;
  il: string;
  ilce: string;
  notlar: string;
  fabrikaUserId: string | null;
  davetGonderildi: boolean;
  davetTarihi: Timestamp | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Personel {
  id: string;
  ownerId: string;
  ad: string;
  soyad: string;
  telefon: string;
  gorev: string;
  aktif: boolean;
  createdAt: Timestamp;
}

export interface Tup {
  id: string;
  ownerId: string;
  musteriId: string | null;
  seriNo: string;
  tip: TupTipi;
  kapasite: string;
  marka: string;
  uretimTarihi: Timestamp | null;
  hidroTestTarihi: Timestamp | null;
  sonrakiHidroTest: Timestamp | null;
  sonDolumTarihi: Timestamp | null;
  sonrakiDolumTarihi: Timestamp | null;
  sonKontrolTarihi: Timestamp | null;
  konum: string;
  durum: TupDurumu;
  qrKod: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Islem {
  id: string;
  ownerId: string;
  tupId: string;
  musteriId: string | null;
  islemTipi: IslemTipi;
  tarih: Timestamp;
  personelId: string;
  personelAdi: string;
  notlar: string;
  oncekiDurum: string;
  yeniDurum: string;
  createdAt: Timestamp;
}

export interface Stok {
  id: string;
  ownerId: string;
  kategori: StokKategori;
  urunAdi: string;
  urunKodu: string;
  miktar: number;
  birim: string;
  minimumStok: number;
  tip: string | null;
  kapasite: string | null;
  durum: StokDurum | null;
  updatedAt: Timestamp;
}

export interface TeklifKalem {
  aciklama: string;
  miktar: number;
  birim: string;
  birimFiyat: number;
  toplam: number;
}

export interface Teklif {
  id: string;
  ownerId: string;
  musteriId: string;
  teklifNo: string;
  tarih: Timestamp;
  gecerlilikTarihi: Timestamp;
  kalemler: TeklifKalem[];
  araToplam: number;
  kdvOrani: number;
  kdvTutar: number;
  genelToplam: number;
  durum: TeklifDurumu;
  notlar: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Cari {
  id: string;
  ownerId: string;
  musteriId: string;
  islemTipi: CariIslemTipi;
  tutar: number;
  aciklama: string;
  belgeNo: string;
  tarih: Timestamp;
  createdAt: Timestamp;
}

export interface SiteAyarlari {
  fiyatlar: {
    dolumcu_starter: string;
    dolumcu_professional: string;
    dolumcu_enterprise: string;
    fabrika_premium: string;
    dolumcu_periyot: string;
    fabrika_periyot: string;
  };
  iletisim: {
    telefon: string;
    email: string;
    adres: string;
  };
  askidaUyari: string;
  updatedAt: Timestamp;
}

// Tüp kapasiteleri
export const TUP_KAPASITELERI: Record<TupTipi, string[]> = {
  KKT: ["1KG", "2KG", "4KG", "6KG", "8KG", "12KG", "25KG", "50KG", "100KG"],
  SK: ["2LT", "6LT", "9LT", "10LT", "25LT", "45LT", "50LT", "50KG", "100KG", "100LT", "150KG"],
  CO2: ["2KG", "3KG", "5KG", "6KG", "10KG", "40KG"],
};

// Paket limitleri
export const PAKET_LIMITLERI: Record<string, { maksTup: number; stok: boolean; teklif: boolean; cari: boolean }> = {
  starter: { maksTup: 100, stok: false, teklif: false, cari: false },
  professional: { maksTup: 500, stok: true, teklif: true, cari: false },
  enterprise: { maksTup: Infinity, stok: true, teklif: true, cari: true },
  fabrika_ucretsiz: { maksTup: 0, stok: false, teklif: false, cari: false },
  fabrika_premium: { maksTup: Infinity, stok: false, teklif: false, cari: false },
};

// Yedek parça ve dolum malzemeleri
export const YEDEK_PARCALAR = [
  "Tetik", "Hortum", "Manometre", "Conta", "Valf", "Emniyet pimi", "Etiket", "Askı aparatı"
];

export const DOLUM_MALZEMELERI = [
  { ad: "KKT tozu", birim: "KG" },
  { ad: "ABC tozu", birim: "KG" },
  { ad: "BC tozu", birim: "KG" },
  { ad: "Köpük solüsyonu", birim: "LT" },
  { ad: "CO2 gazı", birim: "KG" },
];
