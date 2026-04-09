import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { system, messages } = await request.json();
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        system,
        messages,
      }),
    });

    const data = await res.json();
    const text = data.content?.map(c => c.text || '').join('\n') || 'No response.';
    return NextResponse.json({ text });
  } catch (e) {
    return NextResponse.json({ error: 'AI request failed' }, { status: 500 });
  }
}
