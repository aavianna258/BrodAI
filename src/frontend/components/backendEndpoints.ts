const backendURL = process.env.NEXT_PUBLIC_API_URL;

export interface IBrodAIKeyword {
  keyword: string;
  traffic: number;
  difficulty: number;
  performance_score: number;
}

 
// type ResponseData = {
//   message: string
// }
 
// export default function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<ResponseData>
// ) {
//   res.status(200).json({ message: 'Hello from Next.js!' })
// }

export async function fetchKeywords(endpoint: string): Promise<IBrodAIKeyword[]> {
  const response = await fetch(backendURL + endpoint, {
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

