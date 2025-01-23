'use client'; // Pour l'App Router
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button, Input, Spin, message } from 'antd';

export default function CreateArticlePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [keyword, setKeyword] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const kw = searchParams.get('keyword');
    if (kw) {
      setKeyword(kw);
      fetchArticle(kw);
    }
  }, [searchParams]);

  // 2.2 Faire l’appel vers un endpoint Next.js qui appelle article_writter.py
  const fetchArticle = async (kw: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api_mock/generateArticle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword: kw }),
      });
      if (!res.ok) {
        throw new Error('Error generating article');
      }
      const data = await res.json();
      setTitle(data.title);
      setContent(data.content);
    } catch (error: any) {
      message.error(error.message || 'Could not generate article');
    } finally {
      setLoading(false);
    }
  };

  const handleDiscard = () => {
    // Retour en arrière ou redirection
    router.push('/keyword-research'); 
  };

  const handlePublish = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api_mock/publishArticle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          // (vous pouvez ajouter d’autres champs nécessaires)
        }),
      });
      if (!res.ok) {
        throw new Error('Publish failed');
      }
      message.success('Article published to Shopify!');
      // Redirige vers la page d’accueil, ou autre
      router.push('/keyword-research');
    } catch (error: any) {
      message.error(error.message || 'Publish failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      {loading && (
        <div style={{ marginBottom: '1rem' }}>
          <Spin /> Generating or Publishing...
        </div>
      )}

      <h1>Creating Article for: {keyword}</h1>
      
      {/* On peut laisser l'utilisateur éditer directement */}
      <Input
        style={{ marginBottom: '1rem' }}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Input.TextArea
        style={{ height: 200 }}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <div style={{ marginTop: '1rem' }}>
        <Button onClick={handleDiscard} disabled={loading}>
          Discard
        </Button>
        <Button type="primary" onClick={handlePublish} style={{ marginLeft: '1rem' }} disabled={loading}>
          Publish
        </Button>
      </div>
    </div>
  );
}
