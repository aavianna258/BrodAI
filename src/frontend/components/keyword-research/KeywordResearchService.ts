export interface IBrodAIKeyword {
    keyword: string;
    traffic: number;
    difficulty: number;
    performance_score: number;
  }


  
  export async function fetchKeywords(url: string): Promise<IBrodAIKeyword[]> {
    const response = await fetch('http://localhost:8000/summarize_site?site_url='+url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch keyword data');
    }
    const data = await response.json();
    return data.target_kw_report || [];
  }

  export async function fetchDomain(mainDomain: string): Promise<IBrodAIKeyword[]> {
    const response = await fetch('localhost:8000/summarize_site', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domain: mainDomain }),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch keyword data');
    }
    const data = await response.json();
    return data.target_kw_report || [];
  }

  