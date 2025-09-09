import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Clock, BookOpen, Calculator, FlaskRound as Flask, Globe, History, Brain, ArrowLeft, Play, Book } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import ExamInterface from '../components/Exam/ExamInterface';

type YKSStep = 'category' | 'ayt-selection' | 'exam-generation';
type YKSCategory = 'TYT' | 'AYT';
type AYTType = 'sayisal' | 'sozel' | 'dil';

const YKSPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<YKSStep>('category');
  const [selectedCategory, setSelectedCategory] = useState<YKSCategory | null>(null);
  const [selectedAYTType, setSelectedAYTType] = useState<AYTType | null>(null);
  const [examStarted, setExamStarted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const tytSubjects = [
    { name: 'Türkçe', questions: 40, icon: BookOpen, color: 'from-blue-500 to-cyan-500' },
    { name: 'Matematik', questions: 40, icon: Calculator, color: 'from-purple-500 to-pink-500' },
    { name: 'Fen Bilimleri', questions: 20, icon: Flask, color: 'from-green-500 to-teal-500' },
    { name: 'Sosyal Bilimler', questions: 20, icon: History, color: 'from-orange-500 to-red-500' }
  ];

  const aytSubjects = {
    sayisal: [
      { name: 'Matematik', questions: 40, icon: Calculator, color: 'from-purple-500 to-pink-500' },
      { name: 'Fizik', questions: 14, icon: Flask, color: 'from-blue-500 to-cyan-500' },
      { name: 'Kimya', questions: 13, icon: Flask, color: 'from-green-500 to-teal-500' },
      { name: 'Biyoloji', questions: 13, icon: Flask, color: 'from-emerald-500 to-green-500' }
    ],
    sozel: [
      { name: 'Edebiyat', questions: 24, icon: BookOpen, color: 'from-blue-500 to-cyan-500' },
      { name: 'Tarih', questions: 20, icon: History, color: 'from-orange-500 to-red-500' },
      { name: 'Coğrafya', questions: 18, icon: Globe, color: 'from-green-500 to-teal-500' },
      { name: 'Felsefe', questions: 18, icon: Brain, color: 'from-purple-500 to-pink-500' }
    ],
    dil: [
      { name: 'İngilizce', questions: 80, icon: Globe, color: 'from-indigo-500 to-purple-500' }
    ]
  };

  const handleCategorySelect = (category: YKSCategory) => {
    setSelectedCategory(category);
    if (category === 'TYT') {
      setCurrentStep('exam-generation');
    } else {
      setCurrentStep('ayt-selection');
    }
  };

  const handleAYTTypeSelect = (type: AYTType) => {
    setSelectedAYTType(type);
    setCurrentStep('exam-generation');
  };

  const handleGenerateExam = async () => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGenerating(false);
    setExamStarted(true);
  };

  const handleBackToDashboard = () => {
    setExamStarted(false);
    setCurrentStep('category');
    setSelectedCategory(null);
    setSelectedAYTType(null);
  };

  const getExamType = () => {
    if (selectedCategory === 'TYT') return 'TYT';
    if (selectedCategory === 'AYT' && selectedAYTType) {
      return `AYT ${selectedAYTType === 'sayisal' ? 'Sayısal' : selectedAYTType === 'sozel' ? 'Sözel' : 'Dil'}`;
    }
    return 'YKS';
  };

  const getCurrentSubjects = () => {
    if (selectedCategory === 'TYT') return tytSubjects;
    if (selectedCategory === 'AYT' && selectedAYTType) return aytSubjects[selectedAYTType];
    return [];
  };

  const getTotalQuestions = () => {
    if (selectedCategory === 'TYT') return 120;
    return 80;
  };

  const getTimeLimit = () => {
    if (selectedCategory === 'TYT') return 135;
    return 180;
  };

  if (examStarted) {
    return (
      <ExamInterface
        examType={getExamType()}
        totalQuestions={getTotalQuestions()}
        timeLimit={getTimeLimit()}
        subjects={getCurrentSubjects()}
        onBack={handleBackToDashboard}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <span>YKS Hazırlık</span>
          {currentStep !== 'category' && (
            <>
              <span>›</span>
              <span>{selectedCategory}</span>
            </>
          )}
          {currentStep === 'exam-generation' && selectedCategory === 'AYT' && selectedAYTType && (
            <>
              <span>›</span>
              <span>{selectedAYTType === 'sayisal' ? 'Sayısal' : selectedAYTType === 'sozel' ? 'Sözel' : 'Dil'}</span>
            </>
          )}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {/* Step 1: Category Selection */}
        {currentStep === 'category' && (
          <motion.div
            key="category"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">YKS Deneme Sınavı Oluştur</h1>
              <p className="text-gray-600 dark:text-gray-400">Sofia ile YKS'ye hazırlan! Hangi sınav türünü seçmek istiyorsun?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className="p-8 cursor-pointer hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800"
                  onClick={() => handleCategorySelect('TYT')}
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Target className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">TYT</h3>
                    <h4 className="text-lg font-semibold text-blue-600 dark:text-purple-400 mb-4">Temel Yeterlilik Testi</h4>
                    <div className="space-y-2 text-gray-700 dark:text-gray-300">
                      <p>📝 120 soru</p>
                      <p>⏱️ 135 dakika</p>
                      <p>📚 4 temel ders</p>
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className="p-8 cursor-pointer hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800"
                  onClick={() => handleCategorySelect('AYT')}
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Book className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">AYT</h3>
                    <h4 className="text-lg font-semibold text-purple-600 dark:text-pink-400 mb-4">Alan Yeterlilik Testi</h4>
                    <div className="space-y-2 text-gray-700 dark:text-gray-300">
                      <p>📝 80 soru</p>
                      <p>⏱️ 180 dakika</p>
                      <p>🎯 Alan bazlı sorular</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Step 2: AYT Type Selection */}
        {currentStep === 'ayt-selection' && (
          <motion.div
            key="ayt-selection"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="mb-8">
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep('category')}
                className="mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Geri
              </Button>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">AYT Alan Seçimi</h1>
              <p className="text-gray-600 dark:text-gray-400">Hangi alanda sınava girmek istiyorsun?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className="p-6 cursor-pointer hover:shadow-xl transition-all duration-300"
                  onClick={() => handleAYTTypeSelect('sayisal')}
                >
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Calculator className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">AYT Sayısal</h3>
                    <div className="text-gray-600 dark:text-gray-400 text-sm space-y-1">
                      <p>Matematik, Fizik</p>
                      <p>Kimya, Biyoloji</p>
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className="p-6 cursor-pointer hover:shadow-xl transition-all duration-300"
                  onClick={() => handleAYTTypeSelect('sozel')}
                >
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">AYT Sözel</h3>
                    <div className="text-gray-600 dark:text-gray-400 text-sm space-y-1">
                      <p>Edebiyat, Tarih</p>
                      <p>Coğrafya, Felsefe</p>
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className="p-6 cursor-pointer hover:shadow-xl transition-all duration-300"
                  onClick={() => handleAYTTypeSelect('dil')}
                >
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">AYT Dil</h3>
                    <div className="text-gray-600 dark:text-gray-400 text-sm space-y-1">
                      <p>İngilizce</p>
                      <p>80 soru</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Exam Generation */}
        {currentStep === 'exam-generation' && (
          <motion.div
            key="exam-generation"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="mb-8">
              <Button 
                variant="outline" 
                onClick={() => {
                  if (selectedCategory === 'AYT') {
                    setCurrentStep('ayt-selection');
                  } else {
                    setCurrentStep('category');
                  }
                }}
                className="mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Geri
              </Button>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {getExamType()} Deneme Sınavı
              </h1>
              <p className="text-gray-600 dark:text-gray-400">Sofia sana özel {getExamType()} denemesi hazırlayacak</p>
            </div>

            {/* Hero Section */}
            <Card className="p-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800 mb-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Sofia ile {getExamType()}'ye Hazırlan! 🚀
                </h2>
                <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                  Merhaba! Ben Sofia. Sana özel {getExamType()} deneme sınavı hazırlayacağım. 
                  Gerçek sınav formatında {getTotalQuestions()} soru ile kendini test et.
                </p>
                <div className="flex items-center justify-center space-x-8 mb-6 text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5" />
                    <span>{getTimeLimit()} dakika</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Target className="w-5 h-5" />
                    <span>{getTotalQuestions()} soru</span>
                  </div>
                </div>
                <Button 
                  onClick={handleGenerateExam}
                  disabled={isGenerating}
                  className="px-8 py-4 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Sofia Sınavını Hazırlıyor...
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2" />
                      {getExamType()} Denemesi Oluştur
                    </>
                  )}
                </Button>
              </div>
            </Card>

            {/* Subject Breakdown */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Sınav İçeriği</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {getCurrentSubjects().map((subject, index) => (
                  <motion.div
                    key={subject.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.1 }}
                  >
                    <Card className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-lg bg-gradient-to-r ${subject.color}`}>
                          <subject.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 dark:text-white">{subject.name}</h4>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">{subject.questions} soru</p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default YKSPage;