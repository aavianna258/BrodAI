// /app/create-article/services/articleService.ts

export async function fetchArticleByKeyword(keyword: string) {
    console.log('[articleService] fetchArticleByKeyword =>', keyword);
    const response = await fetch('/api_mock/generateArticle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ main_keyword: keyword }),
    });
    if (!response.ok) {
      throw new Error('Error generating article');
    }
    return response.json();
  }
  
  export async function refineContent(content: string, refinePrompt: string) {
    const resp = await fetch('http://localhost:8000/refineContent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, refine_instruction: refinePrompt }),
    });
    if (!resp.ok) {
      throw new Error('Server error refining content');
    }
    return resp.json();
  }
  
  export async function insertSingleImage(content: string) {
    const resp = await fetch('http://localhost:8000/applyImage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    if (!resp.ok) {
      throw new Error('Server error on /applyImage');
    }
    return resp.json();
  }
  
  export async function insertCTAs(content: string, useBrodAiCTAs: boolean, wantsCTA: boolean, ctaCount: number, ctaValues: string[]) {
    const resp = await fetch('http://localhost:8000/insertCTAs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, useBrodAiCTAs, wantsCTA, ctaCount, ctaValues }),
    });
    if (!resp.ok) {
      throw new Error('Server error on /insertCTAs');
    }
    return resp.json();
  }
  
  export async function applyImages(content: string, imageStrategy: string, imageCount: number) {
    const resp = await fetch('http://localhost:8000/applyImages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, imageStrategy, imageCount, images: [] }),
    });
    if (!resp.ok) {
      throw new Error('Server error on /applyImages');
    }
    return resp.json();
  }
  
  export async function insertCustomAsset(content: string, prompt: string) {
    const resp = await fetch('http://localhost:8000/insertCustomAsset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, content }),
    });
    if (!resp.ok) {
      throw new Error('Server error on /insertCustomAsset');
    }
    return resp.json();
  }
  
  export async function addExternalLinks(content: string) {
    const resp = await fetch('http://localhost:8000/externalLinkBuilding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    if (!resp.ok) {
      throw new Error('Server error on /externalLinkBuilding');
    }
    return resp.json();
  }
  