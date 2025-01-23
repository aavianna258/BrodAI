// /app/api_mock/publishArticle/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Missing title or content' },
        { status: 400 },
      );
    }

    // EXEMPLE: on simule un appel à votre module Python 
    // (shopify_blogger.py) pour publier l'article.
    // 
    // spawn('python', ['shopify_blogger.py', 'create_article', ...])
    // 
    // Pour l'exemple, on fait juste un setTimeout de 2 secondes.
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // On renvoie un succès simulé
    return NextResponse.json({
      success: true,
      articleId: 'gid://shopify/Article/12345',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 },
    );
  }
}

// (Optionnel) Gérer d'autres méthodes si vous voulez renvoyer 405
export async function GET() {
  return NextResponse.json(
    { error: 'Method Not Allowed' },
    { status: 405 },
  );
}
