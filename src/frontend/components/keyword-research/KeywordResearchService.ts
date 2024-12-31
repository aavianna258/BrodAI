// src/services/keywordResearchService.ts
export interface IBrodAIKeyword {
    keyword: string;
    traffic: number;
    difficulty: number;
    performance_score: number;
  }
  
  export async function fetchKeywords(mainKeyword: string): Promise<IBrodAIKeyword[]> {
    const response = await fetch('http://localhost:8000/keyword_research', {
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
  