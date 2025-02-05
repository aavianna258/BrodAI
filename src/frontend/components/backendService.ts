const backendURL = process.env.NEXT_PUBLIC_API_URL;

async function makeBackendRequest<T = any>(request: Request, requestName: string): Promise<T> {
  const response = await fetch(request);

  if (!response.ok) {
    // Attempt to read the error message from the server
    const errData = await response.json().catch(() => ({}));
    throw new Error(`Error making request: ${requestName}\nError data: ${errData.error || 'Unknown error'}`);
  }

  return response.json();
}

export interface IBrodAIKeyword {
  keyword: string;
  traffic: number;
  difficulty: number;
  performance_score: number;
}

export async function fetchArticleByKeyword(keyword: string) {
  const request = new Request(`${backendURL}/generateArticle`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ main_keyword: keyword }),
  });

  // Use the shared helper
  return makeBackendRequest(request, 'fetchArticleByKeyword');
}

export async function refineContent(content: string, refinePrompt: string) {
  const request = new Request(`${backendURL}/refineContent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, refine_instruction: refinePrompt }),
  });

  return makeBackendRequest(request, 'refineContent');
}

export async function insertSingleImage(content: string) {
  const request = new Request(`${backendURL}/applyImage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });

  return makeBackendRequest(request, 'insertSingleImage');
}

export async function insertCTAs(
  content: string,
  useBrodAiCTAs: boolean,
  wantsCTA: boolean,
  ctaCount: number,
  ctaValues: string[],
) {
  const request = new Request(`${backendURL}/insertCTAs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content,
      useBrodAiCTAs,
      wantsCTA,
      ctaCount,
      ctaValues,
    }),
  });

  return makeBackendRequest(request, 'insertCTAs');
}

export async function applyImages(content: string, imageStrategy: string, imageCount: number) {
  const request = new Request(`${backendURL}/applyImages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content,
      imageStrategy,
      imageCount,
      images: [],
    }),
  });

  return makeBackendRequest(request, 'applyImages');
}

export async function insertCustomAsset(content: string, prompt: string) {
  const request = new Request(`${backendURL}/insertCustomAsset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, content }),
  });

  return makeBackendRequest(request, 'insertCustomAsset');
}

export async function addExternalLinks(content: string) {
  const request = new Request(`${backendURL}/externalLinkBuilding`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });

  return makeBackendRequest(request, 'addExternalLinks');
}

export async function fetchKeywords(url: string): Promise<IBrodAIKeyword[]> {
  // Construct the URL with the query parameter
  const endpoint = `${backendURL}/summarize_site?site_url=${encodeURIComponent(url)}`;

  const request = new Request(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  // Here we want the 'target_kw_report' specifically (or [])
  const data = await makeBackendRequest(request, 'fetchKeywords');
  return data.target_kw_report || [];
}

export async function publishToShopify(
  shopifyDomain: string,
  shopifyToken: string,
  title: string,
  content: string,
) {
  if (!shopifyDomain || !shopifyToken) {
    throw new Error('Please provide valid Shopify domain and token');
  }

  const request = new Request(`${backendURL}/publishShopify`, {
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

  // This will throw an error with the requestName if response is not OK
  return makeBackendRequest(request, 'publishToShopify');
}

export async function publishToWordPress(
  wordpressUrl: string,
  wordpressUsername: string,
  wordpressPassword: string,
  title: string,
  content: string,
  featuredImage?: Blob
) {
  const formData = new FormData();
  formData.append('url', wordpressUrl);
  formData.append('username', wordpressUsername);
  formData.append('password', wordpressPassword);
  formData.append('title', title);
  formData.append('content', content);
  if (featuredImage) {
    formData.append('featured_image', featuredImage);
  }

  const request = new Request(`${backendURL}/publishWordPress`, {
    method: 'POST',
    body: formData,
  });

  return makeBackendRequest(request, 'publishToWordPress');
}
