import type { DocumentGenerationRequest, GeneratedDocument, ClaudeAPIResponse } from '../types/ai';

const CLAUDE_MODEL = 'claude-3-5-sonnet-20241022'; // En güncel Claude modeli

// Determine API endpoint based on environment
const getApiEndpoint = (): string => {
  // Production: Use Vercel Edge Function (secure)
  if (import.meta.env.PROD) {
    return '/api/claude';
  }

  // Development: Check if we have direct API key (only for testing)
  const apiKey = import.meta.env.VITE_CLAUDE_API_KEY;
  if (apiKey && apiKey !== 'your_claude_api_key_here' && apiKey !== 'your_claude_api_key') {
    // Use direct API (will cause CORS error, but useful for testing)
    return 'https://api.anthropic.com/v1/messages';
  }

  // Default: Use local proxy endpoint
  return '/api/claude';
};

// Get API key (only for direct API calls in development)
const getApiKey = (): string | null => {
  try {
    const apiKey = import.meta.env.VITE_CLAUDE_API_KEY;
    if (!apiKey || apiKey === 'your_claude_api_key_here' || apiKey === 'your_claude_api_key') {
      return null;
    }
    return apiKey;
  } catch (error) {
    console.warn('Error getting Claude API key:', error);
    return null;
  }
};

// Check if Claude API is configured
export const isClaudeConfigured = (): boolean => {
  // In production, check if proxy endpoint is available
  if (import.meta.env.PROD) {
    return true; // Assume proxy is configured in production
  }

  // In development, check for API key
  try {
    const apiKey = import.meta.env.VITE_CLAUDE_API_KEY;
    return !!(apiKey && apiKey !== 'your_claude_api_key_here' && apiKey !== 'your_claude_api_key');
  } catch (error) {
    console.warn('Error checking Claude API configuration:', error);
    return false;
  }
};

// Call Claude API (via proxy or direct)
const callClaudeAPI = async (requestBody: {
  model: string;
  max_tokens: number;
  temperature: number;
  system: string;
  messages: Array<{ role: string; content: string }>;
}): Promise<ClaudeAPIResponse> => {
  const endpoint = getApiEndpoint();
  const isDirect = endpoint.includes('anthropic.com');

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Add API key only for direct calls
  if (isDirect) {
    const apiKey = getApiKey();
    if (!apiKey) {
      throw new Error('Claude API key bulunamadı. Lütfen .env dosyasını kontrol edin.');
    }
    headers['x-api-key'] = apiKey;
    headers['anthropic-version'] = '2023-06-01';
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `Claude API hatası: ${response.status} - ${errorData.error?.message || errorData.message || response.statusText}`
    );
  }

  return await response.json();
};

/**
 * Generate educational document content using Claude AI
 */
export const generateDocumentContent = async (
  request: DocumentGenerationRequest
): Promise<GeneratedDocument> => {
  if (!isClaudeConfigured()) {
    throw new Error('Claude API yapılandırılmamış. Lütfen ayarları kontrol edin.');
  }

  // Determine content length based on user selection
  const lengthGuide = {
    short: '1-2 sayfa uzunluğunda, özet ve öz bilgiler içeren',
    medium: '3-5 sayfa uzunluğunda, detaylı açıklamalar ve örnekler içeren',
    long: '6+ sayfa uzunluğunda, kapsamlı ve derinlemesine açıklamalar içeren'
  };

  // Create system prompt for educational content generation
  const systemPrompt = `Sen Sofia, bir eğitim asistanısın. ${request.gradeLevel} seviyesindeki öğrenciler için ${request.subject} dersinde eğitim materyalleri hazırlıyorsun.

Görevin: Öğrencilerin seviyesine uygun, anlaşılır ve eğitici içerik üretmek.

Önemli kurallar:
- Öğrencinin yaş grubuna uygun dil kullan
- Konuyu günlük hayattan örneklerle açıkla
- Karmaşık kavramları basitleştir
- Pozitif ve motive edici bir dil kullan
- Türkçe dilbilgisi kurallarına dikkat et`;

  // Create user prompt with document requirements
  const userPrompt = `Aşağıdaki özelliklere sahip bir eğitim dokümanı hazırla:

**Konu Başlığı:** ${request.topic}

**Ders:** ${request.subject}

**Sınıf Seviyesi:** ${request.gradeLevel}

**Ödev İçeriği ve Talimatlar:**
${request.content}

**Döküman Uzunluğu:** ${lengthGuide[request.length]}

Lütfen şu formatta bir döküman hazırla:

# [Konu Başlığı]

**Ders:** [Ders] | **Seviye:** [Sınıf]

## Giriş
[Motive edici bir giriş yaz, Sofia olarak kendini tanıt]

## Ana Konular

### 1. Temel Kavramlar
[Temel kavramları açıkla]

### 2. Detaylı Açıklama
[Konuyu detaylı şekilde açıkla, ödev içeriğine göre uyarla]

### 3. Uygulama Örnekleri
[Pratik örnekler ve çözümler]

### 4. Pratik Sorular
[Öğrencinin kendini test edebileceği sorular]

## Sofia'nın Önerileri
[Öğrenme için ipuçları ve öneriler]

## Özet
[Kısa bir özet ve sonuç]

---
Bu döküman Sofia tarafından oluşturulmuştur - Okul Asistanım`;

  try {
    const data = await callClaudeAPI({
      model: CLAUDE_MODEL,
      max_tokens: request.length === 'long' ? 4096 : request.length === 'medium' ? 3072 : 2048,
      temperature: 0.7,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt
        }
      ]
    });

    if (!data.content || data.content.length === 0) {
      throw new Error('Claude API boş yanıt döndü');
    }

    const generatedText = data.content[0].text;

    return {
      content: generatedText,
      metadata: {
        topic: request.topic,
        subject: request.subject,
        gradeLevel: request.gradeLevel,
        generatedAt: new Date().toISOString()
      }
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error('Claude API Error:', error.message);
      throw error;
    }
    throw new Error('Bilinmeyen bir hata oluştu');
  }
};

/**
 * Generate a chat response from Sofia for general questions
 */
export const generateChatResponse = async (
  message: string,
  context?: string
): Promise<string> => {
  if (!isClaudeConfigured()) {
    throw new Error('Claude API yapılandırılmamış. Lütfen ayarları kontrol edin.');
  }

  const systemPrompt = `Sen Sofia, yardımsever bir eğitim asistanısın. Öğrencilere ders konularında yardımcı oluyorsun.
Görevin: Öğrencinin sorularını anlaşılır şekilde cevaplamak ve öğrenmelerine yardımcı olmak.

Önemli kurallar:
- Samimi ve arkadaş canlısı ol
- Karmaşık konuları basitleştir
- Günlük hayattan örnekler ver
- Öğrenciyi motive et
- Türkçe dilbilgisi kurallarına dikkat et`;

  try {
    const data = await callClaudeAPI({
      model: CLAUDE_MODEL,
      max_tokens: 1024,
      temperature: 0.8,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: context ? `${context}\n\nÖğrenci: ${message}` : message
        }
      ]
    });

    return data.content[0].text;
  } catch (error) {
    console.error('Chat API Error:', error);
    throw error;
  }
};
