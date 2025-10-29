import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  Calendar, 
  BookOpen, 
  Edit2, 
  Save, 
  X, 
  GraduationCap, 
  Trophy, 
  Clock, 
  Target,
  Camera,
  School,
  Brain,
  Eye,
  Ear,
  Hand,
  Shield,
  Settings,
  CreditCard,
  Crown,
  Check,
  Star
} from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import FloatingLabelInput from '../components/UI/FloatingLabelInput';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../contexts/ToastContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import PricingTable from '../components/UI/PricingTable';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { showSuccess, showError } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    surname: user?.surname || '',
    email: user?.email || '',
    sinif: user?.sinif || '',
    school: user?.school || '',
    age: user?.age || '',
    learningStyle: user?.learningStyle || 'visual',
    personalNotes: user?.personalNotes || ''
  });

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      // Development mode - just update local state
      if (!isSupabaseConfigured) {
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
        showSuccess('Profil başarıyla güncellendi! (Development Mode)');
        setIsEditing(false);
        setIsSaving(false);
        return;
      }

      // Production mode - update Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          name: editForm.name,
          surname: editForm.surname,
          email: editForm.email,
          sinif: editForm.sinif,
          school: editForm.school,
          age: editForm.age,
          learning_style: editForm.learningStyle,
          personal_notes: editForm.personalNotes,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      showSuccess('Profil bilgileriniz başarıyla güncellendi!');
      setIsEditing(false);

      // Reload page to reflect changes
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Error saving profile:', error);
      showError('Profil güncellenirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditForm({
      name: user?.name || '',
      surname: user?.surname || '',
      email: user?.email || '',
      sinif: user?.sinif || '',
      school: user?.school || '',
      age: user?.age || '',
      learningStyle: user?.learningStyle || 'visual',
      personalNotes: user?.personalNotes || ''
    });
    setIsEditing(false);
  };

  const achievements = [
    { title: 'Sofia ile İlk Tanışma', description: 'İlk AI sohbetinizi tamamladınız', earned: true, icon: Trophy },
    { title: 'Matematik Ustası', description: '10 matematik sorusu çözdünüz', earned: true, icon: Target },
    { title: 'Sürekli Öğrenci', description: '7 gün üst üste Sofia ile çalıştınız', earned: false, icon: Calendar },
    { title: 'Çok Yönlü Öğrenci', description: 'Tüm derslerde Sofia ile sohbet ettiniz', earned: false, icon: Star }
  ];

  const gradeOptions = [
    '5. Sınıf', '6. Sınıf', '7. Sınıf', '8. Sınıf',
    '9. Sınıf', '10. Sınıf', '11. Sınıf', '12. Sınıf'
  ];

  const learningStyles = [
    { id: 'visual', name: 'Görsel Öğrenme', icon: Eye, description: 'Resim, grafik ve şemalarla öğrenmeyi seviyorum' },
    { id: 'auditory', name: 'İşitsel Öğrenme', icon: Ear, description: 'Dinleyerek ve konuşarak öğrenmeyi seviyorum' },
    { id: 'practical', name: 'Uygulamalı Öğrenme', icon: Hand, description: 'Yaparak ve deneyerek öğrenmeyi seviyorum' }
  ];

  // Mock data for charts
  const weeklyData = {
    labels: ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'],
    datasets: [
      {
        label: 'Sofia ile Çalışma Saatleri',
        data: [2, 3, 1, 4, 2, 1, 3],
        borderColor: isDark ? '#8B5CF6' : '#3B82F6',
        backgroundColor: isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: isDark ? '#E5E7EB' : '#374151'
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: isDark ? '#9CA3AF' : '#6B7280'
        },
        grid: {
          color: isDark ? '#374151' : '#E5E7EB'
        }
      },
      x: {
        ticks: {
          color: isDark ? '#9CA3AF' : '#6B7280'
        },
        grid: {
          color: isDark ? '#374151' : '#E5E7EB'
        }
      }
    }
  };

  const handlePlanSelect = (planId: string) => {
    console.log('Plan selected:', planId);
    // Here you would typically handle plan selection/upgrade
  };

  const tabs = [
    { id: 'personal', name: 'Kişisel Bilgiler', icon: User },
    { id: 'statistics', name: 'Öğrenme İstatistikleri', icon: Target },
    { id: 'preferences', name: 'Öğrenme Tercihleri', icon: Brain },
    { id: 'subscription', name: 'Abonelik Yönetimi', icon: CreditCard },
    { id: 'settings', name: 'Ayarlar', icon: Settings }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Profil Yönetimi</h1>
        <p className="text-gray-600 dark:text-gray-400">Hesap bilgilerinizi ve Sofia ile öğrenme ilerlemenizi yönetin</p>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <div className="flex flex-wrap gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-purple-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.name}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'personal' && (
          <motion.div
            key="personal"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Profile Photo & Basic Info */}
            <Card className="p-6 text-center">
              <div className="mb-6">
                <div className="relative inline-block">
                  <img
                    src={user?.avatar}
                    alt={user?.name}
                    className="w-32 h-32 rounded-full mx-auto border-4 border-blue-500/20 dark:border-purple-500/20"
                  />
                  <button className="absolute bottom-2 right-2 p-2 bg-blue-500 dark:bg-purple-500 rounded-full text-white hover:bg-blue-600 dark:hover:bg-purple-600 transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{user?.name}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-2">{user?.sinif}</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">Sofia ile tanışma tarihi</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {new Date(user?.katilimTarihi || '').toLocaleDateString('tr-TR')}
              </p>
            </Card>

            {/* Personal Information Form */}
            <div className="lg:col-span-2">
              <Card className="p-6 lg:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Kişisel Bilgiler</h2>
                  {!isEditing ? (
                    <Button variant="outline" onClick={() => setIsEditing(true)}>
                      <Edit2 className="w-4 h-4 mr-2" />
                      Düzenle
                    </Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Button onClick={handleSave} className="px-4" disabled={isSaving}>
                        <Save className="w-4 h-4 mr-2" />
                        {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
                      </Button>
                      <Button variant="outline" onClick={handleCancel} className="px-4" disabled={isSaving}>
                        <X className="w-4 h-4 mr-2" />
                        İptal
                      </Button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {isEditing ? (
                    <>
                      <FloatingLabelInput
                        label="Ad"
                        value={editForm.name}
                        onChange={(value) => setEditForm(prev => ({ ...prev, name: value }))}
                      />
                      <FloatingLabelInput
                        label="Soyad"
                        value={editForm.surname}
                        onChange={(value) => setEditForm(prev => ({ ...prev, surname: value }))}
                      />
                      <FloatingLabelInput
                        label="E-posta Adresi"
                        type="email"
                        value={editForm.email}
                        onChange={(value) => setEditForm(prev => ({ ...prev, email: value }))}
                      />
                      <FloatingLabelInput
                        label="Yaş"
                        type="number"
                        value={editForm.age.toString()}
                        onChange={(value) => setEditForm(prev => ({ ...prev, age: parseInt(value) || 0 }))}
                      />
                      <div className="relative">
                        <select
                          value={editForm.sinif}
                          onChange={(e) => setEditForm(prev => ({ ...prev, sinif: e.target.value }))}
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:border-blue-500 dark:focus:border-purple-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-purple-500/20 transition-all duration-200 text-gray-900 dark:text-white"
                        >
                          <option value="">Sınıf Seçin</option>
                          {gradeOptions.map((grade) => (
                            <option key={grade} value={grade} className="bg-white dark:bg-gray-800">
                              {grade}
                            </option>
                          ))}
                        </select>
                      </div>
                      <FloatingLabelInput
                        label="Okul Adı (İsteğe bağlı)"
                        value={editForm.school}
                        onChange={(value) => setEditForm(prev => ({ ...prev, school: value }))}
                      />
                    </>
                  ) : (
                    <>
                      <div className="flex items-center space-x-3">
                        <User className="w-5 h-5 text-blue-500 dark:text-purple-400" />
                        <div>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">Ad Soyad</p>
                          <p className="text-gray-900 dark:text-white font-medium">{user?.name} {user?.surname}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                        <div>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">E-posta Adresi</p>
                          <p className="text-gray-900 dark:text-white font-medium">{user?.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <GraduationCap className="w-5 h-5 text-green-500 dark:text-green-400" />
                        <div>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">Sınıf Seviyesi</p>
                          <p className="text-gray-900 dark:text-white font-medium">{user?.sinif}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <School className="w-5 h-5 text-orange-500 dark:text-orange-400" />
                        <div>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">Okul</p>
                          <p className="text-gray-900 dark:text-white font-medium">{user?.school || 'Belirtilmemiş'}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                        <div>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">Üyelik Tarihi</p>
                          <p className="text-gray-900 dark:text-white font-medium">
                            {new Date(user?.katilimTarihi || '').toLocaleDateString('tr-TR')}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </Card>
            </div>
          </motion.div>
        )}

        {activeTab === 'statistics' && (
          <motion.div
            key="statistics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="p-6 text-center">
                <Clock className="w-8 h-8 text-blue-500 dark:text-purple-400 mx-auto mb-3" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">48</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Sofia ile Çalışma Saati</p>
              </Card>
              <Card className="p-6 text-center">
                <Target className="w-8 h-8 text-green-500 dark:text-green-400 mx-auto mb-3" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">7</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Günlük Çalışma Serisi</p>
              </Card>
              <Card className="p-6 text-center">
                <BookOpen className="w-8 h-8 text-purple-500 dark:text-purple-400 mx-auto mb-3" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">24</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Sofia ile Sohbet</p>
              </Card>
              <Card className="p-6 text-center">
                <Trophy className="w-8 h-8 text-orange-500 dark:text-orange-400 mx-auto mb-3" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Kazanılan Başarı</p>
              </Card>
            </div>

            {/* Weekly Activity Chart */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Sofia ile Haftalık Aktivite</h3>
              <div className="h-64">
                <Line data={weeklyData} options={chartOptions} />
              </div>
            </Card>

            {/* Achievements */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Sofia ile Başarılar</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.1 }}
                    className={`p-4 rounded-lg border ${
                      achievement.earned 
                        ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-600/20 dark:to-purple-600/20 border-blue-200 dark:border-purple-500/30' 
                        : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        achievement.earned 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                          : 'bg-gray-300 dark:bg-gray-700'
                      }`}>
                        <achievement.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className={`font-semibold ${achievement.earned ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                          {achievement.title}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{achievement.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {activeTab === 'preferences' && (
          <motion.div
            key="preferences"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Learning Style */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Öğrenme Tarzınız</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Sofia size nasıl yardım etsin?</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {learningStyles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setEditForm(prev => ({ ...prev, learningStyle: style.id as 'visual' | 'auditory' | 'kinesthetic' }))}
                    className={`p-4 rounded-lg border text-left transition-all duration-200 ${
                      editForm.learningStyle === style.id
                        ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-600/20 dark:to-purple-600/20 border-blue-500 dark:border-purple-500'
                        : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <style.icon className={`w-6 h-6 ${
                        editForm.learningStyle === style.id 
                          ? 'text-blue-600 dark:text-purple-400' 
                          : 'text-gray-500 dark:text-gray-400'
                      }`} />
                      <h4 className="font-semibold text-gray-900 dark:text-white">{style.name}</h4>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{style.description}</p>
                  </button>
                ))}
              </div>
            </Card>

            {/* Personal Notes */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Kişisel Notlarınız</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Sofia ile öğrenme hedeflerinizi ve notlarınızı yazın</p>
              <textarea
                value={editForm.personalNotes}
                onChange={(e) => setEditForm(prev => ({ ...prev, personalNotes: e.target.value }))}
                placeholder="Öğrenme hedeflerim, Sofia'dan beklentilerim..."
                rows={6}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:border-blue-500 dark:focus:border-purple-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-purple-500/20 transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
              />
            </Card>
          </motion.div>
        )}

        {activeTab === 'subscription' && (
          <motion.div
            key="subscription"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Current Plan */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Abonelik Yönetimi</h3>
              <div className="p-6 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Crown className="w-8 h-8" />
                    <div>
                      <h4 className="text-xl font-bold">Keşfet Plan</h4>
                      <p className="opacity-90">
                        Ücretsiz
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4" />
                    <span className="text-sm">Günde 5 kez Sofia ile sohbet</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4" />
                    <span className="text-sm">Sofia ile ayda 2 ödev yapımı</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Plan Comparison */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Planları Karşılaştır</h3>
              <PricingTable 
                currentPlan="free"
                onPlanSelect={handlePlanSelect}
                showUsage={true}
                remainingUsage={{
                  documents: 1,
                  maxDocuments: 2,
                  chats: 3,
                  maxChats: 5
                }}
              />
            </Card>
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div
            key="settings"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Theme Settings */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Görünüm Ayarları</h3>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Tema Seçimi</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Açık veya koyu tema seçin</p>
                </div>
                <button
                  onClick={toggleTheme}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isDark ? 'bg-purple-600' : 'bg-blue-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isDark ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </Card>

            {/* Privacy Settings */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Gizlilik ve Güvenlik</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Sofia ile Sohbet Geçmişi</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Sohbet geçmişinizi kaydet</p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Öğrenme Analitikleri</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">İlerleme takibi için veri toplama</p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">E-posta Bildirimleri</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Sofia'dan günlük öğrenme hatırlatmaları</p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
              </div>
            </Card>

            {/* Account Security */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Hesap Güvenliği</h3>
              <div className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="w-4 h-4 mr-2" />
                  Şifre Değiştir
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="w-4 h-4 mr-2" />
                  E-posta Değiştir
                </Button>
                <Button variant="outline" className="w-full justify-start text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20">
                  <X className="w-4 h-4 mr-2" />
                  Hesabı Sil
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfilePage;