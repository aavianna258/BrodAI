// app/api/mockArticles/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  // Nouveaux articles plus "réalistes"
  return NextResponse.json({
    status: 200,
    data: [
      {
        title: 'L’artisanat marocain : un savoir-faire ancestral',
        keywords: ['artisanat', 'marocain', 'savoir-faire', 'ancestral'],
        snippet: `
Le Maroc est réputé pour son artisanat unique, perpétué de génération en génération. 
Des tapis berbères tissés à la main jusqu’aux céramiques de Fès, l’artisanat marocain 
reflète un savoir-faire ancestral et constitue un patrimoine culturel inestimable. 
Découvrez comment ces pièces uniques subliment la décoration intérieure 
et favorisent une économie locale florissante.
        `,
      },
      {
        title: 'Comment choisir le tapis parfait pour votre salon ?',
        keywords: ['tapis', 'décoration', 'confort'],
        snippet: `
Le tapis est l’élément phare pour apporter confort et style à votre salon. 
Que vous préfériez un tapis berbère, un kilim coloré ou un modèle plus minimaliste, 
plusieurs critères sont à prendre en compte : la taille, le motif, les matériaux 
et l’harmonie globale avec votre décoration. Découvrez nos astuces pour faire 
le bon choix et transformer votre intérieur en un véritable cocon de confort.
        `,
      },
    ],
  });
}
