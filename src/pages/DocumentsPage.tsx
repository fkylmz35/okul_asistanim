import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Clock, Search, Filter, File, FileSpreadsheet, FileImage } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

interface Document {
  id: string;
  title: string;
  type: 'pdf' | 'docx' | 'pptx' | 'study-sheet';
  subject: string;
  grade_level: string;
  content?: string;
  file_url?: string;
  created_at: string;
}

const DocumentsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showError } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  // Fetch documents from Supabase
  useEffect(() => {
    const fetchDocuments = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('documents')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setDocuments(data || []);
      } catch (error) {
        console.error('Error fetching documents:', error);
        showError('Dökümanlar yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
        setDocuments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [user]);

  // Get document icon
  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <File className="w-5 h-5 text-red-500" />;
      case 'docx':
        return <FileText className="w-5 h-5 text-blue-500" />;
      case 'pptx':
        return <FileImage className="w-5 h-5 text-orange-500" />;
      case 'study-sheet':
        return <FileSpreadsheet className="w-5 h-5 text-green-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  // Get document type label
  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case 'pdf':
        return 'PDF Ders Notu';
      case 'docx':
        return 'Word Dökümanı';
      case 'pptx':
        return 'PowerPoint Sunumu';
      case 'study-sheet':
        return 'Çalışma Kağıdı';
      default:
        return type.toUpperCase();
    }
  };

  // Filter and search documents
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || doc.type === filterType;
    return matchesSearch && matchesFilter;
  });

  // Group documents by subject
  const groupedDocuments = filteredDocuments.reduce((acc, doc) => {
    if (!acc[doc.subject]) {
      acc[doc.subject] = [];
    }
    acc[doc.subject].push(doc);
    return acc;
  }, {} as Record<string, Document[]>);

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Dökümanlarım</h1>
        <p className="text-gray-600 dark:text-gray-400">Sofia ile oluşturduğun tüm dökümanları buradan görüntüle ve indir</p>
      </motion.div>

      {/* Search and Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6 flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500 dark:text-gray-400" />
          <input
            type="text"
            placeholder="Döküman ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:border-blue-500 dark:focus:border-purple-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-purple-500/20 transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-3 w-5 h-5 text-gray-500 dark:text-gray-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="pl-10 pr-8 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:border-blue-500 dark:focus:border-purple-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-purple-500/20 transition-all duration-200 text-gray-900 dark:text-white appearance-none cursor-pointer"
          >
            <option value="all">Tüm Tipler</option>
            <option value="pdf">PDF</option>
            <option value="docx">Word</option>
            <option value="pptx">PowerPoint</option>
            <option value="study-sheet">Çalışma Kağıdı</option>
          </select>
        </div>
      </motion.div>

      {/* Loading State */}
      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Dökümanlar yükleniyor...</p>
        </motion.div>
      ) : filteredDocuments.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {documents.length === 0 ? 'Henüz döküman oluşturmadın' : 'Döküman bulunamadı'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {documents.length === 0
                ? 'Sofia ile ilk dökümanını oluştur ve öğrenme materyallerini buradan görüntüle'
                : 'Arama kriterlerine uygun döküman bulunamadı'}
            </p>
            <Button onClick={() => navigate('/documents/generator')}>
              {documents.length === 0 ? 'İlk Dökümanını Oluştur' : 'Yeni Döküman Oluştur'}
            </Button>
          </Card>
        </motion.div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedDocuments).map(([subject, docs], groupIndex) => (
            <motion.div
              key={subject}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + groupIndex * 0.1 }}
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <div className="w-3 h-3 bg-blue-500 dark:bg-purple-500 rounded-full mr-3" />
                {subject}
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400 font-normal">
                  ({docs.length} döküman)
                </span>
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {docs.map((document, index) => (
                  <motion.div
                    key={document.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <Card className="p-6 group" hover>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className="mt-1">
                            {getDocumentIcon(document.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
                              {document.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              {getDocumentTypeLabel(document.type)}
                            </p>
                            <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs">
                              <Clock className="w-3 h-3 mr-1" />
                              {new Date(document.created_at).toLocaleDateString('tr-TR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 mt-4">
                        <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                          {document.grade_level}
                        </span>
                      </div>

                      {document.file_url && (
                        <Button
                          variant="outline"
                          className="w-full mt-4"
                          onClick={() => window.open(document.file_url, '_blank')}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          İndir
                        </Button>
                      )}
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentsPage;