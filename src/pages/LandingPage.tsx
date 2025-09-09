import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  MessageCircle, 
  BookOpen, 
  User, 
  Target,
  Moon,
  Sun,
  ArrowRight,
  Sparkles,
  Heart,
  Star,
  Crown,
  ChevronDown
} from 'lucide-react';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import { useTheme } from '../contexts/ThemeContext';
import PricingTable from '../components/UI/PricingTable';

const LandingPage: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const features = [
    {
      icon: MessageCircle,
      title: 'Akıllı Sohbet',
      description: 'Sofia ile her konuda sohbet et, sorularını sor ve anında cevap al',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: BookOpen,
      title: 'Ödev Yardımı',
      description: 'Ödevlerinde takıldığın yerlerde Sofia sana adım adım yardım eder',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: User,
      title: 'Kişisel Öğrenme',
      description: 'Senin öğrenme tarzına uygun kişiselleştirilmiş eğitim deneyimi',
      color: 'from-green-500 to-teal-500'
    },
    {
      icon: Target,
      title: 'Öğretmen Desteği',
      description: 'Öğretmenin gibi sabırlı ve anlayışlı bir asistan her zaman yanında',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const faqData = [
    {
      category: "🤖 Sofia Nasıl Çalışır?",
      questions: [
        {
          q: "Sofia gerçekten AI mı? Nasıl bu kadar akıllı cevaplar verebiliyor?",
          a: "Evet! Sofia, Claude AI teknolojisi kullanarak çalışan gelişmiş bir yapay zeka asistanıdır. Milyonlarca eğitim verisi ile öğrenmiş ve Türk eğitim sistemine özel olarak optimize edilmiştir."
        },
        {
          q: "Sofia'nın verdiği cevaplar güvenilir mi?",
          a: "Sofia, MEB müfredatına uygun ve doğrulanmış kaynaklardan öğrenmiştir. Ancak önemli sınavlarda veya kritik konularda öğretmeninizle de kontrol etmenizi öneririz."
        },
        {
          q: "Hangi derslerde yardım alabilirim?",
          a: "Sofia tüm okul derslerinde yardım edebilir: Matematik, Türkçe, Fen Bilimleri, Sosyal Bilgiler, İngilizce, Tarih, Coğrafya, Fizik, Kimya, Biyoloji ve daha fazlası."
        }
      ]
    },
    {
      category: "📚 Özellikler ve Kullanım",
      questions: [
        {
          q: "Sofia ile ne tür ödevler yapabilirim?",
          a: "Makale yazımı, matematik problemleri, fen deneyi raporları, tarih ödevleri, proje sunumları, PowerPoint hazırlama, PDF ders notları oluşturma ve daha birçok ödev türü."
        },
        {
          q: "LGS ve YKS deneme sınavları gerçek sınavlara benziyor mu?",
          a: "Evet! Deneme sınavlarımız gerçek LGS ve YKS formatında, güncel müfredata uygun ve geçmiş sınav sorularından esinlenerek hazırlanır. 120 dakika süre ve gerçek sınav atmosferi ile tam deneyim yaşarsınız."
        },
        {
          q: "Ödevlerimi Sofia mı yapıyor yoksa ben mi öğreniyorum?",
          a: "Sofia size rehberlik eder, açıklar ve yol gösterir. Amacımız sizin öğrenmeniz, not Sofia'nın yerinize yapması. Adım adım çözüm yolları gösterir ve kavramanızı sağlar."
        },
        {
          q: "Sofia 7/24 çalışıyor mu?",
          a: "Evet! Sofia gece gündüz demeden hizmetinizdedir. Gece yarısı bile soru sorabilir, ödev yardımı alabilirsiniz."
        }
      ]
    },
    {
      category: "💰 Planlar ve Ödeme",
      questions: [
        {
          q: "Ücretsiz planda ne kadar kullanabilirim?",
          a: "Günde 5 sohbet, ayda 2 ödev/doküman oluşturma hakkınız var. LGS/YKS denemeleri Pro+ planda mevcuttur."
        },
        {
          q: "Premium planı iptal edebilir miyim?",
          a: "Evet, istediğiniz zaman planınızı iptal edebilirsiniz. İptal sonrası mevcut dönem sonuna kadar kullanmaya devam edersiniz."
        },
        {
          q: "Öğrenci indirimi var mı?",
          a: "Şu an lansmanına özel %25-33 indirimlerimiz mevcut! Ayrıca öğrenci kimliği ile ek indirimler için iletişime geçebilirsiniz."
        }
      ]
    },
    {
      category: "🔒 Güvenlik ve Gizlilik",
      questions: [
        {
          q: "Sorularım ve ödevlerim güvende mi?",
          a: "Evet! Tüm verileriniz şifrelenerek saklanır ve kesinlikle üçüncü kişilerle paylaşılmaz. KVKK uyumlu çalışıyoruz."
        },
        {
          q: "Hesabımı nasıl silebilirim?",
          a: "Profil ayarlarından hesabınızı tamamen silebilirsiniz. Tüm verileriniz kalıcı olarak silinir."
        }
      ]
    },
    {
      category: "🎯 Sınav Hazırlığı",
      questions: [
        {
          q: "LGS'ye ne kadar süre kala başlamalıyım?",
          a: "En az 6 ay öncesinden başlamanızı öneririz. Haftada 2-3 deneme çözerek kendinizi değerlendirebilirsiniz."
        },
        {
          q: "YKS deneme sonuçları ne kadar doğru tahmin veriyor?",
          a: "Deneme sonuçlarımız gerçek YKS performansınızın %85-90'ına yakın tahminler verir. Düzenli deneme çözdükçe accuracy artar."
        },
        {
          q: "Hangi derslerden kaç soru geliyor?",
          a: "LGS: Türkçe(20), Matematik(20), Fen(20), İnkılap(10), Din(10), İngilizce(10) | TYT: Türkçe(40), Matematik(40), Fen(20), Sosyal(20) | AYT: Seçtiğiniz alana göre değişir."
        }
      ]
    }
  ];

  // Flatten FAQ data for indexing
  const allFAQs = faqData.flatMap((category, categoryIndex) =>
    category.questions.map((faq, questionIndex) => ({
      ...faq,
      category: category.category,
      globalIndex: categoryIndex * 100 + questionIndex
    }))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-purple-900/20 dark:to-blue-900/20">
      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Okul Asistanım</h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">Sofia ile Öğren</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-4"
          >
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <Link to="/login">
              <Button variant="outline">Giriş Yap</Button>
            </Link>
            <Link to="/register">
              <Button>Kayıt Ol</Button>
            </Link>
          </motion.div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6">
              Okul Asistanım'a
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Hoş Geldin
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Merhaba! Ben Sofia, senin kişisel öğrenme asistanın. 
              Okul hayatında karşılaştığın her konuda sana yardım etmek için buradayım.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12 text-center"
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/register">
                <Button className="px-8 py-4 text-lg">
                  Sofia ile Tanış
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" className="px-8 py-4 text-lg">
                  Zaten Üyeyim
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Sofia Introduction */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="mb-20"
          >
            <Card className="max-w-2xl mx-auto p-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Merhaba, Ben Sofia! 👋
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                Okul Asistanım uygulamasına hoş geldin. Ben yardımcın Sofia. 
                Matematik'ten Fen Bilgisi'ne, Türkçe'den İngilizce'ye kadar 
                tüm derslerinde sana yardım etmek için buradayım. 
                Birlikte öğrenmeyi çok daha eğlenceli hale getireceğiz!
              </p>
              <div className="flex justify-center mt-4 space-x-2">
                <Heart className="w-5 h-5 text-red-500" />
                <Star className="w-5 h-5 text-yellow-500" />
                <Heart className="w-5 h-5 text-red-500" />
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-white/50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Sofia ile Neler Yapabilirsin?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Öğrenme yolculuğunda sana eşlik edecek harika özellikler
            </p>
          </motion.div>

          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 max-w-7xl">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + index * 0.1 }}
                >
                  <Card className="p-6 h-full text-center transition-all duration-300 hover:shadow-xl bg-white dark:bg-gray-800">
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </Card>
                </motion.div>
              ))}
              
              {/* LGS Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 }}
                className="relative"
              >
                {/* Star Icons */}
                <div className="absolute -top-1 -left-1 text-yellow-400 z-10">
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <div className="absolute -bottom-1 -right-1 text-yellow-400 z-10">
                  <Star className="w-4 h-4 fill-current" />
                </div>
                
                <Card className="p-6 h-full text-center transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 hover:scale-105 bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/20 border-2 border-transparent bg-clip-padding before:absolute before:inset-0 before:p-[2px] before:bg-gradient-to-r before:from-purple-500 before:to-pink-500 before:rounded-xl before:-z-10 relative">
                  {/* Premium Badge */}
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1 shadow-lg z-10">
                    <Crown className="w-3 h-3" />
                    <span>Pro+ Özelliği</span>
                  </div>
                  
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-black dark:text-white">
                    LGS'ye Hazırlan
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    AI destekli deneme sınavları ile LGS'ye tam hazırlık. Gerçek sınav deneyimi yaşa.
                  </p>
                </Card>
              </motion.div>
              
              {/* YKS Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
                className="relative"
              >
                {/* Star Icons */}
                <div className="absolute -top-1 -left-1 text-yellow-400 z-10">
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <div className="absolute -bottom-1 -right-1 text-yellow-400 z-10">
                  <Star className="w-4 h-4 fill-current" />
                </div>
                
                <Card className="p-6 h-full text-center transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 hover:scale-105 bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/20 border-2 border-transparent bg-clip-padding before:absolute before:inset-0 before:p-[2px] before:bg-gradient-to-r before:from-blue-500 before:to-purple-500 before:rounded-xl before:-z-10 relative">
                  {/* Premium Badge */}
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1 shadow-lg z-10">
                    <Crown className="w-3 h-3" />
                    <span>Pro+ Özelliği</span>
                  </div>
                  
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <GraduationCap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-black dark:text-white">
                    YKS'ye Hazırlan
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    TYT ve AYT deneme sınavları ile üniversite hayallerine ulaş. Hedef odaklı hazırlık.
                  </p>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Planını Seç ve Hemen Başla!
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Öğrenme yolculuğunda sana en uygun planı seç
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 }}
          >
            <PricingTable />
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-6 py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Sofia'yı Tanıyın... - S.S.S.
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Sofia hakkında merak ettiklerinizin cevapları
            </p>
          </motion.div>

          <div className="space-y-6">
            {faqData.map((category, categoryIndex) => (
              <motion.div
                key={categoryIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.2 + categoryIndex * 0.1 }}
              >
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {category.category}
                </h3>
                <div className="space-y-3">
                  {category.questions.map((faq, questionIndex) => {
                    const globalIndex = categoryIndex * 100 + questionIndex;
                    const isExpanded = expandedFAQ === globalIndex;
                    
                    return (
                      <Card key={questionIndex} className="overflow-hidden">
                        <button
                          onClick={() => toggleFAQ(globalIndex)}
                          className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200"
                        >
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white pr-4">
                            {faq.q}
                          </h4>
                          <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                            className="flex-shrink-0"
                          >
                            <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                          </motion.div>
                        </button>
                        
                        <motion.div
                          initial={false}
                          animate={{
                            height: isExpanded ? 'auto' : 0,
                            opacity: isExpanded ? 1 : 0
                          }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 pt-0">
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                {faq.a}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      </Card>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Öğrenme Macerana Başla!
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Sofia seni bekliyor. Hemen kayıt ol ve kişiselleştirilmiş öğrenme deneyimini keşfet.
            </p>
            <Link to="/register">
              <Button className="px-12 py-4 text-xl">
                Hemen Başla
                <ArrowRight className="w-6 h-6 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            © 2024 Okul Asistanım. Tüm hakları saklıdır. Sofia ile öğrenmenin keyfini çıkar! 🎓
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;