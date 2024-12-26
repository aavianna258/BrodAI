// app/api/mockAnalysis/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const urlParam = searchParams.get('url') ?? 'unknown-site';

  // Return some FAKE data for demonstration
  return NextResponse.json({
    status: 200,
    message: 'Fake analysis for ' + urlParam,
    data: {
      score: 72,
      monthlyTraffic: 4500,
      avgMonthlyClicks: 900,
      reasonWhyScoreLow: [
        'Not a good position in top queries',
        'Lack of relevant content or meta tags',
      ],
      details: [
        { keyword: 'moroccan rug', rating: 'Low', position: 45 },
        { keyword: 'best rug brand', rating: 'Medium', position: 27 },
      ],
      improvements: [
        'Optimize your page for better search queries',
        'Add more relevant product descriptions',
      ],
    },
  });
}
