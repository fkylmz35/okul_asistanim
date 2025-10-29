import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Clock, CheckCircle, XCircle, Minus, Eye, ArrowLeft, RotateCcw } from 'lucide-react';
import Card from '../UI/Card';
import Button from '../UI/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

interface Question {
  id: number;
  subject: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface ExamResultsProps {
  examType: string;
  questions: Question[];
  userAnswers: { [key: number]: number };
  timeSpent: number; // in seconds
  onBack: () => void;
}

const ExamResults: React.FC<ExamResultsProps> = ({
  examType,
  questions,
  userAnswers,
  timeSpent,
  onBack
}) => {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const [showAnswerKey, setShowAnswerKey] = useState(false);
  const [resultsSaved, setResultsSaved] = useState(false);

  const calculateResults = () => {
    let correct = 0;
    let wrong = 0;
    let empty = 0;

    questions.forEach((question, index) => {
      const userAnswer = userAnswers[index];
      if (userAnswer === undefined) {
        empty++;
      } else if (userAnswer === question.correctAnswer) {
        correct++;
      } else {
        wrong++;
      }
    });

    return { correct, wrong, empty };
  };

  const getSubjectResults = () => {
    const subjectStats: { [key: string]: { correct: number; total: number } } = {};

    questions.forEach((question, index) => {
      if (!subjectStats[question.subject]) {
        subjectStats[question.subject] = { correct: 0, total: 0 };
      }
      subjectStats[question.subject].total++;
      
      const userAnswer = userAnswers[index];
      if (userAnswer === question.correctAnswer) {
        subjectStats[question.subject].correct++;
      }
    });

    return subjectStats;
  };

  const { correct, wrong, empty } = calculateResults();
  const subjectResults = getSubjectResults();
  const percentage = Math.round((correct / questions.length) * 100);

  // Save exam results to database on mount
  useEffect(() => {
    const saveResults = async () => {
      if (!user || resultsSaved) return;

      try {
        // Development mode - skip saving
        if (!isSupabaseConfigured) {
          console.log('Development mode - exam results not saved');
          setResultsSaved(true);
          return;
        }

        // Production mode - save to Supabase
        const { error } = await supabase
          .from('exam_results')
          .insert({
            user_id: user.id,
            exam_type: examType,
            total_questions: questions.length,
            correct_answers: correct,
            wrong_answers: wrong,
            empty_answers: empty,
            time_spent: timeSpent,
            subject_results: subjectResults
          });

        if (error) throw error;

        setResultsSaved(true);
        console.log('Exam results saved successfully');
      } catch (error) {
        console.error('Error saving exam results:', error);
        // Don't show error toast to user - this is a background operation
      }
    };

    saveResults();
  }, [user, resultsSaved, examType, questions.length, correct, wrong, empty, timeSpent, subjectResults]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (showAnswerKey) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button variant="outline" onClick={() => setShowAnswerKey(false)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Sonuçlara Dön
          </Button>
        </div>

        <Card className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {examType} Cevap Anahtarı
          </h2>
          
          <div className="space-y-6">
            {questions.map((question, index) => {
              const userAnswer = userAnswers[index];
              const isCorrect = userAnswer === question.correctAnswer;
              const isEmpty = userAnswer === undefined;
              
              return (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-4 rounded-lg border ${
                    isEmpty 
                      ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                      : isCorrect 
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                      : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isEmpty 
                        ? 'bg-yellow-500'
                        : isCorrect 
                        ? 'bg-green-500'
                        : 'bg-red-500'
                    }`}>
                      {isEmpty ? (
                        <Minus className="w-4 h-4 text-white" />
                      ) : isCorrect ? (
                        <CheckCircle className="w-4 h-4 text-white" />
                      ) : (
                        <XCircle className="w-4 h-4 text-white" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="font-bold text-gray-900 dark:text-white">Soru {index + 1}</span>
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs">
                          {question.subject}
                        </span>
                      </div>
                      
                      <p className="text-gray-800 dark:text-gray-200 mb-3">{question.question}</p>
                      
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        {question.options.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className={`p-2 rounded text-sm ${
                              optionIndex === question.correctAnswer
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 font-semibold'
                                : optionIndex === userAnswer && userAnswer !== question.correctAnswer
                                ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                            }`}
                          >
                            {String.fromCharCode(65 + optionIndex)}) {option}
                          </div>
                        ))}
                      </div>
                      
                      <div className="text-sm">
                        <p className="text-gray-600 dark:text-gray-400 mb-1">
                          <strong>Doğru Cevap:</strong> {String.fromCharCode(65 + question.correctAnswer)}
                          {!isEmpty && (
                            <>
                              {' | '}
                              <strong>Sizin Cevabınız:</strong> {userAnswer !== undefined ? String.fromCharCode(65 + userAnswer) : 'Boş'}
                            </>
                          )}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                          <strong>Açıklama:</strong> {question.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {examType} Sınav Sonuçları 🎉
        </h1>
        <p className="text-gray-600 dark:text-gray-400">Sofia ile tamamladığın sınavın detaylı analizi</p>
      </motion.div>

      {/* Overall Results */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
      >
        <Card className="p-6 text-center">
          <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{percentage}%</p>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Genel Başarı</p>
        </Card>
        
        <Card className="p-6 text-center">
          <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-3" />
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{correct}</p>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Doğru</p>
        </Card>
        
        <Card className="p-6 text-center">
          <XCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{wrong}</p>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Yanlış</p>
        </Card>
        
        <Card className="p-6 text-center">
          <Minus className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{empty}</p>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Boş</p>
        </Card>
      </motion.div>

      {/* Subject Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <Card className="p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Ders Bazında Performans</h3>
          <div className="space-y-4">
            {Object.entries(subjectResults).map(([subject, stats]) => {
              const subjectPercentage = Math.round((stats.correct / stats.total) * 100);
              return (
                <div key={subject} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 dark:text-white">{subject}</span>
                    <span className="text-gray-600 dark:text-gray-400 text-sm">
                      {stats.correct}/{stats.total} ({subjectPercentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${subjectPercentage}%` }}
                      transition={{ delay: 0.5, duration: 1 }}
                      className={`h-2 rounded-full ${
                        subjectPercentage >= 80 
                          ? 'bg-green-500' 
                          : subjectPercentage >= 60 
                          ? 'bg-yellow-500' 
                          : 'bg-red-500'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </motion.div>

      {/* Time Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <Card className="p-6">
          <div className="flex items-center space-x-6">
            <Clock className="w-8 h-8 text-blue-500 dark:text-purple-400" />
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Süre Kullanımı</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Toplam süre: {formatTime(timeSpent)} / {Math.floor(timeSpent / 60)} dakika kullanıldı
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <Button onClick={() => setShowAnswerKey(true)} className="px-8 py-3">
          <Eye className="w-5 h-5 mr-2" />
          Cevap Anahtarını Göster
        </Button>
        
        <Button variant="outline" onClick={onBack} className="px-8 py-3">
          <RotateCcw className="w-5 h-5 mr-2" />
          Yeni Sınav Oluştur
        </Button>
        
        <Button variant="outline" onClick={onBack} className="px-8 py-3">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Ana Sayfaya Dön
        </Button>
      </motion.div>
    </div>
  );
};

export default ExamResults;