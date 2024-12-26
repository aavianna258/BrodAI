// app/api/mockArticles/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 200,
    data: [
      {
        title: 'L’artisanat marocain : un savoir-faire ancestral',
        keywords: ['artisanat', 'marocain', 'savoir-faire', 'ancestral'],
        snippet: `
Le Maroc est réputé pour son artisanat unique, perpétué de génération en génération. ...
        `,
      },
      {
        title: 'Comment choisir le tapis parfait pour votre salon ?',
        keywords: ['tapis', 'décoration', 'confort'],
        snippet: `
Le tapis est l’élément phare pour apporter confort et style à votre salon. ...
        `,
      },
    ],
  });
}
