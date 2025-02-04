// /app/create-article/services/shopifyService.ts

export async function publishToShopify(shopifyDomain: string, shopifyToken: string, title: string, content: string) {
    if (!shopifyDomain || !shopifyToken) {
      throw new Error('Please provide valid Shopify domain and token');
    }
  
    const res = await fetch('http://localhost:8000/publishShopify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: shopifyToken,
        store: shopifyDomain,
        blogId: 'gid://shopify/Blog/114693013829',
        title,
        content,
        tags: [],
        published: true,
      }),
    });
  
    if (!res.ok) {
      // Attempt to read the error message from the server
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Unknown server error');
    }
  
    const data = await res.json();
    return data;
  }
