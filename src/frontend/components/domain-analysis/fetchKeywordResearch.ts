// components/domain-analysis/fetchKeywordResearch.ts
interface KeywordResearchRequestBody {
    main_keyword: string;
  }
  
  export interface IBrodAIKeyword {
    keyword: string;
    traffic: number;
    difficulty: string;
    performance_score: number;
  }
  
  interface KeywordResearchResponse {
    target_kw_report: IBrodAIKeyword[];
  }
  
  export default async function fetchKeywordResearch(mainKeyword: string) {
    const response = await fetch('https://test-deploy-cpho.onrender.com/keyword_research', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        main_keyword: mainKeyword,
      } as KeywordResearchRequestBody),
    });
  
    if (!response.ok) {
      throw new Error('Failed to fetch keyword research');
    }
  
    const data = (await response.json()) as KeywordResearchResponse;
    return data.target_kw_report; // array of IBrodAIKeyword
  }
  