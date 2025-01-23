// app/api_mock/generateArticle/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // Lire le body JSON
  const body = await request.json();
  const { keyword } = body;

  if (!keyword) {
    return NextResponse.json({ error: 'Missing keyword' }, { status: 400 });
  }

  // Simuler un article "fake"
  const title = `How to succeed with "${keyword}"`;
  const content = `Lorem ipsum about ${keyword}... (Faux contenu généré)`;

  // On renvoie un JSON
  return NextResponse.json({ title, content });
}
