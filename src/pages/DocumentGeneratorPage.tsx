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
  Eye,
  AlertCircle
} from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import pptxgen from 'pptxgenjs';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import FloatingLabelInput from '../components/UI/FloatingLabelInput';
import { documentTemplates } from '../data/documentTemplates';
import { DocumentRequest } from '../types';
import { generateDocumentContent, isClaudeConfigured } from '../services/claudeApi';

const DocumentGeneratorPage: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [documentRequest, setDocumentRequest] = useState<DocumentRequest>({
    type: 'pdf',
    topic: '',
    content: '',
    subject: '',
    gradeLevel: '',
    length: 'medium',
    template: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const claudeConfigured = isClaudeConfigured();

  const subjects = ['Matematik', 'Fen Bilimleri', 'Türkçe', 'İngilizce', 'Tarih', 'Coğrafya'];
  const gradeOptions = ['5. Sınıf', '6. Sınıf', '7. Sınıf', '8. Sınıf', '9. Sınıf', '10. Sınıf', '11. Sınıf', '12. Sınıf'];

  const iconMap: { [key: string]: React.ComponentType<React.SVGProps<SVGSVGElement>> } = {
    FileText,
    FileEdit,
    Presentation,
    BookOpen
  };

  const generateContent = async (): Promise<string> => {
    const { topic, content, subject, gradeLevel, type } = documentRequest;

    // Claude API yapılandırılmışsa, gerçek AI içeriği üret
    if (claudeConfigured) {
      try {
        const result = await generateDocumentContent({
          topic,
          content,
          subject,
          gradeLevel,
          length: documentRequest.length,
          documentType: type
        });

        return result.content;
      } catch (err) {
        console.error('Claude API Error:', err);
        setError(err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu');

        // Hata durumunda fallback template kullan
        return generateFallbackContent();
      }
    }

    // Claude API yapılandırılmamışsa, demo içerik göster
    return generateFallbackContent();
  };

  const generateFallbackContent = (): string => {
    const { topic, content, subject, gradeLevel } = documentRequest;

    return `
# ${topic}

**Ders:** ${subject} | **Seviye:** ${gradeLevel}

${content ? `## Ödev İçeriği Analizi\n${content}\n\n` : ''}

## Giriş
Merhaba! Ben Sofia, senin öğrenme asistanın. Bu dökümanı ${gradeLevel} seviyesinde ${subject} dersinde ${topic} konusunu öğrenmen için hazırladım.

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
- İleri seviye sorular

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
    if (!documentRequest.topic || !documentRequest.content || !documentRequest.subject || !documentRequest.gradeLevel) {
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Claude API gerçek zamanlı çalışacak, demo için minimum bekleme
      if (!claudeConfigured) {
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      const content = await generateContent();
      setGeneratedContent(content);
      setShowPreview(true);
    } catch (err) {
      console.error('Document generation error:', err);
      setError(err instanceof Error ? err.message : 'Döküman oluşturulurken bir hata oluştu');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadPDF = () => {
    // Markdown'ı HTML'e çevir (basit formatlar için)
    let htmlContent = generatedContent
      .replace(/### (.*)/g, '<h3 style="font-size: 14px; font-weight: bold; margin: 12px 0 8px 0; color: #1a1a1a;">$1</h3>')
      .replace(/## (.*)/g, '<h2 style="font-size: 16px; font-weight: bold; margin: 16px 0 10px 0; color: #1a1a1a;">$1</h2>')
      .replace(/# (.*)/g, '<h1 style="font-size: 20px; font-weight: bold; margin: 20px 0 12px 0; color: #1a1a1a;">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n\n/g, '</p><p style="margin: 8px 0; line-height: 1.6; color: #333;">')
      .replace(/\n/g, '<br/>');

    // HTML şablonu oluştur (Türkçe font desteği ile)
    const html = `
      <div style="font-family: 'Arial', 'Helvetica', sans-serif; padding: 40px; max-width: 800px; background: white; color: #1a1a1a;">
        <div style="text-align: center; border-bottom: 3px solid #4F46E5; padding-bottom: 20px; margin-bottom: 30px;">
          <h1 style="font-size: 24px; font-weight: bold; color: #4F46E5; margin: 0 0 8px 0;">${documentRequest.topic}</h1>
          <p style="font-size: 14px; color: #666; margin: 0;"><strong>Ders:</strong> ${documentRequest.subject} | <strong>Seviye:</strong> ${documentRequest.gradeLevel}</p>
        </div>
        <div style="font-size: 11px; line-height: 1.8; color: #1a1a1a;">
          <p style="margin: 8px 0; line-height: 1.6; color: #333;">
            ${htmlContent}
          </p>
        </div>
        <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #E5E7EB; text-align: center; font-size: 10px; color: #999;">
          <p style="margin: 0;">Bu döküman Sofia tarafından oluşturulmuştur - Okul Asistanım</p>
          <p style="margin: 4px 0 0 0;">${new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
      </div>
    `;

    // PDF ayarları
    const opt = {
      margin: [10, 10, 10, 10],
      filename: `${documentRequest.topic}-${documentRequest.subject}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // HTML'i PDF'e çevir
    const element = document.createElement('div');
    element.innerHTML = html;
    html2pdf().set(opt).from(element).save();
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

  const downloadPowerPoint = async () => {
    const pres = new pptxgen();
    const { topic, subject, gradeLevel } = documentRequest;

    // Set presentation properties
    pres.author = 'Sofia - Okul Asistanım';
    pres.company = 'Okul Asistanım';
    pres.subject = `${subject} - ${topic}`;
    pres.title = `${topic} Ders Sunumu`;

    // Slide 1: Title Slide
    const slide1 = pres.addSlide();
    slide1.background = { fill: '4472C4' };
    slide1.addText(topic, {
      x: 0.5,
      y: 1.5,
      w: 9,
      h: 1.5,
      fontSize: 44,
      bold: true,
      color: 'FFFFFF',
      align: 'center'
    });
    slide1.addText(`${subject} - ${gradeLevel}`, {
      x: 0.5,
      y: 3.5,
      w: 9,
      h: 0.8,
      fontSize: 28,
      color: 'FFFFFF',
      align: 'center'
    });
    slide1.addText('Sofia ile Öğren', {
      x: 0.5,
      y: 5,
      w: 9,
      h: 0.5,
      fontSize: 18,
      color: 'FFFFFF',
      align: 'center',
      italic: true
    });

    // Slide 2: Giriş
    const slide2 = pres.addSlide();
    slide2.addText('Giriş', {
      x: 0.5,
      y: 0.5,
      w: 9,
      h: 0.7,
      fontSize: 32,
      bold: true,
      color: '4472C4'
    });
    slide2.addText([
      { text: 'Merhaba! ', options: { bold: true, fontSize: 18 } },
      { text: `Ben Sofia, senin öğrenme asistanın.\n\n`, options: { fontSize: 18 } },
      { text: `Bu sunumu ${gradeLevel} seviyesinde ${topic} konusunu öğrenmen için hazırladım.\n\n`, options: { fontSize: 16 } },
      { text: 'Bu sunumda öğreneceğin konular:\n', options: { fontSize: 16, bold: true } },
      { text: '• Temel kavramlar\n', options: { fontSize: 14 } },
      { text: '• Uygulama örnekleri\n', options: { fontSize: 14 } },
      { text: '• Pratik sorular', options: { fontSize: 14 } }
    ], {
      x: 0.5,
      y: 1.5,
      w: 9,
      h: 4
    });

    // Slide 3: Temel Kavramlar
    const slide3 = pres.addSlide();
    slide3.addText('1. Temel Kavramlar', {
      x: 0.5,
      y: 0.5,
      w: 9,
      h: 0.7,
      fontSize: 32,
      bold: true,
      color: '4472C4'
    });
    slide3.addText([
      { text: `${topic} konusunda bilmen gereken temel kavramlar:\n\n`, options: { fontSize: 16, bold: true } },
      { text: '✓ Tanım ve örnekler\n', options: { fontSize: 14 } },
      { text: '✓ Günlük hayattan örnekler\n', options: { fontSize: 14 } },
      { text: '✓ Önemli formüller ve kurallar\n\n', options: { fontSize: 14 } },
      { text: '💡 İpucu: ', options: { fontSize: 14, bold: true, color: 'FF6B35' } },
      { text: 'Bu kavramları öğrenirken kendi örneklerini oluşturmaya çalış!', options: { fontSize: 14, italic: true } }
    ], {
      x: 0.5,
      y: 1.5,
      w: 9,
      h: 4
    });

    // Slide 4: Uygulama Örnekleri
    const slide4 = pres.addSlide();
    slide4.addText('2. Uygulama Örnekleri', {
      x: 0.5,
      y: 0.5,
      w: 9,
      h: 0.7,
      fontSize: 32,
      bold: true,
      color: '4472C4'
    });
    slide4.addText([
      { text: 'Konuyu daha iyi anlamak için çözülmüş örnekler:\n\n', options: { fontSize: 16, bold: true } },
      { text: '📝 Adım adım çözüm yöntemleri\n', options: { fontSize: 14 } },
      { text: '🔄 Farklı yaklaşımlar\n', options: { fontSize: 14 } },
      { text: '⚠️ Yaygın hatalar ve çözümleri\n\n', options: { fontSize: 14 } },
      { text: '✨ Sofia ile birlikte: ', options: { fontSize: 14, bold: true, color: '6A4C93' } },
      { text: 'Örnekleri anlamadığın yerler için benimle sohbet edebilirsin!', options: { fontSize: 14, italic: true } }
    ], {
      x: 0.5,
      y: 1.5,
      w: 9,
      h: 4
    });

    // Slide 5: Pratik Sorular
    const slide5 = pres.addSlide();
    slide5.addText('3. Pratik Sorular', {
      x: 0.5,
      y: 0.5,
      w: 9,
      h: 0.7,
      fontSize: 32,
      bold: true,
      color: '4472C4'
    });
    slide5.addText([
      { text: 'Kendini test etmek için sorular:\n\n', options: { fontSize: 16, bold: true } },
      { text: '🟢 Kolay seviye sorular\n', options: { fontSize: 14 } },
      { text: '🟡 Orta seviye sorular\n', options: { fontSize: 14 } },
      { text: '🔴 İleri seviye sorular\n\n', options: { fontSize: 14 } },
      { text: '🎯 Hedef: ', options: { fontSize: 14, bold: true, color: '2A9D8F' } },
      { text: 'Her seviyeden soruları çözerek konuyu pekiştir!', options: { fontSize: 14, italic: true } }
    ], {
      x: 0.5,
      y: 1.5,
      w: 9,
      h: 4
    });

    // Slide 6: Sofia'nın Önerileri
    const slide6 = pres.addSlide();
    slide6.addText('Sofia\'nın Önerileri', {
      x: 0.5,
      y: 0.5,
      w: 9,
      h: 0.7,
      fontSize: 32,
      bold: true,
      color: '6A4C93'
    });
    slide6.addText([
      { text: 'Bu konuyu öğrenirken:\n\n', options: { fontSize: 16, bold: true } },
      { text: '✅ Düzenli tekrar yap\n', options: { fontSize: 14 } },
      { text: '✅ Örnekleri kendi kelimelerinle açıkla\n', options: { fontSize: 14 } },
      { text: '✅ Anlamadığın yerleri not al\n', options: { fontSize: 14 } },
      { text: '✅ Sofia ile sohbet ederek sorularını sor\n\n', options: { fontSize: 14 } },
      { text: '💬 Unutma: ', options: { fontSize: 14, bold: true, color: 'E76F51' } },
      { text: 'Öğrenmek bir süreçtir. Ben her zaman yanındayım!', options: { fontSize: 14, italic: true } }
    ], {
      x: 0.5,
      y: 1.5,
      w: 9,
      h: 4
    });

    // Slide 7: Final Slide
    const slide7 = pres.addSlide();
    slide7.background = { fill: '6A4C93' };
    slide7.addText('Tebrikler! 🎉', {
      x: 0.5,
      y: 2,
      w: 9,
      h: 1,
      fontSize: 40,
      bold: true,
      color: 'FFFFFF',
      align: 'center'
    });
    slide7.addText(`${topic} konusunu başarıyla tamamladın!`, {
      x: 0.5,
      y: 3.2,
      w: 9,
      h: 0.8,
      fontSize: 24,
      color: 'FFFFFF',
      align: 'center'
    });
    slide7.addText('Sofia ile daha fazla konu öğrenmek için sohbet sayfasını ziyaret edebilirsin.', {
      x: 0.5,
      y: 4.5,
      w: 9,
      h: 0.6,
      fontSize: 16,
      color: 'FFFFFF',
      align: 'center',
      italic: true
    });
    slide7.addText(`${new Date().toLocaleDateString('tr-TR')} - Okul Asistanım`, {
      x: 0.5,
      y: 5.5,
      w: 9,
      h: 0.4,
      fontSize: 12,
      color: 'FFFFFF',
      align: 'center'
    });

    // Save the presentation
    await pres.writeFile({ fileName: `${documentRequest.topic}-${documentRequest.subject}.pptx` });
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

          {/* Claude API Warning */}
          {!claudeConfigured && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4"
            >
              <Card className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-yellow-800 dark:text-yellow-300 mb-1">
                      Demo Modu
                    </h4>
                    <p className="text-xs text-yellow-700 dark:text-yellow-400 leading-relaxed">
                      Claude API yapılandırılmamış. Şu an demo içerik gösteriliyor.
                      Gerçek AI içeriği için <code className="bg-yellow-100 dark:bg-yellow-800/50 px-1 rounded">.env</code> dosyasına Claude API anahtarınızı ekleyin.
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

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

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <Card className="p-4 bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-red-800 dark:text-red-300 mb-1">
                        Hata Oluştu
                      </h4>
                      <p className="text-xs text-red-700 dark:text-red-400 leading-relaxed">
                        {error}
                      </p>
                    </div>
                    <button
                      onClick={() => setError(null)}
                      className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
                    >
                      ×
                    </button>
                  </div>
                </Card>
              </motion.div>
            )}

            <div className="space-y-6 mb-6">
              {/* Konu Başlığı */}
              <div>
                <FloatingLabelInput
                  label="Konu Başlığı"
                  value={documentRequest.topic}
                  onChange={(value) => setDocumentRequest(prev => ({ ...prev, topic: value }))}
                  required
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  AI bu başlığı dökümanın ana konusu olarak kullanacak
                </p>
              </div>

              {/* Ödev İçeriği */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ödev İçeriği <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={documentRequest.content}
                  onChange={(e) => setDocumentRequest(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Ödev veya ders notu ile ilgili detayları buraya yazın. Sofia bu içeriği analiz edip ona göre detaylı bir döküman oluşturacak..."
                  rows={6}
                  required
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:border-blue-500 dark:focus:border-purple-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-purple-500/20 transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Sofia bu içeriği analiz edip zenginleştirilmiş bir döküman hazırlayacak
                </p>
              </div>

              {/* Ders ve Sınıf Seçimi */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>

              {/* Döküman Uzunluğu */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Döküman Uzunluğu
                </label>
                <select
                  value={documentRequest.length}
                  onChange={(e) => setDocumentRequest(prev => ({ ...prev, length: e.target.value as 'short' | 'medium' | 'long' }))}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:border-blue-500 dark:focus:border-purple-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-purple-500/20 transition-all duration-200 text-gray-900 dark:text-white"
                >
                  <option value="short">Kısa (1-2 sayfa)</option>
                  <option value="medium">Orta (3-5 sayfa)</option>
                  <option value="long">Uzun (6+ sayfa)</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button
                onClick={handleGenerate}
                disabled={!documentRequest.topic || !documentRequest.content || !documentRequest.subject || !documentRequest.gradeLevel || isGenerating}
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
                    {(documentRequest.type === 'pdf' || selectedTemplate === 'ders-notlari') && (
                      <Button onClick={downloadPDF} className="px-4">
                        <Download className="w-4 h-4 mr-2" />
                        PDF İndir
                      </Button>
                    )}
                    {(documentRequest.type === 'docx' || selectedTemplate === 'odev-sablonu') && (
                      <Button onClick={downloadWord} variant="outline" className="px-4">
                        <Download className="w-4 h-4 mr-2" />
                        Word İndir
                      </Button>
                    )}
                    {(documentRequest.type === 'pptx' || selectedTemplate === 'powerpoint-sunum') && (
                      <Button onClick={downloadPowerPoint} variant="outline" className="px-4">
                        <Download className="w-4 h-4 mr-2" />
                        PowerPoint İndir
                      </Button>
                    )}
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