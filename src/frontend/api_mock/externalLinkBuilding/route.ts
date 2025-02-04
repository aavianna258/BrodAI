// app/api_mock/externalLinkBuilding/route.ts

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { content } = body;

  if (!content) {
    return NextResponse.json({ error: 'Missing content' }, { status: 400 });
  }

  try {
    const pythonRes = await fetch('http://localhost:8000/externalLinkBuilding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
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
