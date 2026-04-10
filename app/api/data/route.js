import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

// GET — load user data
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    if (!email) return NextResponse.json({ error: 'No email' }, { status: 400 });

    const data = await kv.get(`user:${email}`);
    return NextResponse.json({ data: data || null });
  } catch (e) {
    console.error('KV load error:', e);
    return NextResponse.json({ data: null });
  }
}

// POST — save user data
export async function POST(request) {
  try {
    const { email, data } = await request.json();
    if (!email || !data) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    await kv.set(`user:${email}`, data);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('KV save error:', e);
    return NextResponse.json({ error: 'Save failed' }, { status: 500 });
  }
}
