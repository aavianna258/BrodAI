// app/api/mockAnalysis/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const urlParam = searchParams.get('url') ?? 'unknown-site';

  return NextResponse.json({
    status: 200,
    message: 'Fake analysis for ' + urlParam,
    data: {
      scoreNumeric: 50,
      scoreLetter: 'D+',
      performanceRating: 'Needs Improvement',
      monthlyTraffic: 500,
      avgMonthlyClicks: 100,
      reasonWhyScoreLow: [
        'Not well-positioned in top Google queries',
        'Low total traffic for current keywords',
      ],
      details: [
        { keyword: 'moroccan rug', rating: 'Low', traffic: 40, position: 45 },
        { keyword: 'best rug brand', rating: 'Medium', traffic: 75, position: 27 },
        { keyword: 'berber tapestry', rating: 'Low', traffic: 10, position: 60 },
      ],
      improvements: [
        'Optimize your page for better search queries',
        'Add more relevant product descriptions',
      ],
      nextSteps: [
        "Follow BrodAI's technical fixes based on Google's guidelines",
        'Allow BrodAI to generate SEO-optimized content for your site',
      ],
      // New Fields
      detailedKeywords: [
        {
          keyword: 'vintage berber rugs',
          currentPosition: 50,
          potentialTraffic: 200,
          competitionLevel: 'Medium',
        },
        {
          keyword: 'handmade wool carpet',
          currentPosition: 35,
          potentialTraffic: 350,
          competitionLevel: 'High',
        },
      ],
      improvementKeywords: [
        {
          keyword: 'luxury moroccan rug',
          reason: 'High monthly searches, low competition',
        },
        {
          keyword: 'bohemian decor ideas',
          reason: 'Trending niche with moderate competition',
        },
      ],
      blogPosts: [
        {
          title: 'How to Elevate Your Living Room with Handmade Moroccan Rugs',
          snippet: 'A deep dive into styling tips for a cozy bohemian atmosphere...',
        },
        {
          title: 'Top 5 Berber Tapestries That Instantly Transform Your Space',
          snippet: 'Short snippet highlighting tapestry selection, colors, care...',
        },
      ],
    },
  });
}
