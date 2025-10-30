import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Plus,
  FileText,
  Calendar,
  Trash2,
  Download,
  Eye,
  ArrowLeft,
  Upload,
  X,
  File,
  Image as ImageIcon,
  FileType
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
  isUploaded?: boolean;
  fileUrl?: string;
  fileType?: string;
  fileSize?: number;
}

const SubjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();

  // Get subject from navigation state or default
  const [subject, setSubject] = useState(location.state?.subject || { id, name: 'Ders', documentCount: 0 });
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // File size check (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      showError('Dosya boyutu 50MB\'dan küçük olmalıdır');
      return;
    }

    // Allowed file types
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain'
    ];

    if (!allowedTypes.includes(file.type)) {
      showError('Desteklenmeyen dosya tipi. Lütfen resim, PDF, Word veya PowerPoint dosyası yükleyin.');
      return;
    }

    setSelectedFile(file);
    setShowUploadModal(true);
  };

  const handleUploadFile = async () => {
    if (!selectedFile || !user || !id) return;

    // Debug log
    console.log('Upload başlıyor:', {
      fileName: selectedFile.name,
      userId: user.id,
      subjectId: id,
      subjectName: subject.name
    });

    setUploadingFile(true);
    setUploadProgress(0);

    try {
      // Development mode - just add to list
      if (!isSupabaseConfigured) {
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate upload

        const newDoc: Document = {
          id: Date.now().toString(),
          title: selectedFile.name,
          type: 'Yüklenen Dosya',
          content: '',
          createdAt: new Date().toISOString(),
          subjectId: id,
          isUploaded: true,
          fileType: selectedFile.type,
          fileSize: selectedFile.size,
          fileUrl: URL.createObjectURL(selectedFile)
        };

        setDocuments([newDoc, ...documents]);
        showSuccess('Dosya başarıyla yüklendi! (Development Mode)');
        setShowUploadModal(false);
        setSelectedFile(null);
        setUploadingFile(false);
        return;
      }

      // Production mode - upload to Supabase Storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${user.id}/${id}/${Date.now()}.${fileExt}`;
      const filePath = `subject-documents/${fileName}`;

      // Upload file
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      // Save metadata to database
      const { data: docData, error: dbError } = await supabase
        .from('documents')
        .insert({
          user_id: user.id,
          subject_id: id,
          title: selectedFile.name,
          type: 'pdf', // Varsayılan type değeri
          subject: subject.name || 'Genel', // Ders adı (fallback: 'Genel')
          grade_level: user?.sinif || '', // Sınıf seviyesi
          content: '', // Boş content
          document_type: 'Yüklenen Dosya',
          file_url: publicUrl,
          file_type: selectedFile.type,
          file_size: selectedFile.size,
          is_uploaded: true,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (dbError) throw dbError;

      const newDoc: Document = {
        id: docData.id,
        title: selectedFile.name,
        type: 'Yüklenen Dosya',
        content: '',
        createdAt: docData.created_at,
        subjectId: id,
        isUploaded: true,
        fileUrl: publicUrl,
        fileType: selectedFile.type,
        fileSize: selectedFile.size
      };

      setDocuments([newDoc, ...documents]);
      showSuccess('Dosya başarıyla yüklendi!');
      setShowUploadModal(false);
      setSelectedFile(null);
    } catch (error: any) {
      console.error('File upload error:', error);

      if (error?.message?.includes('Bucket not found')) {
        showError('Supabase Storage yapılandırması eksik. Lütfen "documents" bucket\'ını oluşturun.');
      } else {
        showError('Dosya yüklenirken bir hata oluştu');
      }
    } finally {
      setUploadingFile(false);
      setUploadProgress(0);
    }
  };

  const getFileIcon = (fileType?: string) => {
    if (!fileType) return FileText;

    if (fileType.startsWith('image/')) return ImageIcon;
    if (fileType === 'application/pdf') return FileType;
    if (fileType.includes('word')) return FileText;
    if (fileType.includes('presentation')) return FileText;
    return File;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';

    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
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
            <div className="flex items-center space-x-3">
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                accept="image/*,.pdf,.doc,.docx,.ppt,.pptx,.txt"
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <Upload className="w-5 h-5" />
                <span>Döküman Yükle</span>
              </Button>
              <Button
                onClick={handleCreateDocument}
                className="flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Döküman Oluştur</span>
              </Button>
            </div>
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
                          {(() => {
                            const IconComponent = getFileIcon(doc.fileType);
                            return <IconComponent className={`w-5 h-5 ${getSubjectColor(subject.name).replace('bg-', 'text-')}`} />;
                          })()}
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            {doc.title}
                          </h3>
                          {doc.isUploaded && (
                            <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs rounded-full">
                              Yüklendi
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                          <span className={`px-3 py-1 rounded-full ${
                            doc.isUploaded
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                              : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                          }`}>
                            {doc.type}
                          </span>
                          {doc.fileSize && (
                            <span>{formatFileSize(doc.fileSize)}</span>
                          )}
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
                            if (doc.isUploaded && doc.fileUrl) {
                              // Download uploaded file
                              const a = document.createElement('a');
                              a.href = doc.fileUrl;
                              a.download = doc.title;
                              a.target = '_blank';
                              a.click();
                            } else {
                              // Download generated content
                              const blob = new Blob([doc.content], { type: 'text/plain' });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `${doc.title}.txt`;
                              a.click();
                              URL.revokeObjectURL(url);
                            }
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

        {/* Upload Modal */}
        <AnimatePresence>
          {showUploadModal && selectedFile && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => {
                  setShowUploadModal(false);
                  setSelectedFile(null);
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
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md pointer-events-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Döküman Yükle
                    </h3>
                    <button
                      onClick={() => {
                        setShowUploadModal(false);
                        setSelectedFile(null);
                      }}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  {/* File Preview */}
                  <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {(() => {
                        const IconComponent = getFileIcon(selectedFile.type);
                        return <IconComponent className="w-10 h-10 text-blue-500 dark:text-purple-400" />;
                      })()}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {formatFileSize(selectedFile.size)}
                        </p>
                      </div>
                    </div>

                    {selectedFile.type.startsWith('image/') && (
                      <div className="mt-3">
                        <img
                          src={URL.createObjectURL(selectedFile)}
                          alt="Preview"
                          className="w-full h-48 object-contain rounded-lg bg-gray-100 dark:bg-gray-600"
                        />
                      </div>
                    )}
                  </div>

                  <div className="mb-6">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Bu dosya <strong>{subject.name}</strong> dersine eklenecek.
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      Desteklenen formatlar: Resim, PDF, Word, PowerPoint
                    </p>
                  </div>

                  {/* Progress Bar */}
                  {uploadingFile && (
                    <div className="mb-6">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-600 dark:bg-purple-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 text-center">
                        Yükleniyor... {uploadProgress}%
                      </p>
                    </div>
                  )}

                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowUploadModal(false);
                        setSelectedFile(null);
                      }}
                      disabled={uploadingFile}
                      className="flex-1"
                    >
                      İptal
                    </Button>
                    <Button
                      onClick={handleUploadFile}
                      disabled={uploadingFile}
                      className="flex-1"
                    >
                      {uploadingFile ? (
                        <div className="flex items-center justify-center">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Yükleniyor...
                        </div>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Yükle
                        </>
                      )}
                    </Button>
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

export default SubjectDetailPage;
