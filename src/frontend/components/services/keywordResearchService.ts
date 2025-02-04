const backendURL = process.env.NEXT_PUBLIC_API_URL;
export interface IBrodAIKeyword {
  keyword: string;
  traffic: number;
  difficulty: number;
  performance_score: number;
}

export async function fetchKeywords(url: string): Promise<IBrodAIKeyword[]> {
  // Construct the URL with the query parameter (encode to handle special characters)
  const endpoint = `${backendURL}/summarize_site?site_url=${encodeURIComponent(url)}`;

  // Create the Request object with the POST method and proper headers
  const request = new Request(endpoint, {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  });

  // Use fetch with the Request object
  const response = await fetch(request);
  if (!response.ok) {
    throw new Error('Failed to fetch keyword data');
  }
  const data = await response.json();
  return data.target_kw_report || [];
}

// export async function fetchDomain(mainDomain: string): Promise<IBrodAIKeyword[]> {
//   const endpoint = backendURL + '/summarize_site';

//   // Create the Request object with the POST method, headers, and JSON body
//   const request = new Request(endpoint, {
//     method: 'POST',
//     headers: new Headers({
//       'Content-Type': 'application/json'
//     }),
//     body: JSON.stringify({ domain: mainDomain })
//   });

//   // Use fetch with the Request object
//   const response = await fetch(request);
//   if (!response.ok) {
//     throw new Error('Failed to fetch keyword data');
//   }
//   const data = await response.json();
//   return data.target_kw_report || [];
// }
