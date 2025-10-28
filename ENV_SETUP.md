# 🔧 Environment Variables Kurulum Rehberi

## 📋 Gerekli Adımlar

### 1️⃣ Supabase Kurulumu

1. **Supabase Projesi Oluştur**
   - https://supabase.com adresine git
   - "New Project" butonuna tıkla
   - Proje adı: `okul-asistanim`
   - Database şifresi belirle (güçlü şifre kullan!)
   - Region: `Europe Central (Frankfurt)` (Türkiye'ye en yakın)

2. **Database Şemasını Yükle**
   ```bash
   # Supabase Dashboard > SQL Editor > New Query
   # supabase/schema.sql dosyasının içeriğini yapıştır ve çalıştır
   ```

3. **API Anahtarlarını Al**
   - Dashboard > Settings > API
   - `Project URL` → `.env` dosyasına kopyala
   - `anon/public` key → `.env` dosyasına kopyala

### 2️⃣ Claude AI API Kurulumu

1. **API Anahtarı Al**
   - https://console.anthropic.com/ adresine git
   - "API Keys" bölümüne git
   - "Create Key" butonuna tıkla
   - Key adı: `okul-asistanim-dev`
   - Anahtarı kopyala

2. **⚠️ ÖNEMLİ GÜVENLİK UYARISI**
   - Bu anahtarı **ASLA** git'e commit etme!
   - Browser'dan direkt kullanma (CORS hatası + güvenlik riski)
   - Sadece development için geçici kullan
   - Production'da **mutlaka** backend proxy kullan

### 3️⃣ .env Dosyasını Yapılandır

1. **Development için .env dosyasını düzenle:**

```bash
# .env dosyası (GİT'E COMMIT EDİLMEZ!)

# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...your-actual-key...

# Claude AI API Configuration
# ⚠️ Sadece development için! Production'da kullanma!
VITE_CLAUDE_API_KEY=sk-ant-api03-...your-actual-key...
```

2. **Dosyayı kaydet ve uygulamayı yeniden başlat:**

```bash
npm run dev
```

### 4️⃣ Supabase Yapılandırması

1. **Authentication Settings**
   - Dashboard > Authentication > Settings
   - Site URL: `http://localhost:5173` (development)
   - Redirect URLs: `http://localhost:5173/**`

2. **Email Templates** (Opsiyonel)
   - Dashboard > Authentication > Email Templates
   - "Confirm signup" template'ini Türkçe'ye çevir

### 5️⃣ Production Deployment (Vercel)

**Vercel'de environment variables ekle:**

1. Vercel Dashboard > Project Settings > Environment Variables
2. Şu değişkenleri ekle:

```
VITE_SUPABASE_URL = https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGci...your-actual-key...
```

3. **Claude API için:**
   - `VITE_CLAUDE_API_KEY` **ekleme!** (güvenlik riski)
   - Bunun yerine Vercel Edge Function kullan (4. görev)

### 6️⃣ Supabase Production Settings

**Production URL'leri güncelle:**

1. Dashboard > Authentication > Settings
2. Site URL: `https://okul-asistanim.vercel.app`
3. Redirect URLs: `https://okul-asistanim.vercel.app/**`

---

## ✅ Kurulum Testi

Kurulumun doğru olduğunu test etmek için:

```bash
npm run dev
```

1. Kayıt ol sayfasına git
2. Yeni bir hesap oluştur
3. Email doğrulama linkine tıkla
4. Giriş yap
5. Dashboard'u gör

Eğer hata alırsan:
- Browser console'u kontrol et (F12)
- Network tab'ında API isteklerini incele
- Supabase logs'ları kontrol et (Dashboard > Logs)

---

## 🆘 Sık Karşılaşılan Sorunlar

### "Invalid API key" hatası
- `.env` dosyasında anahtarları tekrar kontrol et
- Uygulamayı yeniden başlat (`npm run dev`)
- `node_modules/.vite` cache'ini temizle

### "CORS error" hatası (Claude API)
- Normal! Browser'dan direkt istek yapılamıyor
- Şimdilik mock mode kullan (VITE_CLAUDE_API_KEY boş bırak)
- Edge Function kurulumu için 4. görevi bekle

### Supabase bağlantı hatası
- Project URL'i doğru mu?
- Anon key doğru mu?
- Supabase projesi aktif mi?
- Network bağlantını kontrol et

---

## 📚 Ek Kaynaklar

- [Supabase Dokümantasyonu](https://supabase.com/docs)
- [Claude API Dokümantasyonu](https://docs.anthropic.com)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)
- Proje içi: `CLAUDE_API_SETUP.md`
- Proje içi: `DEPLOYMENT.md`
