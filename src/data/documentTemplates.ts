import { DocumentTemplate } from '../types';

export const documentTemplates: DocumentTemplate[] = [
  {
    id: 'pdf-notes',
    name: 'PDF Ders Notları',
    type: 'pdf',
    description: 'Konuyu özetleyen detaylı ders notları',
    icon: 'FileText',
    category: 'Ders Materyali'
  },
  {
    id: 'word-assignment',
    name: 'Word Ödev Şablonu',
    type: 'docx',
    description: 'Ödev hazırlama için profesyonel şablon',
    icon: 'FileEdit',
    category: 'Ödev'
  },
  {
    id: 'powerpoint-presentation',
    name: 'PowerPoint Sunum',
    type: 'pptx',
    description: 'Konu sunumu için hazır slaytlar',
    icon: 'Presentation',
    category: 'Sunum'
  },
  {
    id: 'study-sheet',
    name: 'Çalışma Kağıdı',
    type: 'study-sheet',
    description: 'Pratik yapma ve tekrar için çalışma sayfası',
    icon: 'BookOpen',
    category: 'Pratik'
  }
];