// app/api_mock/insertCustomAsset/route.ts

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { prompt } = body;

  if (!prompt) {
    return NextResponse.json({ error: 'Missing prompt' }, { status: 400 });
  }

  try {
    const pythonRes = await fetch('http://localhost:8000/insertCustomAsset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    if (!pythonRes.ok) {
      const errorData = await pythonRes.json();
      return NextResponse.json({ error: errorData.detail || 'Python API Error' }, { status: pythonRes.status });
    }

    const data = await pythonRes.json();
    return NextResponse.json(data, { status: 200 });

  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Fetch error' }, { status: 500 });
  }
}
