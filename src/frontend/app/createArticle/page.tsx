'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

import Step1 from '../../components/createArticle/Step1';

import {
  fetchArticleByKeyword,
  refineContent,
  insertSingleImage,
  insertCTAs,
  applyImages,
  insertCustomAsset,
  addExternalLinks,
} from '../../components/services/articleService';

// type ImageStrategy = 'ownURL' | 'brodAi' | 'aiGenerated';

export default function CreateArticlePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Steps
  const [loading, setLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

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
  const [imageStrategy, setImageStrategy] = useState('ownURL');
  const [imageCount, setImageCount] = useState(1);
  // we don't use the array of images for now, but you could if needed
  const [images, setImages] = useState<{ urlOrPrompt: string }[]>([]);

  // Custom asset
  const [customAssetPrompt, setCustomAssetPrompt] = useState('');

  // refine content
  const [refinePrompt, setRefinePrompt] = useState('');

  // link building
  const [siteUrl, setSiteUrl] = useState('');

  // Collapse sections
  const [collapseActiveKeys, setCollapseActiveKeys] = useState<string[]>([]);

  // Publish Modal
  const [isPublishModalOpen, setPublishModalOpen] = useState(false);
  const [shopifyDomain, setShopifyDomain] = useState('');
  const [shopifyToken, setShopifyToken] = useState('');

  // ------------------------------ FETCH ARTICLE ON MOUNT
  useEffect(() => {
    const kw = searchParams.get('keyword');
    if (kw) {
      setKeyword(kw);
      doFetchArticle(kw);
    }
  }, [searchParams]);

  const doFetchArticle = async (kw: string) => {
    setLoading(true);
    try {
      const data = await fetchArticleByKeyword(kw);
      setTitle(data.title || 'Untitled Article');
      const raw = data.content || '';
      const match = raw.match(/<div[\s\S]*?<\/div>/i);
      setContent(match ? match[0] : raw);
    } catch (err: any) {
      alert(err.message || 'Could not generate article');
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------ Handlers
  const handleRefineContent = async () => {
    if (!refinePrompt) {
      alert('Please provide a refine instruction.');
      return;
    }
    setLoadingAction('refine');
    try {
      const data = await refineContent(content, refinePrompt);
      if (data.updated_content) {
        setContent(data.updated_content);
      } else {
        alert('Error refining content');
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleInsertImage = async () => {
    setLoadingAction('image');
    try {
      const data = await insertSingleImage(content);
      if (data.updated_content) {
        setContent(data.updated_content);
      } else {
        alert('Error inserting image');
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleInsertCTAs = async () => {
    setLoadingAction('cta');
    try {
      const data = await insertCTAs(content, useBrodAiCTAs, wantsCTA, ctaCount, ctaValues);
      if (data.updated_content) {
        setContent(data.updated_content);
      } else {
        alert('Error inserting CTAs');
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleApplyImages = async () => {
    setLoadingAction('images');
    try {
      const data = await applyImages(content, imageStrategy, imageCount);
      if (data.updated_content) {
        setContent(data.updated_content);
      } else {
        alert('Error applying images');
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleCustomAsset = async () => {
    if (!customAssetPrompt) {
      alert('Describe the asset you want to insert.');
      return;
    }
    setLoadingAction('customAsset');
    try {
      const data = await insertCustomAsset(content, customAssetPrompt);
      if (data.asset_html) {
        setContent(content + data.asset_html);
      } else {
        alert('Error inserting asset');
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleExternalLink = async () => {
    setLoadingAction('externalLink');
    try {
      const data = await addExternalLinks(content);
      if (data.updated_content) {
        setContent(data.updated_content);
      } else {
        alert('Error adding external links');
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleInternalLink = () => {
    alert('Internal Link Building is not implemented yet!');
  };

  const handleClickPublish = () => {
    setPublishModalOpen(true);
  };

  const handleDiscard = () => {
    setContent('');
    setTitle('');
    alert('Article was reset to empty content');
  };

  // ------------------------------ Render
    return (
      <Step1
        loading={loading}
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
        customAssetPrompt={customAssetPrompt}
        setCustomAssetPrompt={setCustomAssetPrompt}
        refinePrompt={refinePrompt}
        setRefinePrompt={setRefinePrompt}
        siteUrl={siteUrl}
        setSiteUrl={setSiteUrl}
        collapseActiveKeys={collapseActiveKeys}
        setCollapseActiveKeys={setCollapseActiveKeys}
        isPublishModalOpen={isPublishModalOpen}
        shopifyDomain={shopifyDomain}
        setShopifyDomain={setShopifyDomain}
        shopifyToken={shopifyToken}
        setShopifyToken={setShopifyToken}

        handleRefineContent={handleRefineContent}
        handleInsertCTAs={handleInsertCTAs}
        handleInsertImage={handleInsertImage}
        handleCustomAsset={handleCustomAsset}
        handleInternalLink={handleInternalLink}
        handleExternalLink={handleExternalLink}
        handleClickPublish={handleClickPublish}
        handleDiscard={handleDiscard}
        loadingAction={loadingAction}
        setPublishModalOpen={setPublishModalOpen}
      />
    );
}
