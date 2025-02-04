import { NextRequest, NextResponse } from 'next/server';
// ou, si vous êtes dans le Pages Router :
// import { NextApiRequest, NextApiResponse } from 'next';

export async function POST(req: NextRequest) {
  try {
    // Récupérer les données envoyées par le front
    const { token, store, blogId, title, content, tags, published } = await req.json();

    // Appel HTTP au serveur Python qui contient le code ShopifyBlogger
    const pythonRes = await fetch('http://localhost:8000/publishShopify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token,
        store,
        blogId,
        title,
        content,
        tags,
        published
      }),
    });
    
    if (!pythonRes.ok) {
      // En cas d’erreur côté Python, on récupère le message et on renvoie une 500
      const errorData = await pythonRes.json();
      return NextResponse.json({ error: errorData.error || 'Error from Python server' }, { status: 500 });
    }

    // Tout va bien, on récupère la réponse JSON
    const data = await pythonRes.json();
    // data peut ressembler à { success: true, article: { title: 'Mon article', id: 'xxx' } }

    // On renvoie la réponse au front
    return NextResponse.json(data, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Si vous devez gérer le cas GET ou autre
export async function GET() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
}
