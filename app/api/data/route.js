import { createClient } from 'redis';
import { NextResponse } from 'next/server';

async function getClient() {
  const client = createClient({ url: process.env.REDIS_URL });
  await client.connect();
  return client;
}

export async function GET(request) {
  let client;
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    if (!email) return NextResponse.json({ error: 'No email' }, { status: 400 });
    client = await getClient();
    const raw = await client.get(`user:${email}`);
    await client.disconnect();
    return NextResponse.json({ data: raw ? JSON.parse(raw) : null });
  } catch (e) {
    console.error('Redis load error:', e);
    if (client) try { await client.disconnect(); } catch(x) {}
    return NextResponse.json({ data: null });
  }
}

export async function POST(request) {
  let client;
  try {
    const { email, data } = await request.json();
    if (!email || !data) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    client = await getClient();
    await client.set(`user:${email}`, JSON.stringify(data));
    await client.disconnect();
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('Redis save error:', e);
    if (client) try { await client.disconnect(); } catch(x) {}
    return NextResponse.json({ error: 'Save failed' }, { status: 500 });
  }
}