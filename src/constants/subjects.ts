// Türkiye Milli Eğitim Müfredatına Göre Dersler (5-12. Sınıf)

export interface SubjectsByGrade {
  [key: string]: string[];
}

export const SUBJECTS_BY_GRADE: SubjectsByGrade = {
  '5. Sınıf': [
    'Türkçe',
    'Matematik',
    'Fen Bilimleri',
    'Sosyal Bilgiler',
    'İngilizce',
    'Din Kültürü ve Ahlak Bilgisi',
    'Görsel Sanatlar',
    'Müzik',
    'Beden Eğitimi ve Spor',
    'Teknoloji ve Tasarım'
  ],
  '6. Sınıf': [
    'Türkçe',
    'Matematik',
    'Fen Bilimleri',
    'Sosyal Bilgiler',
    'İngilizce',
    'Din Kültürü ve Ahlak Bilgisi',
    'Görsel Sanatlar',
    'Müzik',
    'Beden Eğitimi ve Spor',
    'Teknoloji ve Tasarım'
  ],
  '7. Sınıf': [
    'Türkçe',
    'Matematik',
    'Fen Bilimleri',
    'Sosyal Bilgiler',
    'İngilizce',
    'Din Kültürü ve Ahlak Bilgisi',
    'Görsel Sanatlar',
    'Müzik',
    'Beden Eğitimi ve Spor',
    'Teknoloji ve Tasarım'
  ],
  '8. Sınıf': [
    'Türkçe',
    'Matematik',
    'Fen Bilimleri',
    'İnkılap Tarihi ve Atatürkçülük',
    'İngilizce',
    'Din Kültürü ve Ahlak Bilgisi',
    'Görsel Sanatlar',
    'Müzik',
    'Beden Eğitimi ve Spor',
    'Teknoloji ve Tasarım'
  ],
  '9. Sınıf': [
    'Türk Dili ve Edebiyatı',
    'Matematik',
    'Fizik',
    'Kimya',
    'Biyoloji',
    'Tarih',
    'Coğrafya',
    'Felsefe',
    'İngilizce',
    'Din Kültürü ve Ahlak Bilgisi',
    'Beden Eğitimi ve Spor',
    'Görsel Sanatlar',
    'Müzik',
    'Sağlık Bilgisi'
  ],
  '10. Sınıf': [
    'Türk Dili ve Edebiyatı',
    'Matematik',
    'Fizik',
    'Kimya',
    'Biyoloji',
    'Tarih',
    'Coğrafya',
    'Sosyoloji',
    'İngilizce',
    'Din Kültürü ve Ahlak Bilgisi',
    'Beden Eğitimi ve Spor',
    'Görsel Sanatlar',
    'Müzik'
  ],
  '11. Sınıf': [
    // Sayısal
    'Türk Dili ve Edebiyatı',
    'Matematik',
    'Fizik',
    'Kimya',
    'Biyoloji',
    'Geometri',
    'İngilizce',
    'Din Kültürü ve Ahlak Bilgisi',
    'Beden Eğitimi ve Spor',
    // Sözel
    'Tarih',
    'Coğrafya',
    'Felsefe',
    'Sosyoloji',
    // EA
    'Psikoloji',
    'Mantık'
  ],
  '12. Sınıf': [
    // Sayısal (TYT + AYT)
    'Türk Dili ve Edebiyatı',
    'Matematik',
    'Fizik',
    'Kimya',
    'Biyoloji',
    'Geometri',
    'İngilizce',
    'Din Kültürü ve Ahlak Bilgisi',
    'Beden Eğitimi ve Spor',
    // Sözel (TYT + AYT)
    'Tarih',
    'Coğrafya',
    'Felsefe',
    'Sosyoloji',
    'Coğrafya',
    // EA
    'Psikoloji',
    'Mantık',
    'Ekonomi'
  ]
};

// Tüm derslerin benzersiz listesi (manuel ekleme için öneri)
export const ALL_SUBJECTS = Array.from(
  new Set(
    Object.values(SUBJECTS_BY_GRADE).flat()
  )
).sort();

// Ders ikonları/renkleri
export const SUBJECT_COLORS: { [key: string]: string } = {
  'Matematik': 'bg-blue-500',
  'Türkçe': 'bg-red-500',
  'Türk Dili ve Edebiyatı': 'bg-red-500',
  'Fen Bilimleri': 'bg-green-500',
  'Fizik': 'bg-purple-500',
  'Kimya': 'bg-orange-500',
  'Biyoloji': 'bg-emerald-500',
  'Sosyal Bilgiler': 'bg-amber-500',
  'Tarih': 'bg-amber-600',
  'Coğrafya': 'bg-teal-500',
  'İngilizce': 'bg-indigo-500',
  'Felsefe': 'bg-violet-500',
  'Geometri': 'bg-cyan-500',
  'Sosyoloji': 'bg-pink-500',
  'Psikoloji': 'bg-rose-500',
  'Din Kültürü ve Ahlak Bilgisi': 'bg-lime-500',
  'Beden Eğitimi ve Spor': 'bg-sky-500',
  'Görsel Sanatlar': 'bg-fuchsia-500',
  'Müzik': 'bg-purple-400',
  'Teknoloji ve Tasarım': 'bg-gray-500',
  'İnkılap Tarihi ve Atatürkçülük': 'bg-red-600',
  'Sağlık Bilgisi': 'bg-green-600',
  'Mantık': 'bg-blue-600',
  'Ekonomi': 'bg-yellow-600'
};

// Default renk
export const DEFAULT_SUBJECT_COLOR = 'bg-gray-500';

export const getSubjectColor = (subject: string): string => {
  return SUBJECT_COLORS[subject] || DEFAULT_SUBJECT_COLOR;
};
