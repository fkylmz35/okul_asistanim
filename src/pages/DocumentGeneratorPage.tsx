import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Sparkles, 
  BookOpen, 
  FileEdit, 
  Presentation,
  Bot,
  ArrowRight,
  Settings,
  Eye
} from 'lucide-react';
import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import FloatingLabelInput from '../components/UI/FloatingLabelInput';
import { documentTemplates } from '../data/documentTemplates';
import { DocumentRequest } from '../types';

const DocumentGeneratorPage: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [documentRequest, setDocumentRequest] = useState<DocumentRequest>({
    type: 'pdf',
    topic: '',
    subject: '',
    gradeLevel: '',
    length: 'medium',
    complexity: 'intermediate',
    template: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');

  const subjects = ['Matematik', 'Fen Bilimleri', 'Türkçe', 'İngilizce', 'Tarih', 'Coğrafya'];
  const gradeOptions = ['5. Sınıf', '6. Sınıf', '7. Sınıf', '8. Sınıf', '9. Sınıf', '10. Sınıf', '11. Sınıf', '12. Sınıf'];

  const iconMap: { [key: string]: React.ComponentType<any> } = {
    FileText,
    FileEdit,
    Presentation,
    BookOpen
  };

  const generateContent = () => {
    const { topic, subject, gradeLevel, complexity } = documentRequest;
    
    return `
# ${topic} - ${subject} Ders Notları

## Giriş
Merhaba! Ben Sofia, senin öğrenme asistanın. Bu dökümanı ${gradeLevel} seviyesinde ${topic} konusunu öğrenmen için hazırladım.

## Ana Konular

### 1. Temel Kavramlar
${topic} konusunda bilmen gereken temel kavramlar:
- Tanım ve örnekler
- Günlük hayattan örnekler
- Önemli formüller ve kurallar

### 2. Uygulama Örnekleri
Konuyu daha iyi anlamak için çözülmüş örnekler:
- Adım adım çözüm yöntemleri
- Farklı yaklaşımlar
- Yaygın hatalar ve çözümleri

### 3. Pratik Sorular
Kendini test etmek için sorular:
- Kolay seviye sorular
- Orta seviye sorular
${complexity === 'advanced' ? '- İleri seviye sorular' : ''}

## Sofia'nın Önerileri
Bu konuyu öğrenirken:
✓ Düzenli tekrar yap
✓ Örnekleri kendi kelimelerinle açıkla
✓ Anlamadığın yerleri not al
✓ Sofia ile sohbet ederek sorularını sor

## Özet
${topic} konusunu başarıyla tamamladın! Sofia ile daha fazla konu öğrenmek için sohbet sayfasını ziyaret edebilirsin.

---
Bu döküman Sofia tarafından ${new Date().toLocaleDateString('tr-TR')} tarihinde oluşturulmuştur.
Okul Asistanım - Sofia ile Öğren
    `;
  };

  const handleGenerate = async () => {
    if (!documentRequest.topic || !documentRequest.subject || !documentRequest.gradeLevel) {
      return;
    }

    setIsGenerating(true);
    
    // Simulate Sofia thinking
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const content = generateContent();
    setGeneratedContent(content);
    setShowPreview(true);
    setIsGenerating(false);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const lines = generatedContent.split('\n');
    let y = 20;
    
    lines.forEach((line) => {
      if (line.startsWith('# ')) {
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text(line.substring(2), 20, y);
        y += 15;
      } else if (line.startsWith('## ')) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(line.substring(3), 20, y);
        y += 10;
      } else if (line.startsWith('### ')) {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(line.substring(4), 20, y);
        y += 8;
      } else if (line.trim()) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const splitText = doc.splitTextToSize(line, 170);
        doc.text(splitText, 20, y);
        y += splitText.length * 5;
      } else {
        y += 5;
      }
      
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
    });
    
    doc.save(`${documentRequest.topic}-${documentRequest.subject}.pdf`);
  };

  const downloadWord = async () => {
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: `${documentRequest.topic} - ${documentRequest.subject} Ders Notları`,
                bold: true,
                size: 32,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: generatedContent,
                size: 24,
              }),
            ],
          }),
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${documentRequest.topic}-${documentRequest.subject}.docx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Sofia ile Döküman Oluştur</h1>
        <p className="text-gray-600 dark:text-gray-400">Sofia sana özel ders notları, ödev şablonları ve çalışma materyalleri hazırlasın</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sofia's Guidance */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Sofia'nın Rehberliği</h3>
                <p className="text-blue-600 dark:text-purple-400 text-sm">AI Döküman Asistanı</p>
              </div>
            </div>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p className="text-sm leading-relaxed">
                <strong>Merhaba! Ben Sofia.</strong> Hangi konuda döküman hazırlamak istiyorsun? 
                Sana özel ders notları, ödev şablonları veya sunum materyalleri oluşturabilirim.
              </p>
              <div className="space-y-2">
                <p className="text-xs font-semibold text-blue-600 dark:text-purple-400">Sofia'nın Önerileri:</p>
                <ul className="text-xs space-y-1">
                  <li>• Konunu net bir şekilde belirt</li>
                  <li>• Sınıf seviyeni doğru seç</li>
                  <li>• Öğrenme tarzına uygun format seç</li>
                  <li>• Önizleme yaparak kontrol et</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Template Selection */}
          <div className="mt-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Döküman Türü Seç</h3>
            <div className="space-y-3">
              {documentTemplates.map((template) => {
                const Icon = iconMap[template.icon];
                return (
                  <motion.button
                    key={template.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedTemplate(template.id);
                      setDocumentRequest(prev => ({ ...prev, type: template.type, template: template.id }));
                    }}
                    className={`w-full p-4 rounded-lg border text-left transition-all duration-200 ${
                      selectedTemplate === template.id
                        ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-600/20 dark:to-purple-600/20 border-blue-500 dark:border-purple-500'
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-6 h-6 ${
                        selectedTemplate === template.id 
                          ? 'text-blue-600 dark:text-purple-400' 
                          : 'text-gray-500 dark:text-gray-400'
                      }`} />
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{template.name}</h4>
                        <p className="text-gray-600 dark:text-gray-400 text-xs">{template.description}</p>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Document Configuration */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="p-6 lg:p-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Döküman Detayları</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <FloatingLabelInput
                label="Konu Başlığı"
                value={documentRequest.topic}
                onChange={(value) => setDocumentRequest(prev => ({ ...prev, topic: value }))}
                required
              />

              <div className="relative">
                <select
                  value={documentRequest.subject}
                  onChange={(e) => setDocumentRequest(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:border-blue-500 dark:focus:border-purple-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-purple-500/20 transition-all duration-200 text-gray-900 dark:text-white"
                >
                  <option value="">Ders Seçin</option>
                  {subjects.map((subject) => (
                    <option key={subject} value={subject} className="bg-white dark:bg-gray-800">
                      {subject}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <select
                  value={documentRequest.gradeLevel}
                  onChange={(e) => setDocumentRequest(prev => ({ ...prev, gradeLevel: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:border-blue-500 dark:focus:border-purple-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-purple-500/20 transition-all duration-200 text-gray-900 dark:text-white"
                >
                  <option value="">Sınıf Seviyesi</option>
                  {gradeOptions.map((grade) => (
                    <option key={grade} value={grade} className="bg-white dark:bg-gray-800">
                      {grade}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <select
                  value={documentRequest.length}
                  onChange={(e) => setDocumentRequest(prev => ({ ...prev, length: e.target.value as any }))}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:border-blue-500 dark:focus:border-purple-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-purple-500/20 transition-all duration-200 text-gray-900 dark:text-white"
                >
                  <option value="short">Kısa (1-2 sayfa)</option>
                  <option value="medium">Orta (3-5 sayfa)</option>
                  <option value="long">Uzun (6+ sayfa)</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Zorluk Seviyesi
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'basic', label: 'Temel', color: 'from-green-500 to-teal-500' },
                  { value: 'intermediate', label: 'Orta', color: 'from-blue-500 to-purple-500' },
                  { value: 'advanced', label: 'İleri', color: 'from-purple-500 to-pink-500' }
                ].map((level) => (
                  <button
                    key={level.value}
                    onClick={() => setDocumentRequest(prev => ({ ...prev, complexity: level.value as any }))}
                    className={`p-3 rounded-lg border text-center transition-all duration-200 ${
                      documentRequest.complexity === level.value
                        ? `bg-gradient-to-r ${level.color} text-white border-transparent`
                        : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <span className="font-semibold text-sm">{level.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex space-x-4">
              <Button 
                onClick={handleGenerate}
                disabled={!documentRequest.topic || !documentRequest.subject || !documentRequest.gradeLevel || isGenerating}
                className="flex-1"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                    Sofia Hazırlıyor...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Sofia ile Oluştur
                  </>
                )}
              </Button>
              
              {showPreview && (
                <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
                  <Eye className="w-5 h-5 mr-2" />
                  {showPreview ? 'Önizlemeyi Kapat' : 'Önizleme'}
                </Button>
              )}
            </div>
          </Card>

          {/* Preview */}
          {showPreview && generatedContent && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6"
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Döküman Önizlemesi</h3>
                  <div className="flex space-x-2">
                    <Button onClick={downloadPDF} className="px-4">
                      <Download className="w-4 h-4 mr-2" />
                      PDF İndir
                    </Button>
                    <Button onClick={downloadWord} variant="outline" className="px-4">
                      <Download className="w-4 h-4 mr-2" />
                      Word İndir
                    </Button>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 text-sm leading-relaxed">
                    {generatedContent}
                  </pre>
                </div>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DocumentGeneratorPage;