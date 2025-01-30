export interface IBrodAIKeyword {
    keyword: string;
    traffic: number;
    difficulty: number;
    performance_score: number;
  }


  
  export async function fetchKeywords(mainKeyword: string): Promise<IBrodAIKeyword[]> {
    const response = await fetch('https://test-deploy-cpho.onrender.com/keyword_research', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ main_keyword: mainKeyword }),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch keyword data');
    }
    const data = await response.json();
    return data.target_kw_report || [];
  }

  export async function fetchDomain(mainDomain: string): Promise<IBrodAIKeyword[]> {
    const response = await fetch('localhost:8000/domain_to_keywords', {
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

  