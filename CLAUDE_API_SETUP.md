# Claude API Entegrasyonu - Kurulum Rehberi

Bu rehber, Okul Asistanım uygulamasına Claude AI API'sinin nasıl entegre edileceğini açıklar.

## 📋 Gereksinimler

- Anthropic Claude API hesabı
- API anahtarı (API Key)
- Node.js ve npm kurulu olmalı

## 🔑 1. Claude API Anahtarı Alma

1. [Anthropic Console](https://console.anthropic.com/) adresine gidin
2. Hesap oluşturun veya giriş yapın
3. **API Keys** bölümüne gidin
4. **Create Key** butonuna tıklayın
5. Anahtarınızı güvenli bir yere kaydedin (bu anahtarı bir daha göremeyeceksiniz!)

## ⚙️ 2. Proje Yapılandırması

### .env Dosyası Oluşturma

Projenin kök dizininde `.env` dosyası oluşturun:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Claude AI API Configuration
VITE_CLAUDE_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxx
```

**Önemli:** `.env` dosyası `.gitignore` içinde olmalı ve asla git'e commit edilmemelidir!

### Örnek .env.example Dosyası

`.env.example` dosyası şablon olarak kullanılabilir:

```bash
cp .env.example .env
```

Ardından `.env` dosyasını düzenleyerek gerçek API anahtarınızı ekleyin.

## 🏗️ 3. Entegrasyon Detayları

### Dosya Yapısı

```
src/
├── services/
│   └── claudeApi.ts          # Claude API servisi
├── types/
│   └── ai.ts                 # AI servisi type tanımlamaları
└── pages/
    └── DocumentGeneratorPage.tsx  # Döküman oluşturucu sayfa
```

### Kullanılan Claude API Özellikleri

- **Model:** `claude-3-5-sonnet-20241022` (En güncel Sonnet modeli)
- **API Version:** `2023-06-01`
- **Endpoint:** `https://api.anthropic.com/v1/messages`

### Servis Fonksiyonları

#### 1. `generateDocumentContent()`

Eğitim dokümanları oluşturur:

```typescript
const result = await generateDocumentContent({
  topic: 'Pisagor Teoremi',
  content: 'Dik üçgenlerde kenar uzunlukları arasındaki ilişki...',
  subject: 'Matematik',
  gradeLevel: '8. Sınıf',
  length: 'medium',
  documentType: 'pdf'
});
```

#### 2. `generateChatResponse()`

Sofia chatbot için yanıtlar üretir:

```typescript
const response = await generateChatResponse(
  'Pisagor teoremi nedir?',
  'Matematik dersi - 8. Sınıf'
);
```

#### 3. `isClaudeConfigured()`

API'nin yapılandırılıp yapılandırılmadığını kontrol eder:

```typescript
if (isClaudeConfigured()) {
  // Claude API kullan
} else {
  // Demo mod
}
```

## 🎨 4. Özellikler

### Akıllı Döküman Oluşturma

Claude AI, öğrencinin:
- Sınıf seviyesini
- Ders konusunu
- Ödev içeriğini
- Öğrenme tercihlerini

analiz ederek kişiselleştirilmiş eğitim materyalleri oluşturur.

### Demo Modu

API anahtarı yoksa:
- Uygulama otomatik olarak demo moduna geçer
- Kullanıcıya sarı uyarı kutusu gösterilir
- Temel şablon içerik sunulur
- Geliştirme sırasında API kotası harcanmaz

## 🔒 5. Güvenlik

### API Anahtarı Güvenliği

- ✅ API anahtarlarını **asla** kodda hardcode etmeyin
- ✅ `.env` dosyasını `.gitignore` ekleyin
- ✅ Production'da environment variables kullanın
- ✅ API anahtarlarını düzenli olarak rotate edin

### Rate Limiting

Claude API'nin kullanım limitleri vardır:
- Ücretsiz tier: Dakikada ~50 istek
- Paid tiers: Daha yüksek limitler

Kod, hata yönetimi ile donatılmıştır:
```typescript
try {
  const result = await generateDocumentContent(request);
} catch (error) {
  // Hata mesajı kullanıcıya gösterilir
  // Fallback içerik sunulur
}
```

## 🚀 6. Deployment (Vercel)

Vercel'de environment variables ayarlama:

1. Vercel Dashboard > Project Settings > Environment Variables
2. Aşağıdaki değişkenleri ekleyin:
   - `VITE_CLAUDE_API_KEY`: Claude API anahtarınız
   - `VITE_SUPABASE_URL`: Supabase URL
   - `VITE_SUPABASE_ANON_KEY`: Supabase anon key

3. **Production**, **Preview**, ve **Development** ortamları için ayrı ayrı seçin
4. **Save** butonuna tıklayın
5. Projeyi yeniden deploy edin

## 📊 7. Maliyetler ve Kotalar

### Claude API Fiyatlandırma (Sonnet 3.5)

- **Input tokens:** ~$3 / 1M token
- **Output tokens:** ~$15 / 1M token

### Ortalama Kullanım

Bir döküman oluşturma işlemi için:
- Input: ~500-1000 token
- Output: ~1500-3000 token
- **Maliyet:** ~$0.05-0.10 per döküman

### Optimizasyon İpuçları

1. **Kısa içerik tercih edin:** `length: 'short'` daha az token kullanır
2. **Cache kullanımı:** Tekrar eden promptları önbellekleyin
3. **Batch işlemler:** Mümkünse istekleri gruplandırın

## 🧪 8. Test Etme

### Manuel Test

1. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

2. Döküman Oluştur sayfasına gidin
3. Formu doldurun ve "Sofia ile Oluştur" butonuna tıklayın
4. Konsolu kontrol edin:
   - Demo modda: "Claude API yapılandırılmamış" uyarısı
   - Production'da: API çağrısı logları

### Hata Ayıklama

Browser Console'da kontrol edin:
```javascript
// API yapılandırılmış mı?
console.log('Claude configured:', isClaudeConfigured());

// API anahtarı var mı? (sadece varlığını kontrol eder, değerini göstermez)
console.log('Has API key:', !!import.meta.env.VITE_CLAUDE_API_KEY);
```

## 📚 9. Gelişmiş Kullanım

### Custom Prompts

`src/services/claudeApi.ts` dosyasında system ve user promptları özelleştirebilirsiniz:

```typescript
const systemPrompt = `Sen Sofia, bir eğitim asistanısın...
[Özel talimatlarınız]`;
```

### Temperature Ayarı

Yaratıcılık seviyesini ayarlayın (0.0 - 1.0):
- **0.5:** Tutarlı, tahmin edilebilir
- **0.7:** Dengeli (varsayılan)
- **0.9:** Yaratıcı, çeşitli

### Token Limitleri

Döküman uzunluğuna göre otomatik ayarlanır:
```typescript
max_tokens: request.length === 'long' ? 4096 :
            request.length === 'medium' ? 3072 : 2048
```

## 🐛 10. Sorun Giderme

### "Claude API key bulunamadı" Hatası

**Neden:** `.env` dosyası eksik veya yanlış yapılandırılmış

**Çözüm:**
1. `.env` dosyasının var olduğunu kontrol edin
2. `VITE_CLAUDE_API_KEY` değişkeninin doğru yazıldığını kontrol edin
3. Değerin `sk-ant-api03-` ile başladığını kontrol edin
4. Dev sunucusunu yeniden başlatın: `npm run dev`

### API İstek Hatası

**Neden:** Geçersiz API anahtarı veya rate limit

**Çözüm:**
1. API anahtarının geçerli olduğunu kontrol edin
2. [Anthropic Console](https://console.anthropic.com/) kullanım limitlerini kontrol edin
3. Birkaç dakika bekleyip tekrar deneyin

### CORS Hatası

**Neden:** API istekleri browser'dan direkt gönderilemiyor

**Çözüm:**
- Bu proje doğrudan browser'dan API çağrısı yapacak şekilde tasarlanmıştır
- Anthropic API CORS desteklemiyorsa, bir proxy backend eklemeniz gerekebilir

## 📞 11. Destek ve Kaynaklar

- [Anthropic Documentation](https://docs.anthropic.com/)
- [Claude API Reference](https://docs.anthropic.com/claude/reference)
- [Pricing Information](https://www.anthropic.com/pricing)
- [Rate Limits](https://docs.anthropic.com/claude/reference/rate-limits)

## ✅ 12. Checklist

Deployment öncesi kontrol listesi:

- [ ] `.env` dosyası oluşturuldu ve API anahtarı eklendi
- [ ] `.gitignore` içinde `.env` var
- [ ] Vercel environment variables ayarlandı
- [ ] Test dökümanı oluşturuldu ve çalıştığı doğrulandı
- [ ] Error handling test edildi
- [ ] Demo modu test edildi
- [ ] Production build başarılı: `npm run build`
- [ ] ESLint hataları temizlendi: `npm run lint`

## 🎉 Kurulum Tamamlandı!

Artık Claude AI ile güçlendirilmiş Okul Asistanım uygulamanız hazır. Sofia, öğrencileriniz için kişiselleştirilmiş eğitim materyalleri oluşturabilir!
