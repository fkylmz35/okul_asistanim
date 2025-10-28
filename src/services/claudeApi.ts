import type { DocumentGenerationRequest, GeneratedDocument, ClaudeAPIResponse } from '../types/ai';

// Claude 3.5 Haiku - Hızlı ve uygun maliyetli model
const CLAUDE_MODEL = 'claude-3-5-haiku-20241022';

// Determine API endpoint based on environment
const getApiEndpoint = (): string => {
  // Always use proxy endpoint for security
  // Client-side API key usage is insecure and causes CORS errors
  return '/api/claude';
};

// Check if Claude API is configured
export const isClaudeConfigured = (): boolean => {
  // Always return true - proxy endpoint handles the API key server-side
  // If CLAUDE_API_KEY is not set in Vercel, the proxy will return an error
  return true;
};

// Call Claude API via proxy endpoint
const callClaudeAPI = async (requestBody: {
  model: string;
  max_tokens: number;
  temperature: number;
  system: string;
  messages: Array<{ role: string; content: string }>;
}): Promise<ClaudeAPIResponse> => {
  const endpoint = getApiEndpoint();

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
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
