export default async function fetchDomainAnalysis(domain: string) {
    const response = await fetch('https://test-deploy-cpho.onrender.com/analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domain }),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch domain analysis');
    }
  
    const data = await response.json();
    // shape: { status: 200, data: { ...analysisData } }
    if (data.status !== 200) {
      throw new Error(data.data?.error || 'Analysis returned an error');
    }
  
    return data.data; // The dictionary with monthlyTraffic, topKeywords, etc.
  }
  