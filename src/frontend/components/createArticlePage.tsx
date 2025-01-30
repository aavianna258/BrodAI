'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { message } from 'antd';

import Step1 from './Step1';
import Step2 from './Step2';
import PublishModal from './PublishModal';

type Step = 1 | 2;
type ImageStrategy = 'ownURL' | 'brodAi' | 'aiGenerated';

export default function CreateArticlePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Steps
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);

  // Article data
  const [keyword, setKeyword] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Title editing
  const [editTitleMode, setEditTitleMode] = useState(false);

  // Editor vs Preview
  const [showEditor, setShowEditor] = useState(false);

  // CTA
  const [useBrodAiCTAs, setUseBrodAiCTAs] = useState(false);
  const [wantsCTA, setWantsCTA] = useState(false);
  const [ctaCount, setCtaCount] = useState(1);
  const [ctaValues, setCtaValues] = useState<string[]>([]);

  // Images
  const [imageStrategy, setImageStrategy] = useState<ImageStrategy>('ownURL');
  const [imageCount, setImageCount] = useState(1);
  const [images, setImages] = useState<{ urlOrPrompt: string }[]>([]);

  // Custom asset
  const [customAssetPrompt, setCustomAssetPrompt] = useState('');

  // refine content
  const [refinePrompt, setRefinePrompt] = useState('');

  // link building
  const [siteUrl, setSiteUrl] = useState('');

  // Collapse sections
  const [collapseActiveKeys, setCollapseActiveKeys] = useState<string[]>([]);

  // ===================== Modal Publish =====================
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [shopifyDomain, setShopifyDomain] = useState('');
  const [shopifyToken, setShopifyToken] = useState('');

  // ------------------------------ FETCH ARTICLE ON MOUNT
  useEffect(() => {
    const kw = searchParams.get('keyword');
    console.log('[CreateArticlePage] useEffect: keyword =', kw);
    if (kw) {
      setKeyword(kw);
      fetchArticle(kw);
    }
  }, [searchParams]);

  // ===================== FETCH ARTICLE =====================
  const fetchArticle = async (kw: string) => {
    console.log('[CreateArticlePage] fetchArticle: start for keyword:', kw);
    setLoading(true);
    try {
      const res = await fetch('/api_mock/generateArticle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ main_keyword: kw }),
      });
      console.log('[CreateArticlePage] fetchArticle: response status:', res.status);
      if (!res.ok) throw new Error('Error generating article');
      const data = await res.json();
      console.log('[CreateArticlePage] fetchArticle: data received:', data);

      setTitle(data.title || 'Untitled Article');
      const raw = data.content || '';
      const match = raw.match(/<div[\s\S]*?<\/div>/i);
      setContent(match ? match[0] : raw);

    } catch (err: any) {
      console.error('[CreateArticlePage] fetchArticle: error:', err);
      message.error(err.message || 'Could not generate article');
    } finally {
      setLoading(false);
      console.log('[CreateArticlePage] fetchArticle: end');
    }
  };

  // ===================== DIVERS HANDLERS (LOGS SI BESOIN) =====================
  // ... handleRefineContent, handleInsertCTAs, etc.

  // ========== Publish Modal Handlers ==========
  const handleClickPublish = () => {
    console.log('[CreateArticlePage] handleClickPublish => opening modal');
    setIsPublishModalOpen(true);
  };

  const handleClosePublishModal = () => {
    console.log('[CreateArticlePage] handleClosePublishModal => closing modal');
    setIsPublishModalOpen(false);
  };

  const handleDiscard = () => {
    console.log('[CreateArticlePage] handleDiscard => going back to /keyword-research');
    router.push('/keyword-research');
  };

  // ===================== Rendu final (step 1 ou 2) =====================
  if (step === 1) {
    return (
      <>
        <Step1
          // Toutes les props nécessaires
          loading={loading}
          step={step}
          setStep={(s: number) => setStep(s as Step)}
          keyword={keyword}
          title={title}
          setTitle={setTitle}
          content={content}
          setContent={setContent}
          editTitleMode={editTitleMode}
          setEditTitleMode={setEditTitleMode}
          showEditor={showEditor}
          setShowEditor={setShowEditor}
          useBrodAiCTAs={useBrodAiCTAs}
          setUseBrodAiCTAs={setUseBrodAiCTAs}
          wantsCTA={wantsCTA}
          setWantsCTA={setWantsCTA}
          ctaCount={ctaCount}
          setCtaCount={setCtaCount}
          ctaValues={ctaValues}
          setCtaValues={setCtaValues}
          imageStrategy={imageStrategy}
          setImageStrategy={setImageStrategy}
          imageCount={imageCount}
          setImageCount={setImageCount}
          images={images}
          setImages={setImages}
          customAssetPrompt={customAssetPrompt}
          setCustomAssetPrompt={setCustomAssetPrompt}
          refinePrompt={refinePrompt}
          setRefinePrompt={setRefinePrompt}
          siteUrl={siteUrl}
          setSiteUrl={setSiteUrl}
          collapseActiveKeys={collapseActiveKeys}
          setCollapseActiveKeys={setCollapseActiveKeys}
          handleRefineContent={() => {}}
          handleInsertCTAs={() => {}}
          handleChangeImageCount={() => {}}
          handleApplyImages={() => {}}
          handleCustomAsset={() => {}}
          handleInternalLink={() => {}}
          handleExternalLink={() => {}}
          handleClickPublish={handleClickPublish}
          handleDiscard={handleDiscard}
          isPublishModalOpen={isPublishModalOpen}
          shopifyDomain={shopifyDomain}
          setShopifyDomain={setShopifyDomain}
          shopifyToken={shopifyToken}
          setShopifyToken={setShopifyToken}
        />

        <PublishModal
          isOpen={isPublishModalOpen}
          onClose={handleClosePublishModal}
          shopifyDomain={shopifyDomain}
          setShopifyDomain={setShopifyDomain}
          shopifyToken={shopifyToken}
          setShopifyToken={setShopifyToken}
          title={title}
          content={content}
        />
      </>
    );
  }

  if (step === 2) {
    return (
      <>
        <Step2
          loading={loading}
          step={step}
          setStep={(s: number) => setStep(s as Step)}
        />
        <PublishModal
          isOpen={isPublishModalOpen}
          onClose={handleClosePublishModal}
          shopifyDomain={shopifyDomain}
          setShopifyDomain={setShopifyDomain}
          shopifyToken={shopifyToken}
          setShopifyToken={setShopifyToken}
          title={title}
          content={content}
        />
      </>
    );
  }

  return null;
}
