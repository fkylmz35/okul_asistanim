# Okul Asistanım - Deployment Rehberi

Bu rehber, Okul Asistanım uygulamasını Vercel ve Supabase kullanarak yayınlamanız için adım adım talimatlar içerir.

## 📋 Ön Gereksinimler

- [Supabase](https://supabase.com) hesabı
- [Vercel](https://vercel.com) hesabı
- [Git](https://git-scm.com/) yüklü
- [Node.js](https://nodejs.org/) (v18 veya üzeri)

## 🗄️ 1. Supabase Kurulumu

### 1.1 Yeni Proje Oluşturma

1. [Supabase Dashboard](https://app.supabase.com)'a gidin
2. "New Project" butonuna tıklayın
3. Proje adı ve şifre belirleyin (şifrenizi kaydedin!)
4. Region seçin (en yakın bölgeyi seçin, örn: Frankfurt)
5. "Create new project" butonuna tıklayın

### 1.2 Database Şemasını Oluşturma

1. Sol menüden **SQL Editor**'a gidin
2. `supabase/schema.sql` dosyasının içeriğini kopyalayın
3. SQL Editor'a yapıştırın
4. "Run" butonuna tıklayarak çalıştırın
5. Başarılı mesajını görmelisiniz

### 1.3 API Anahtarlarını Alma

1. Sol menüden **Settings** > **API**'ye gidin
2. Şu değerleri kopyalayın:
   - **Project URL** (örn: `https://xxxxx.supabase.co`)
   - **anon public** key (uzun bir string)

## 🚀 2. Vercel Deployment

### 2.1 GitHub'a Yükleme

Projenizi henüz GitHub'a yüklemediyseniz:

```bash
# Terminal'de proje klasörüne gidin
cd "c:\Users\fkylm\OneDrive\Desktop\okul asistanım"

# Git repository başlatın (eğer henüz başlatılmadıysa)
git init

# Tüm dosyaları ekleyin
git add .

# İlk commit'i yapın
git commit -m "Initial commit with Supabase integration"

# GitHub'da yeni bir repository oluşturun (github.com'da)
# Sonra aşağıdaki komutu çalıştırın (YOUR_USERNAME ve YOUR_REPO değiştirin)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

### 2.2 Vercel'e Deploy Etme

1. [Vercel Dashboard](https://vercel.com/dashboard)'a gidin
2. "Add New..." > "Project" seçin
3. GitHub repository'nizi seçin
4. "Import" butonuna tıklayın

### 2.3 Environment Variables Ayarlama

1. "Configure Project" ekranında **Environment Variables** bölümüne gidin
2. Şu değişkenleri ekleyin:

   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

   (Supabase'den aldığınız değerleri buraya yapıştırın)

3. "Deploy" butonuna tıklayın

### 2.4 Deployment Tamamlandı! 🎉

Deploy işlemi birkaç dakika sürecek. Tamamlandığında:
- Vercel size bir URL verecek (örn: `your-app.vercel.app`)
- Bu URL üzerinden uygulamanıza erişebilirsiniz

## 🔐 3. Supabase Email Authentication Ayarları

### 3.1 Email Templates (Opsiyonel ama Önerilen)

1. Supabase Dashboard > **Authentication** > **Email Templates**
2. "Confirm Signup" template'ini düzenleyin
3. `{{ .ConfirmationURL }}` linkini Vercel URL'iniz ile güncelleyin

### 3.2 Site URL Ayarlama

1. Supabase Dashboard > **Authentication** > **URL Configuration**
2. **Site URL** alanına Vercel URL'inizi ekleyin:
   ```
   https://your-app.vercel.app
   ```
3. **Redirect URLs** alanına da aynı URL'i ekleyin

## 🧪 4. Uygulamayı Test Etme

1. Vercel URL'inize gidin
2. "Kayıt Ol" butonuna tıklayın
3. Yeni bir hesap oluşturun
4. Email onay linkine tıklayın (spam klasörünü kontrol edin)
5. Giriş yapın ve uygulamayı kullanmaya başlayın!

## 🔄 5. Güncellemeler ve Değişiklikler

Kodda değişiklik yaptığınızda:

```bash
# Değişiklikleri commit edin
git add .
git commit -m "Açıklayıcı mesaj"

# GitHub'a push edin
git push

# Vercel otomatik olarak yeniden deploy edecek!
```

## 🐛 6. Sorun Giderme

### Problem: "Invalid API credentials"

**Çözüm:**
- Vercel'deki environment variables'ları kontrol edin
- Değerlerin Supabase'den doğru kopyalandığından emin olun
- Deployment'ı yeniden başlatın (Vercel Dashboard > Deployments > ... > Redeploy)

### Problem: "Database connection failed"

**Çözüm:**
- Supabase SQL Editor'da `schema.sql` dosyasının tamamen çalıştığından emin olun
- Supabase projenizin aktif olduğundan emin olun
- RLS (Row Level Security) politikalarının doğru kurulduğunu kontrol edin

### Problem: "Email confirmation not working"

**Çözüm:**
- Supabase Dashboard > Authentication > URL Configuration'da Site URL'in doğru olduğundan emin olun
- Spam klasörünü kontrol edin
- Email Templates'in doğru yapılandırıldığından emin olun

### Problem: Build hatası

**Çözüm:**
```bash
# Lokal olarak build'i test edin
npm run build

# Eğer hata varsa, hataları düzeltin ve tekrar deneyin
```

## 📊 7. Database Yönetimi

### Kullanıcı Verilerini Görüntüleme

1. Supabase Dashboard > **Table Editor**
2. Tablolara göz atın: `profiles`, `conversations`, `messages`, `subscriptions`
3. Verileri görüntüleyebilir ve düzenleyebilirsiniz

### Backup Alma

1. Supabase Dashboard > **Database** > **Backups**
2. Manuel backup oluşturabilirsiniz
3. Otomatik backup'lar da yapılandırılabilir

## 🎨 8. Özelleştirmeler

### Custom Domain Ekleme

1. Vercel Dashboard > Project > Settings > Domains
2. Kendi domain'inizi ekleyin
3. DNS ayarlarını yapılandırın

### Analytics

1. Vercel Dashboard > Project > Analytics
2. Vercel Analytics'i etkinleştirin
3. Kullanıcı davranışlarını izleyin

## 📞 9. Destek

Sorun yaşarsanız:
- Supabase Documentation: https://supabase.com/docs
- Vercel Documentation: https://vercel.com/docs
- GitHub Issues: Projenizde issue açabilirsiniz

## 🎉 Tebrikler!

Uygulamanız artık canlı ve kullanıma hazır! 🚀

Sofia ile öğrencilere yardımcı olmaya başlayabilirsiniz.
