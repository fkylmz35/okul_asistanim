export interface DocumentGenerationRequest {
  topic: string;
  content: string;
  subject: string;
  gradeLevel: string;
  length: 'short' | 'medium' | 'long';
  documentType: 'pdf' | 'docx' | 'pptx' | 'study-sheet';
}

export interface GeneratedDocument {
  content: string;
  metadata: {
    topic: string;
    subject: string;
    gradeLevel: string;
    generatedAt: string;
  };
}

export interface ClaudeAPIResponse {
  content: Array<{
    type: string;
    text: string;
  }>;
  model: string;
  stop_reason: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}
