import React from 'react';
import { motion } from 'framer-motion';
import { Calculator, FlaskRound as Flask, BookOpen, Clock, Globe, Map, TrendingUp, Award, Target, Brain, Sparkles, GraduationCap } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { subjects } from '../data/subjects';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const iconMap: { [key: string]: React.ComponentType<React.SVGProps<SVGSVGElement>> } = {
    Calculator,
    Flask,
    BookOpen,
    Clock,
    Globe,
    Map
  };

  const stats = [
    { label: 'Toplam Seans', value: '24', icon: Target, color: 'text-purple-400' },
    { label: 'Öğrenme Saati', value: '48', icon: Clock, color: 'text-blue-400' },
    { label: 'Tamamlanan', value: '12', icon: Award, color: 'text-green-400' },
    { label: 'İlerleme', value: '%89', icon: TrendingUp, color: 'text-orange-400' }
  ];

  const recentActivity = [
    { ders: 'Matematik', konu: 'İkinci Dereceden Denklemler', zaman: '2 saat önce' },
    { ders: 'Fen Bilimleri', konu: 'Asitler ve Bazlar', zaman: '1 gün önce' },
    { ders: 'Türkçe', konu: 'Cümle Çözümlemesi', zaman: '2 gün önce' }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Merhaba, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400">Sofia bugün sana hangi konularda yardım etsin?</p>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.1 }}
          >
            <Card className="p-3 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-xs">{stat.label}</p>
                  <p className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
                <stat.icon className={`w-5 h-5 lg:w-8 lg:h-8 ${stat.color}`} />
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <h2 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-3 lg:mb-4">Hızlı İşlemler</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 mb-4 lg:mb-6">
            <Card className="p-6" onClick={() => navigate('/chat')}>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white">Sofia ile Öğren</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-xs lg:text-sm">Yeni sohbet başlat</p>
                </div>
              </div>
              <Button className="w-full">Öğrenmeye Başla</Button>
            </Card>

            <Card className="p-6" onClick={() => navigate('/documents')}>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white">Geçmişi İncele</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-xs lg:text-sm">Sofia ile eski sohbetlerin</p>
                </div>
              </div>
              <Button variant="outline" className="w-full">Geçmişi Görüntüle</Button>
            </Card>

            <Card className="p-6" onClick={() => navigate('/documents/generator')}>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white">Döküman Oluştur</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-xs lg:text-sm">Sofia ile özel materyaller</p>
                </div>
              </div>
              <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">Sofia ile Oluştur</Button>
            </Card>

            <Card className="p-6" onClick={() => navigate('/lgs')}>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white">LGS'ye Hazırlan</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-xs lg:text-sm">Sofia ile deneme sınavı</p>
                </div>
              </div>
              <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">LGS Denemesi Çöz</Button>
            </Card>

            <Card className="p-6" onClick={() => navigate('/yks')}>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white">YKS'ye Hazırlan</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-xs lg:text-sm">Sofia ile TYT/AYT denemesi</p>
                </div>
              </div>
              <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">YKS Denemesi Çöz</Button>
            </Card>
          </div>

          {/* Recent Activity */}
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Son Aktiviteler</h3>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-900 dark:text-white font-medium">{activity.konu}</p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{activity.ders}</p>
                    </div>
                    <span className="text-gray-500 dark:text-gray-500 text-xs">{activity.zaman}</span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Subjects */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Dersler</h2>
          <div className="space-y-3">
            {subjects.map((subject, index) => {
              const Icon = iconMap[subject.icon];
              return (
                <motion.div
                  key={subject.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <Card className="p-4 cursor-pointer group" hover onClick={() => navigate('/chat')}>
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${subject.color}`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-purple-400 transition-colors">
                          {subject.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-xs">{subject.description}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;