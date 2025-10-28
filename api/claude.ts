/**
 * Vercel Edge Function - Claude API Proxy
 *
 * Bu endpoint client-side'dan gelen Claude API isteklerini güvenli bir şekilde
 * backend üzerinden Claude API'ye yönlendirir.
 *
 * Güvenlik:
 * - API anahtarı server-side'da saklanır (environment variable)
 * - CORS problemi çözülür
 * - Rate limiting eklenebilir
 * - Usage tracking yapılabilir
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = {
  runtime: 'edge',
};

interface ClaudeRequest {
  model: string;
  max_tokens: number;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  system?: string;
  temperature?: number;
}

interface ClaudeResponse {
  id: string;
  type: string;
  role: string;
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

export default async function handler(req: Request) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      {
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  // Get API key from environment
  const apiKey = process.env.CLAUDE_API_KEY;

  if (!apiKey) {
    console.error('CLAUDE_API_KEY not configured');
    return new Response(
      JSON.stringify({
        error: 'Claude API key not configured',
        message: 'API anahtarı yapılandırılmamış. Lütfen yöneticiye başvurun.'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  try {
    // Parse request body
    const body: ClaudeRequest = await req.json();

    // Validate request
    if (!body.model || !body.messages || !Array.isArray(body.messages)) {
      return new Response(
        JSON.stringify({
          error: 'Invalid request',
          message: 'Geçersiz istek formatı'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Call Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: body.model,
        max_tokens: body.max_tokens || 4096,
        messages: body.messages,
        system: body.system,
        temperature: body.temperature || 1,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Claude API error:', errorData);

      return new Response(
        JSON.stringify({
          error: 'Claude API error',
          message: 'Claude API ile iletişim kurulamadı',
          details: errorData
        }),
        {
          status: response.status,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const data: ClaudeResponse = await response.json();

    // Return successful response
    return new Response(
      JSON.stringify(data),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      }
    );

  } catch (error) {
    console.error('Error processing Claude request:', error);

    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: 'İstek işlenirken bir hata oluştu',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
