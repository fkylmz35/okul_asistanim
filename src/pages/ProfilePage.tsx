import React, { useState, useRef } from 'react';
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
  TrendingUp,
  Camera,
  School,
  Brain,
  Shield,
  Settings,
  CreditCard,
  Crown,
  Check,
  Star,
  Upload,
  Trash2
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
  const { user, refreshUser } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { showSuccess, showError } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [changingPassword, setChangingPassword] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
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

      // Refresh user data to reflect changes
      await refreshUser();
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

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // File size check (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showError('Dosya boyutu 5MB\'dan küçük olmalıdır');
      return;
    }

    // File type check
    if (!file.type.startsWith('image/')) {
      showError('Lütfen geçerli bir resim dosyası seçin');
      return;
    }

    setUploadingAvatar(true);
    try {
      // Development mode - just show success
      if (!isSupabaseConfigured) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate upload
        showSuccess('Profil fotoğrafı güncellendi! (Development Mode)');
        setUploadingAvatar(false);
        return;
      }

      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar: publicUrl, updated_at: new Date().toISOString() })
        .eq('id', user.id);

      if (updateError) throw updateError;

      showSuccess('Profil fotoğrafınız başarıyla güncellendi!');

      // Refresh user data to reflect changes
      await refreshUser();
    } catch (error: any) {
      console.error('Avatar upload error:', error);

      // Check if it's a bucket not found error
      if (error?.message?.includes('Bucket not found')) {
        showError('Supabase Storage yapılandırması eksik. Lütfen "avatars" bucket\'ını oluşturun.');
      } else {
        showError('Profil fotoğrafı yüklenirken bir hata oluştu');
      }
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!user) return;

    // Validation
    if (!passwordForm.newPassword || !passwordForm.confirmPassword) {
      showError('Lütfen tüm alanları doldurun');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      showError('Yeni şifre en az 6 karakter olmalıdır');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showError('Yeni şifreler eşleşmiyor');
      return;
    }

    setChangingPassword(true);
    try {
      // Development mode - just show success
      if (!isSupabaseConfigured) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        showSuccess('Şifreniz başarıyla değiştirildi! (Development Mode)');
        setShowPasswordModal(false);
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setChangingPassword(false);
        return;
      }

      // Update password using Supabase Auth
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword
      });

      if (error) throw error;

      showSuccess('Şifreniz başarıyla değiştirildi!');
      setShowPasswordModal(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Password change error:', error);
      showError('Şifre değiştirilirken bir hata oluştu');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    // Confirmation check
    if (deleteConfirmation !== 'SİL') {
      showError('Lütfen onay için "SİL" yazın');
      return;
    }

    setDeletingAccount(true);
    try {
      // Development mode - just show message
      if (!isSupabaseConfigured) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        showSuccess('Hesap silme işlemi tamamlandı (Development Mode)');
        setShowDeleteModal(false);
        setDeletingAccount(false);
        return;
      }

      // Delete user data from profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Sign out the user
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw signOutError;

      showSuccess('Hesabınız başarıyla silindi');

      // Redirect to landing page
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    } catch (error) {
      console.error('Account deletion error:', error);
      showError('Hesap silinirken bir hata oluştu');
    } finally {
      setDeletingAccount(false);
    }
  };

  const achievements = [
    { title: 'Sofia ile İlk Tanışma', description: 'İlk AI sohbetinizi tamamladınız', earned: true, icon: Trophy },
    { title: 'Matematik Ustası', description: '10 matematik sorusu çözdünüz', earned: true, icon: TrendingUp },
    { title: 'Sürekli Öğrenci', description: '7 gün üst üste Sofia ile çalıştınız', earned: false, icon: Calendar },
    { title: 'Çok Yönlü Öğrenci', description: 'Tüm derslerde Sofia ile sohbet ettiniz', earned: false, icon: Star }
  ];

  const gradeOptions = [
    '5. Sınıf', '6. Sınıf', '7. Sınıf', '8. Sınıf',
    '9. Sınıf', '10. Sınıf', '11. Sınıf', '12. Sınıf'
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
    { id: 'statistics', name: 'Öğrenme İstatistikleri', icon: TrendingUp },
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
                    className="w-32 h-32 rounded-full mx-auto border-4 border-blue-500/20 dark:border-purple-500/20 object-cover"
                  />
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => avatarInputRef.current?.click()}
                    disabled={uploadingAvatar}
                    className="absolute bottom-2 right-2 p-2 bg-blue-500 dark:bg-purple-500 rounded-full text-white hover:bg-blue-600 dark:hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Profil fotoğrafını değiştir"
                  >
                    {uploadingAvatar ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Camera className="w-4 h-4" />
                    )}
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
                <TrendingUp className="w-8 h-8 text-green-500 dark:text-green-400 mx-auto mb-3" />
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
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setShowPasswordModal(true)}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Şifre Değiştir
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20"
                  onClick={() => setShowDeleteModal(true)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Hesabı Sil
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Password Change Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPasswordModal(false)}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Şifre Değiştir</h3>
                  <button
                    onClick={() => setShowPasswordModal(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <FloatingLabelInput
                    type="password"
                    label="Yeni Şifre"
                    value={passwordForm.newPassword}
                    onChange={(value) => setPasswordForm({ ...passwordForm, newPassword: value })}
                  />
                  <FloatingLabelInput
                    type="password"
                    label="Yeni Şifre (Tekrar)"
                    value={passwordForm.confirmPassword}
                    onChange={(value) => setPasswordForm({ ...passwordForm, confirmPassword: value })}
                  />
                </div>

                <div className="mt-6 flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowPasswordModal(false);
                      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    }}
                    className="flex-1"
                  >
                    İptal
                  </Button>
                  <Button
                    onClick={handlePasswordChange}
                    disabled={changingPassword}
                    className="flex-1"
                  >
                    {changingPassword ? (
                      <div className="flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Değiştiriliyor...
                      </div>
                    ) : (
                      'Şifreyi Değiştir'
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Account Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteModal(false)}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-red-600 dark:text-red-400">Hesabı Sil</h3>
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="mb-6">
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
                    <p className="text-red-800 dark:text-red-300 text-sm font-medium mb-2">
                      ⚠️ Uyarı: Bu işlem geri alınamaz!
                    </p>
                    <p className="text-red-700 dark:text-red-400 text-sm">
                      Hesabınızı sildiğinizde tüm verileriniz, Sofia ile olan sohbetleriniz, dokümanlarınız ve öğrenme geçmişiniz kalıcı olarak silinecektir.
                    </p>
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
                    Devam etmek için lütfen <strong>"SİL"</strong> yazın:
                  </p>
                  <input
                    type="text"
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                    placeholder='Onaylamak için "SİL" yazın'
                    className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowDeleteModal(false);
                      setDeleteConfirmation('');
                    }}
                    className="flex-1"
                  >
                    İptal
                  </Button>
                  <Button
                    onClick={handleDeleteAccount}
                    disabled={deletingAccount || deleteConfirmation !== 'SİL'}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingAccount ? (
                      <div className="flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Siliniyor...
                      </div>
                    ) : (
                      'Hesabı Sil'
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfilePage;