/**
 * Vercel Serverless Function - Claude API Proxy (Node.js Runtime)
 *
 * Edge runtime'da sorun olursa bu dosyayı claude.ts olarak kullan
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get API key from environment
  const apiKey = process.env.CLAUDE_API_KEY;

  if (!apiKey) {
    console.error('CLAUDE_API_KEY not configured');
    return res.status(500).json({
      error: 'Claude API key not configured',
      message: 'API anahtarı yapılandırılmamış. Lütfen yöneticiye başvurun.'
    });
  }

  try {
    // Parse request body
    const body = req.body;

    // Validate request
    if (!body.model || !body.messages || !Array.isArray(body.messages)) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Geçersiz istek formatı'
      });
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

      return res.status(response.status).json({
        error: 'Claude API error',
        message: 'Claude API ile iletişim kurulamadı',
        details: errorData
      });
    }

    const data = await response.json();

    // Return successful response
    return res.status(200).json(data);

  } catch (error) {
    console.error('Error processing Claude request:', error);

    return res.status(500).json({
      error: 'Internal server error',
      message: 'İstek işlenirken bir hata oluştu',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
