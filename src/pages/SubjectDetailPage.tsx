import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Plus,
  FileText,
  Calendar,
  Trash2,
  Download,
  Eye,
  ArrowLeft
} from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { getSubjectColor } from '../constants/subjects';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface Document {
  id: string;
  title: string;
  type: string;
  content: string;
  createdAt: string;
  subjectId: string;
}

const SubjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();

  // Get subject from navigation state or default
  const [subject, setSubject] = useState(location.state?.subject || { id, name: 'Ders', documentCount: 0 });
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      title: 'Fonksiyonlar Konu Özeti',
      type: 'Konu Özeti',
      content: 'Fonksiyonlar hakkında detaylı özet...',
      createdAt: new Date().toISOString(),
      subjectId: id || ''
    },
    {
      id: '2',
      title: 'Türev Çalışma Kağıdı',
      type: 'Çalışma Kağıdı',
      content: 'Türev konusu çalışma soruları...',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      subjectId: id || ''
    }
  ]);

  useEffect(() => {
    if (id && user) {
      fetchDocuments();
    }
  }, [id, user]);

  const fetchDocuments = async () => {
    if (!isSupabaseConfigured) return;

    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user?.id)
        .eq('subject_id', id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const formattedDocs: Document[] = data.map(doc => ({
          id: doc.id,
          title: doc.title,
          type: doc.document_type,
          content: doc.content,
          createdAt: doc.created_at,
          subjectId: doc.subject_id
        }));
        setDocuments(formattedDocs);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const handleCreateDocument = () => {
    navigate('/documents/generator', { state: { selectedSubject: subject.name } });
  };

  const handleViewDocument = (doc: Document) => {
    // Navigate to document view or open modal
    navigate(`/documents/${doc.id}`, { state: { document: doc } });
  };

  const handleDeleteDocument = async (docId: string, docTitle: string) => {
    if (!window.confirm(`"${docTitle}" dökümanını silmek istediğinize emin misiniz?`)) {
      return;
    }

    try {
      // Development mode
      if (!isSupabaseConfigured) {
        setDocuments(documents.filter(d => d.id !== docId));
        showSuccess('Döküman silindi');
        return;
      }

      // Production mode
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', docId)
        .eq('user_id', user?.id);

      if (error) throw error;

      setDocuments(documents.filter(d => d.id !== docId));
      showSuccess('Döküman silindi');
    } catch (error) {
      console.error('Error deleting document:', error);
      showError('Döküman silinirken bir hata oluştu');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-purple-900/20 dark:to-blue-900/20 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/subjects')}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Derslerime Dön</span>
          </button>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`p-4 rounded-xl ${getSubjectColor(subject.name)} bg-opacity-10`}>
                <BookOpen className={`w-8 h-8 ${getSubjectColor(subject.name).replace('bg-', 'text-')}`} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {subject.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {documents.length} döküman
                </p>
              </div>
            </div>
            <Button
              onClick={handleCreateDocument}
              className="flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Döküman Oluştur</span>
            </Button>
          </div>
        </motion.div>

        {/* Documents List */}
        {documents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Henüz döküman yok
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {subject.name} dersi için ilk dökümanınızı oluşturun
            </p>
            <Button onClick={handleCreateDocument}>
              <Plus className="w-5 h-5 mr-2" />
              Döküman Oluştur
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {documents.map((doc, index) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="group hover:shadow-lg transition-all duration-300">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <FileText className={`w-5 h-5 ${getSubjectColor(subject.name).replace('bg-', 'text-')}`} />
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            {doc.title}
                          </h3>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full">
                            {doc.type}
                          </span>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(doc.createdAt)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleViewDocument(doc)}
                          className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="Görüntüle"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => {
                            // Download functionality
                            const blob = new Blob([doc.content], { type: 'text/plain' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `${doc.title}.txt`;
                            a.click();
                            URL.revokeObjectURL(url);
                          }}
                          className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                          title="İndir"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteDocument(doc.id, doc.title)}
                          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Sil"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectDetailPage;
