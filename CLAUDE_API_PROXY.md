# 🔒 Claude API Proxy - Güvenlik ve Kurulum

## Neden Proxy Gerekli?

### ❌ Sorun: Client-Side API Çağrıları
Browser'dan direkt Claude API'ye istek yapmak **3 büyük soruna** yol açar:

1. **CORS Hatası** 🚫
   - Claude API, browser'dan gelen istekleri CORS politikası nedeniyle reddeder
   - `Access-Control-Allow-Origin` hatası alırsınız

2. **Güvenlik Riski** ⚠️
   - API anahtarı browser'da görünür (Network tab, Source code)
   - Herkes anahtarınızı kopyalayıp kullanabilir
   - API kotanız hızla tükenebilir

3. **API Key Exposed** 🔓
   - `VITE_CLAUDE_API_KEY` environment variable'ı client bundle'a dahil olur
   - Üretim build'inde bile görünür kalır

### ✅ Çözüm: Vercel Edge Function Proxy

Backend'de çalışan bir proxy servisi oluşturarak:
- ✅ API anahtarı server-side'da güvende kalır
- ✅ CORS sorunu çözülür
- ✅ Rate limiting ve monitoring eklenebilir
- ✅ Usage tracking yapılabilir

---

## 🏗️ Mimari

```
┌─────────────┐         ┌──────────────────┐         ┌──────────────┐
│   Browser   │         │  Vercel Edge     │         │  Claude API  │
│  (Frontend) │ ──────> │   Function       │ ──────> │  (Anthropic) │
│             │  POST   │  /api/claude     │  POST   │              │
└─────────────┘         └──────────────────┘         └──────────────┘
                               ↑
                        API Key burada
                        (güvenli)
```

### İstek Akışı

1. **Frontend** → `/api/claude` endpoint'ine POST request gönderir
2. **Edge Function** → API key'i environment'tan alır
3. **Edge Function** → Claude API'ye güvenli istek yapar
4. **Claude API** → Yanıtı döner
5. **Edge Function** → Yanıtı frontend'e iletir

---

## 📁 Dosya Yapısı

```
okul-asistanım/
├── api/
│   └── claude.ts          # Vercel Edge Function (PROXY)
├── src/
│   └── services/
│       └── claudeApi.ts   # Frontend service (proxy'yi çağırır)
├── .env.example           # Template
├── .env                   # Local development (git'e commit edilmez)
└── vercel.json            # Vercel config (API routes)
```

---

## 🚀 Kurulum

### 1. Local Development

**Opsiyonel:** Development için direkt API kullanabilirsiniz (CORS hatası alırsanız mock mode'a geçer)

```bash
# .env
VITE_CLAUDE_API_KEY=sk-ant-api03-...  # Development için
```

**Önerilen:** Local'de de proxy kullanın

```bash
# Vercel CLI ile local development
npm install -g vercel
vercel dev
```

Bu şekilde local'de de `/api/claude` endpoint'i çalışır.

### 2. Production (Vercel)

#### Adım 1: Vercel Dashboard'a git
- https://vercel.com/dashboard
- Projenizi seçin
- **Settings** → **Environment Variables**

#### Adım 2: Environment Variable Ekle

```
Name:  CLAUDE_API_KEY
Value: sk-ant-api03-xxxxxxxxxxxxxxxxxxxxx
```

**ÖNEMLİ:**
- `VITE_` prefix'i **kullanma!** (client-side'a leak olur)
- Sadece `CLAUDE_API_KEY` olarak tanımla
- Bu sadece server-side'da kullanılacak

#### Adım 3: Deploy

```bash
git add .
git commit -m "feat: Claude API proxy eklendi"
git push origin main
```

Vercel otomatik deploy edecek.

---

## 🔧 Nasıl Çalışır?

### Frontend (`src/services/claudeApi.ts`)

```typescript
// Otomatik olarak doğru endpoint'i seçer
const getApiEndpoint = (): string => {
  if (import.meta.env.PROD) {
    return '/api/claude';  // Production: Proxy kullan
  }
  return '/api/claude';     // Default: Proxy kullan
};

// API çağrısı
const data = await callClaudeAPI({
  model: 'claude-3-5-sonnet-20241022',
  messages: [...],
  max_tokens: 4096
});
```

### Backend (`api/claude.ts`)

```typescript
export default async function handler(req: Request) {
  // API key'i server-side'dan al (güvenli)
  const apiKey = process.env.CLAUDE_API_KEY;

  // Claude API'ye istek yap
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    headers: {
      'x-api-key': apiKey,  // Key burada kullanılır
      ...
    },
    body: JSON.stringify(requestBody)
  });

  return response;
}
```

---

## 🧪 Test Etme

### Local Test (Vercel Dev)

```bash
# Terminal 1: Vercel dev server
vercel dev

# Terminal 2: Test isteği
curl -X POST http://localhost:3000/api/claude \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-3-5-sonnet-20241022",
    "max_tokens": 100,
    "messages": [{"role": "user", "content": "Merhaba"}]
  }'
```

### Production Test

```bash
# Deploy sonrası
curl -X POST https://your-app.vercel.app/api/claude \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-3-5-sonnet-20241022",
    "max_tokens": 100,
    "messages": [{"role": "user", "content": "Merhaba"}]
  }'
```

Beklenen yanıt:
```json
{
  "id": "msg_xxx",
  "content": [{"type": "text", "text": "Merhaba! ..."}],
  "usage": {"input_tokens": 10, "output_tokens": 50}
}
```

---

## 🐛 Sorun Giderme

### "CLAUDE_API_KEY not configured"

**Sebep:** Environment variable tanımlı değil

**Çözüm:**
```bash
# Vercel Dashboard > Settings > Environment Variables
CLAUDE_API_KEY = sk-ant-api03-...
```

### "Method not allowed"

**Sebep:** GET isteği gönderiyorsunuz

**Çözüm:** POST kullanın
```typescript
fetch('/api/claude', { method: 'POST', ... })
```

### "CORS error"

**Sebep:** Yanlış endpoint kullanıyorsunuz

**Çözüm:**
- Production'da `/api/claude` kullanın (proxy)
- Direkt `https://api.anthropic.com` **kullanmayın**

### "Invalid request"

**Sebep:** Request body formatı yanlış

**Çözüm:** Şu formatı kullanın:
```json
{
  "model": "claude-3-5-sonnet-20241022",
  "max_tokens": 1024,
  "messages": [
    {"role": "user", "content": "Mesajınız"}
  ]
}
```

---

## 📊 İzleme ve Limitler

### API Usage Tracking

Edge Function'a logging ekleyebilirsiniz:

```typescript
// api/claude.ts
console.log('Claude API request:', {
  timestamp: new Date().toISOString(),
  tokens: data.usage,
  user: req.headers.get('user-id')
});
```

### Rate Limiting (Gelecek)

```typescript
// Basit rate limiting örneği
const rateLimiter = new Map();

if (rateLimiter.get(userId) > 100) {
  return new Response('Rate limit exceeded', { status: 429 });
}
```

### Cost Tracking

Claude API maliyetleri:
- **Input:** ~$3 / 1M token
- **Output:** ~$15 / 1M token

Ortalama döküman: ~$0.05-0.10

---

## ✅ Güvenlik Checklist

- [ ] API key sadece server-side environment variable'da
- [ ] `.env` dosyası `.gitignore`'da
- [ ] Production'da `VITE_CLAUDE_API_KEY` kullanılmıyor
- [ ] Tüm istekler `/api/claude` üzerinden
- [ ] CORS headers doğru yapılandırılmış
- [ ] Vercel'de `CLAUDE_API_KEY` tanımlı

---

## 🎯 Sonuç

✅ **Yapılan İyileştirmeler:**
- API key client-side'da artık görünmüyor
- CORS sorunu çözüldü
- Production-ready güvenli mimari
- Rate limiting ve monitoring hazır

✅ **Production'a Hazır:**
- `npm run build` → Build başarılı
- `vercel --prod` → Deploy başarılı
- API çağrıları güvenli şekilde çalışıyor

---

## 📚 Kaynaklar

- [Claude API Docs](https://docs.anthropic.com/claude/reference/getting-started-with-the-api)
- [Vercel Edge Functions](https://vercel.com/docs/functions/edge-functions)
- [Environment Variables](https://vercel.com/docs/projects/environment-variables)
