import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Clock, BookOpen, Calculator, FlaskRound as Flask, Globe, History, Heart, Play, ArrowLeft } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import ExamInterface from '../components/Exam/ExamInterface';

const LGSPage: React.FC = () => {
  const [examStarted, setExamStarted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const subjects = [
    { name: 'Türkçe', questions: 20, icon: BookOpen, color: 'from-blue-500 to-cyan-500' },
    { name: 'Matematik', questions: 20, icon: Calculator, color: 'from-purple-500 to-pink-500' },
    { name: 'Fen Bilimleri', questions: 20, icon: Flask, color: 'from-green-500 to-teal-500' },
    { name: 'T.C. İnkılap Tarihi', questions: 10, icon: History, color: 'from-orange-500 to-red-500' },
    { name: 'Din Kültürü', questions: 10, icon: Heart, color: 'from-indigo-500 to-purple-500' },
    { name: 'İngilizce', questions: 10, icon: Globe, color: 'from-emerald-500 to-green-500' }
  ];

  const handleGenerateExam = async () => {
    setIsGenerating(true);
    // Simulate exam generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGenerating(false);
    setExamStarted(true);
  };

  const handleBackToDashboard = () => {
    setExamStarted(false);
  };

  if (examStarted) {
    return (
      <ExamInterface
        examType="LGS"
        totalQuestions={90}
        timeLimit={120}
        subjects={subjects}
        onBack={handleBackToDashboard}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">LGS Deneme Sınavı Oluştur</h1>
            <p className="text-gray-600 dark:text-gray-400">AI destekli gerçek LGS formatında deneme sınavı</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>120 dakika</span>
          </div>
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span>90 soru</span>
          </div>
          <div className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4" />
            <span>6 ders</span>
          </div>
        </div>
      </motion.div>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <Card className="p-8 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Sofia ile LGS'ye Hazırlan! 🎯
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              Merhaba! Ben Sofia. Sana özel LGS deneme sınavı hazırlayacağım. 
              Gerçek sınav formatında 90 soru ile kendini test et ve eksik olduğun konuları keşfet.
            </p>
            <Button 
              onClick={handleGenerateExam}
              disabled={isGenerating}
              className="px-8 py-4 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Sofia Sınavını Hazırlıyor...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  LGS Deneme Sınavı Oluştur
                </>
              )}
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Subject Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Sınav İçeriği</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((subject, index) => (
            <motion.div
              key={subject.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
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
      </motion.div>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Sofia'nın LGS Özellikleri</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h4 className="font-bold text-gray-900 dark:text-white mb-2">🤖 AI Destekli Sorular</h4>
            <p className="text-gray-600 dark:text-gray-400">Sofia gerçek LGS formatında sorular oluşturur</p>
          </Card>
          <Card className="p-6">
            <h4 className="font-bold text-gray-900 dark:text-white mb-2">⏱️ Gerçek Zamanlı Timer</h4>
            <p className="text-gray-600 dark:text-gray-400">120 dakikalık gerçek sınav süresi</p>
          </Card>
          <Card className="p-6">
            <h4 className="font-bold text-gray-900 dark:text-white mb-2">📊 Detaylı Analiz</h4>
            <p className="text-gray-600 dark:text-gray-400">Ders bazında performans analizi</p>
          </Card>
          <Card className="p-6">
            <h4 className="font-bold text-gray-900 dark:text-white mb-2">🔍 Cevap Anahtarı</h4>
            <p className="text-gray-600 dark:text-gray-400">Her soru için detaylı açıklama</p>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default LGSPage;