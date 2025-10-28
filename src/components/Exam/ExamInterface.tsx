import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import Card from '../UI/Card';
import Button from '../UI/Button';
import ExamResults from './ExamResults';

interface Question {
  id: number;
  subject: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface ExamInterfaceProps {
  examType: string;
  totalQuestions: number;
  timeLimit: number; // in minutes
  subjects: Array<{ name: string; questions: number; icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; color: string }>;
  onBack: () => void;
}

const ExamInterface: React.FC<ExamInterfaceProps> = ({
  examType,
  totalQuestions,
  timeLimit,
  subjects,
  onBack
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [timeLeft, setTimeLeft] = useState(timeLimit * 60); // Convert to seconds
  const [examFinished, setExamFinished] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);

  // Generate mock questions
  useEffect(() => {
    const generateQuestions = () => {
      const mockQuestions: Question[] = [];
      let questionId = 1;

      subjects.forEach(subject => {
        for (let i = 0; i < subject.questions; i++) {
          mockQuestions.push({
            id: questionId,
            subject: subject.name,
            question: `${subject.name} konusunda ${questionId}. soru. Bu soru Sofia tarafından ${examType} formatında hazırlanmıştır. Aşağıdakilerden hangisi doğrudur?`,
            options: [
              `${subject.name} ile ilgili A seçeneği`,
              `${subject.name} ile ilgili B seçeneği`,
              `${subject.name} ile ilgili C seçeneği`,
              `${subject.name} ile ilgili D seçeneği`
            ],
            correctAnswer: Math.floor(Math.random() * 4),
            explanation: `Bu sorunun cevabı Sofia'nın ${subject.name} analizi sonucunda belirlenmiştir. Detaylı açıklama burada yer alır.`
          });
          questionId++;
        }
      });

      setQuestions(mockQuestions);
    };

    generateQuestions();
  }, [subjects, examType]);

  // Timer
  useEffect(() => {
    if (timeLeft > 0 && !examFinished) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setExamFinished(true);
    }
  }, [timeLeft, examFinished]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (optionIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: optionIndex
    }));
  };

  const handleFinishExam = () => {
    setExamFinished(true);
  };

  const getQuestionStatus = (questionIndex: number) => {
    if (questionIndex === currentQuestion) return 'current';
    if (answers[questionIndex] !== undefined) return 'answered';
    return 'unanswered';
  };

  const getAnsweredCount = () => {
    return Object.keys(answers).length;
  };

  if (examFinished) {
    return (
      <ExamResults
        examType={examType}
        questions={questions}
        userAnswers={answers}
        timeSpent={timeLimit * 60 - timeLeft}
        onBack={onBack}
      />
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Sofia sorularını hazırlıyor...</p>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-6rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Çıkış
          </Button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">{examType} Deneme Sınavı</h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Sofia ile hazırlandı</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">Cevaplanan</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{getAnsweredCount()}/{totalQuestions}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">Kalan Süre</p>
            <p className={`text-lg font-bold ${timeLeft < 600 ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>
              {formatTime(timeLeft)}
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-6 h-full">
        {/* Question Grid Sidebar */}
        <Card className="w-80 p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Sorular</h3>
          <div className="grid grid-cols-10 gap-2 max-h-96 overflow-y-auto">
            {questions.map((_, index) => {
              const status = getQuestionStatus(index);
              return (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-8 h-8 rounded text-xs font-semibold transition-all duration-200 ${
                    status === 'current'
                      ? 'bg-blue-500 text-white'
                      : status === 'answered'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
          
          <div className="mt-6 space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded" />
              <span className="text-gray-600 dark:text-gray-400">Mevcut Soru</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded" />
              <span className="text-gray-600 dark:text-gray-400">Cevaplanmış</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-300 dark:bg-gray-700 rounded" />
              <span className="text-gray-600 dark:text-gray-400">Cevaplanmamış</span>
            </div>
          </div>

          {getAnsweredCount() === totalQuestions && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6"
            >
              <Button onClick={handleFinishExam} className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600">
                <CheckCircle className="w-4 h-4 mr-2" />
                Sınavı Bitir
              </Button>
            </motion.div>
          )}
        </Card>

        {/* Question Area */}
        <div className="flex-1">
          <Card className="p-8 h-full">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium">
                    {currentQ.subject}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400 text-sm">
                    Soru {currentQuestion + 1} / {totalQuestions}
                  </span>
                </div>
              </div>
              
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white leading-relaxed">
                {currentQ.question}
              </h2>
            </div>

            <div className="space-y-4 mb-8">
              {currentQ.options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full p-4 text-left rounded-lg border transition-all duration-200 ${
                    answers[currentQuestion] === index
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 dark:border-blue-400'
                      : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      answers[currentQuestion] === index
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}>
                      {answers[currentQuestion] === index && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      {String.fromCharCode(65 + index)})
                    </span>
                    <span className="text-gray-900 dark:text-white">{option}</span>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Önceki
              </Button>

              <div className="flex space-x-4">
                {currentQuestion === totalQuestions - 1 ? (
                  <Button 
                    onClick={handleFinishExam}
                    className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Sınavı Bitir
                  </Button>
                ) : (
                  <Button
                    onClick={() => setCurrentQuestion(Math.min(totalQuestions - 1, currentQuestion + 1))}
                    disabled={currentQuestion === totalQuestions - 1}
                  >
                    Sonraki
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ExamInterface;