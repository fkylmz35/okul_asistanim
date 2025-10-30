import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Plus,
  Trash2,
  FileText,
  Search,
  X,
  Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { SUBJECTS_BY_GRADE, getSubjectColor, ALL_SUBJECTS } from '../constants/subjects';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface UserSubject {
  id: string;
  name: string;
  documentCount: number;
  lastAccessed?: string;
}

const SubjectsPage: React.FC = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();
  const [userSubjects, setUserSubjects] = useState<UserSubject[]>([
    { id: '1', name: 'Matematik', documentCount: 5, lastAccessed: new Date().toISOString() },
    { id: '2', name: 'Fen Bilimleri', documentCount: 3, lastAccessed: new Date().toISOString() },
    { id: '3', name: 'Türkçe', documentCount: 7, lastAccessed: new Date().toISOString() }
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [customSubjectName, setCustomSubjectName] = useState('');
  const [isAddingCustom, setIsAddingCustom] = useState(false);

  // Kullanıcının sınıfına göre önerilen dersler
  const suggestedSubjects = SUBJECTS_BY_GRADE[user?.sinif || '10. Sınıf'] || [];

  // Henüz ekl enmemiş dersler
  const availableSubjects = suggestedSubjects.filter(
    subject => !userSubjects.find(us => us.name === subject)
  );

  // Arama filtresi
  const filteredSubjects = availableSubjects.filter(subject =>
    subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Tüm dersler (manuel ekleme için)
  const allAvailableSubjects = ALL_SUBJECTS.filter(
    subject => !userSubjects.find(us => us.name === subject)
  );

  const handleAddSubject = async (subjectName: string) => {
    if (!user) return;

    try {
      // Development mode
      if (!isSupabaseConfigured) {
        const newSubject: UserSubject = {
          id: Date.now().toString(),
          name: subjectName,
          documentCount: 0,
          lastAccessed: new Date().toISOString()
        };
        setUserSubjects([...userSubjects, newSubject]);
        showSuccess(`${subjectName} dersine eklendi!`);
        setShowAddModal(false);
        setSearchQuery('');
        return;
      }

      // Production mode - Supabase'e ekle
      const { error } = await supabase
        .from('user_subjects')
        .insert({
          user_id: user.id,
          subject_name: subjectName,
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      const newSubject: UserSubject = {
        id: Date.now().toString(),
        name: subjectName,
        documentCount: 0,
        lastAccessed: new Date().toISOString()
      };

      setUserSubjects([...userSubjects, newSubject]);
      showSuccess(`${subjectName} dersine eklendi!`);
      setShowAddModal(false);
      setSearchQuery('');
    } catch (error) {
      console.error('Error adding subject:', error);
      showError('Ders eklenirken bir hata oluştu');
    }
  };

  const handleAddCustomSubject = async () => {
    if (!customSubjectName.trim()) {
      showError('Lütfen ders adı girin');
      return;
    }

    // Check if already exists
    if (userSubjects.find(s => s.name.toLowerCase() === customSubjectName.trim().toLowerCase())) {
      showError('Bu ders zaten ekli');
      return;
    }

    await handleAddSubject(customSubjectName.trim());
    setCustomSubjectName('');
    setIsAddingCustom(false);
  };

  const handleRemoveSubject = async (subjectId: string, subjectName: string) => {
    if (!user) return;

    try {
      // Development mode
      if (!isSupabaseConfigured) {
        setUserSubjects(userSubjects.filter(s => s.id !== subjectId));
        showSuccess(`${subjectName} dersi kaldırıldı`);
        return;
      }

      // Production mode
      const { error } = await supabase
        .from('user_subjects')
        .delete()
        .eq('id', subjectId)
        .eq('user_id', user.id);

      if (error) throw error;

      setUserSubjects(userSubjects.filter(s => s.id !== subjectId));
      showSuccess(`${subjectName} dersi kaldırıldı`);
    } catch (error) {
      console.error('Error removing subject:', error);
      showError('Ders kaldırılırken bir hata oluştu');
    }
  };

  const handleSubjectClick = (subject: UserSubject) => {
    navigate(`/subjects/${subject.id}`, { state: { subject } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-purple-900/20 dark:to-blue-900/20 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Derslerim
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Derslerinizi yönetin ve dökümanlarınızı organize edin
              </p>
            </div>
            <Button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Ders Ekle</span>
            </Button>
          </motion.div>
        </div>

        {/* User Subjects Grid */}
        {userSubjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Henüz ders eklemediniz
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Başlamak için "Ders Ekle" butonuna tıklayın
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userSubjects.map((subject, index) => (
              <motion.div
                key={subject.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className="group hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden"
                  onClick={() => handleSubjectClick(subject)}
                >
                  {/* Color bar */}
                  <div className={`absolute top-0 left-0 right-0 h-2 ${getSubjectColor(subject.name)}`} />

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-3 rounded-xl ${getSubjectColor(subject.name)} bg-opacity-10`}>
                          <BookOpen className={`w-6 h-6 ${getSubjectColor(subject.name).replace('bg-', 'text-')}`} />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            {subject.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {subject.documentCount} döküman
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveSubject(subject.id, subject.name);
                        }}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                      <FileText className="w-4 h-4" />
                      <span>Dökümanları görüntüle</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Add Subject Modal */}
        <AnimatePresence>
          {showAddModal && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => {
                  setShowAddModal(false);
                  setIsAddingCustom(false);
                  setSearchQuery('');
                  setCustomSubjectName('');
                }}
                className="fixed inset-0 bg-black/50 z-50"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
              >
                <div
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl pointer-events-auto max-h-[80vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Ders Ekle
                    </h3>
                    <button
                      onClick={() => {
                        setShowAddModal(false);
                        setIsAddingCustom(false);
                        setSearchQuery('');
                        setCustomSubjectName('');
                      }}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Search */}
                  <div className="mb-6">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Ders ara..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Custom Subject Input */}
                  {isAddingCustom ? (
                    <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center space-x-3">
                        <input
                          type="text"
                          placeholder="Ders adını yazın..."
                          value={customSubjectName}
                          onChange={(e) => setCustomSubjectName(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleAddCustomSubject();
                            }
                          }}
                          className="flex-1 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                          autoFocus
                        />
                        <Button onClick={handleAddCustomSubject} className="flex items-center space-x-2">
                          <Check className="w-4 h-4" />
                          <span>Ekle</span>
                        </Button>
                        <button
                          onClick={() => {
                            setIsAddingCustom(false);
                            setCustomSubjectName('');
                          }}
                          className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsAddingCustom(true)}
                      className="w-full mb-6 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-purple-500 hover:bg-blue-50 dark:hover:bg-purple-900/20 transition-colors text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-purple-400"
                    >
                      + Listede yoksa manuel ekle
                    </button>
                  )}

                  {/* Suggested Subjects */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      {user?.sinif} için önerilen dersler:
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      {(searchQuery ? filteredSubjects : availableSubjects).map((subject) => (
                        <button
                          key={subject}
                          onClick={() => handleAddSubject(subject)}
                          className="p-3 text-left bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-purple-500 transition-colors group"
                        >
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${getSubjectColor(subject)}`} />
                            <span className="text-gray-900 dark:text-white font-medium">{subject}</span>
                          </div>
                        </button>
                      ))}
                    </div>

                    {searchQuery && filteredSubjects.length === 0 && (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        Aradığınız ders bulunamadı. Manuel olarak ekleyebilirsiniz.
                      </div>
                    )}

                    {!searchQuery && availableSubjects.length === 0 && (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        Tüm önerilen dersler zaten eklenmiş!
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SubjectsPage;
