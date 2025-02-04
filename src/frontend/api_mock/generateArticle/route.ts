// app/api_mock/generateArticle/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // Lire le body JSON envoyé par le front
  const body = await request.json();
  const { main_keyword } = body;

  if (!main_keyword) {
    return NextResponse.json({ error: 'Missing keyword' }, { status: 400 });
  }

  // Appeler notre API Python sur http://localhost:8000/generateArticle
  try {
    const pythonRes = await fetch('http://localhost:8000/generateArticle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ main_keyword }),
    });

    // Si l'API Python renvoie une erreur HTTP (ex: 4xx / 5xx)
    if (!pythonRes.ok) {
      const error = await pythonRes.json();
      return NextResponse.json({ error: error.detail || 'Python API Error' }, { status: pythonRes.status });
    }

    // Sinon, on parse le JSON
    const data = await pythonRes.json();

    // On renvoie la même structure au front
    return NextResponse.json(data, { status: 200 });

  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Fetch error' }, { status: 500 });
  }
}
