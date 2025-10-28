# Okul Asistanım - Sofia 🎓

AI destekli eğitim asistanı platformu. Öğrencilerin derslerinde başarılı olmaları için yapay zeka teknolojisi ile kişiselleştirilmiş öğrenme deneyimi sunar.

## 🚀 Hızlı Başlangıç

### Development Mode (Supabase olmadan)

Projeyi **hemen** çalıştırmak için:

```bash
npm install
npm run dev
```

Uygulama otomatik olarak **development mode**'da çalışacak ve mock data kullanacaktır. Tarayıcınızda şu uyarıyı göreceksiniz:

```
⚠️ Supabase credentials are missing. Running in DEVELOPMENT MODE with mock data.
```

Bu normal! Herhangi bir email/şifre ile giriş yapabilirsiniz.

### Production Mode (Supabase ile)

Gerçek backend kullanmak için:

1. Proje kök dizininde `.env` dosyası oluşturun:

```bash
# .env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

2. Supabase'i ayarlayın (detaylar için [DEPLOYMENT.md](DEPLOYMENT.md) dosyasına bakın)

3. Uygulamayı çalıştırın:

```bash
npm run dev
```

## 📦 Özellikler

- ✅ **Sofia AI Chat** - Ders konularında AI destekli sohbet
- ✅ **Sınav Simülatörü** - LGS ve YKS deneme sınavları
- ✅ **Döküman Oluşturucu** - AI ile özel ders notları
- ✅ **Kullanıcı Profili** - Kişiselleştirilmiş öğrenme takibi
- ✅ **Dark Mode** - Göz dostu arayüz
- ✅ **Responsive Design** - Mobil ve masaüstü uyumlu

## 🛠️ Teknolojiler

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** TailwindCSS + Framer Motion
- **Backend:** Supabase (Auth + Database)
- **Deployment:** Vercel
- **Icons:** Lucide React
- **Charts:** Chart.js
- **PDF/DOCX:** jsPDF + docx

## 📁 Proje Yapısı

```
okul-asistanım/
├── src/
│   ├── components/       # React bileşenleri
│   │   ├── UI/          # Ortak UI bileşenleri
│   │   ├── Layout/      # Layout bileşenleri
│   │   └── Exam/        # Sınav bileşenleri
│   ├── contexts/        # React Context (Auth, Chat, Theme)
│   ├── data/            # Static data
│   ├── lib/             # Utilities (Supabase client)
│   ├── pages/           # Sayfa bileşenleri
│   ├── types/           # TypeScript tipleri
│   └── App.tsx          # Ana uygulama
├── supabase/
│   └── schema.sql       # Database şeması
├── .env.example         # Örnek environment variables
├── vercel.json          # Vercel yapılandırması
└── DEPLOYMENT.md        # Deployment rehberi
```

## 🔧 Kullanılabilir Komutlar

```bash
# Development server başlat
npm run dev

# Production build
npm run build

# Production preview
npm run preview

# Lint kontrolü
npm run lint
```

## 🎯 Development Mode Özellikleri

Development mode'da (Supabase olmadan):

- ✅ Mock kullanıcı ile otomatik giriş
- ✅ Örnek sohbet geçmişi
- ✅ Tüm UI özellikleri çalışır
- ✅ Data localStorage'da saklanır
- ✅ Production'a geçiş sorunsuz

## 🚢 Deployment

Detaylı deployment talimatları için [DEPLOYMENT.md](DEPLOYMENT.md) dosyasına bakın.

### Kısa Özet

1. **Supabase:** Proje oluştur → SQL şemasını çalıştır → API keys al
2. **Vercel:** GitHub'a push et → Import project → Environment variables ekle
3. **Deploy!** 🎉

## 🔐 Environment Variables

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...
```

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'feat: Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📝 Lisans

Bu proje özel bir eğitim projesidir.

## 👨‍💻 Geliştirici

Geliştirme sırasında sorularınız için issue açabilirsiniz.

## 🎓 Sofia Hakkında

Sofia, Okul Asistanım platformunun AI asistanıdır. Öğrencilere:

- Ders konularını anlamada yardımcı olur
- Sınav hazırlığı için rehberlik eder
- Özel çalışma materyalleri oluşturur
- Kişiselleştirilmiş öğrenme deneyimi sunar

---

**Not:** Development mode'da Supabase olmadan çalışabilmeniz için özel olarak yapılandırıldı. Production'a geçtiğinizde `.env` dosyası ekleyin.
