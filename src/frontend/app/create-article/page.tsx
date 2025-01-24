'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Button, Input, Select, Spin, message, Radio, Collapse, Modal, notification
} from 'antd';
import DOMPurify from 'dompurify';

const { TextArea } = Input;

type Step = 1 | 2;
type ImageStrategy = 'ownURL' | 'brodAi' | 'aiGenerated';

const CTA_OPTIONS = [
  'Buy Now',
  'Add to cart',
  'Contact sales',
  'Contact us',
] as const;


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

  // ===================== Modal pour Shopify publish =====================
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [shopifyDomain, setShopifyDomain] = useState('');
  const [shopifyToken, setShopifyToken] = useState('');

  // Au clic sur Publish => ouvre la modal
  const handleClickPublish = () => {
    setIsPublishModalOpen(true);
  };

  // Confirmer la modal => simuler la publication
  const handleOkPublish = () => {
    setIsPublishModalOpen(false);
    // Simuler la publication
    message.success(`Published article to domain: ${shopifyDomain}`);
    // Notification usage
    notification.info({
      message: 'You still have 20 articles to publish for free',
      description: 'Now 19 articles left. Upgrade for more visibility on Google!',
    });
  };

  const handleCancelPublish = () => {
    setIsPublishModalOpen(false);
  };

  const handleDiscard = () => {
    router.push('/keyword-research');
  };
  

  // --------------------------------------------

  useEffect(() => {
    const kw = searchParams.get('keyword');
    if (kw) {
      setKeyword(kw);
      fetchArticle(kw);
    }
  }, [searchParams]);

  // ===================== FETCH ARTICLE =====================
  const fetchArticle = async (kw: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api_mock/generateArticle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ main_keyword: kw }),
      });
      if (!res.ok) throw new Error('Error generating article');
      const data = await res.json();

      setTitle(data.title || 'Untitled Article');

      // Extraire la première <div>... </div>
      const raw = data.content || '';
      const match = raw.match(/<div[\s\S]*?<\/div>/i);
      if (match) {
        setContent(match[0]);
      } else {
        setContent(raw);
      }

    } catch (err: any) {
      message.error(err.message || 'Could not generate article');
    } finally {
      setLoading(false);
    }
  };

  // ===================== REFINING, CTA, IMAGES, etc. (placeholder) =====================
  const handleRefineContent = () => {
    if (!refinePrompt.trim()) {
      message.warning('Please specify what you want to change!');
      return;
    }
    message.info(`(Coming soon) We'll refine content with: "${refinePrompt}"`);
  };

  const handleInsertCTAs = () => {
    if (useBrodAiCTAs) {
      message.info('(Coming soon) Let BrodAI figure out best CTA...');
      return;
    }
    if (!wantsCTA || ctaCount < 1) return;
    let newContent = content;
    for (let i = 0; i < ctaCount; i++) {
      const ctaType = ctaValues[i] || CTA_OPTIONS[0];
      newContent += `\n\n<div class="cta-button">${ctaType}</div>\n\n`;
    }
    setContent(newContent);
    message.success(`Inserted ${ctaCount} CTA(s)`);
  };

  const handleChangeImageCount = (val: number) => {
    setImageCount(val);
    setImages(Array(val).fill({ urlOrPrompt: '' }));
  };

  const handleApplyImages = () => {
    switch (imageStrategy) {
      case 'ownURL': {
        let newContent = content;
        const relevant = images.slice(0, imageCount);
        relevant.forEach(img => {
          const url = img.urlOrPrompt.trim();
          if (url) {
            newContent += `<p><img src="${url}" alt="image"/></p>\n`;
          }
        });
        setContent(newContent);
        message.success(`Images inserted!`);
        break;
      }
      case 'brodAi':
        message.info('(Coming soon) BrodAI picks images from the web...');
        break;
      case 'aiGenerated':
        message.info('(Coming soon) AI-generated images from your prompts...');
        break;
    }
  };

  const handleCustomAsset = async () => {
    if (!customAssetPrompt.trim()) {
      message.warning('Please enter a prompt for the custom asset.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api_mock/insertCustomAsset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: customAssetPrompt }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Insert custom asset error');
      }
      const data = await res.json();
      let newContent = content;
      newContent += `\n\n${data.asset_html}\n\n`;
      setContent(newContent);

      message.success('Interactive asset inserted!');
    } catch (err: any) {
      console.error(err);
      message.error(err.message || 'Could not insert custom asset');
    } finally {
      setLoading(false);
    }
  };

  const handleInternalLink = () => {
    message.info('Internal link building (Coming soon)');
  };
  const handleExternalLink = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api_mock/externalLinkBuilding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Link building error');
      }
      const data = await res.json();
      setContent(data.updated_content);
      message.success('External links inserted!');
    } catch (err: any) {
      console.error(err);
      message.error(err.message || 'Could not do external link building');
    } finally {
      setLoading(false);
    }
  };

  const customPreviewCss = `
    h1 { font-size: 1.8rem; margin: 1rem 0; }
    h2 { font-size: 1.4rem; margin: 0.75rem 0; }
    p, li { font-size: 1rem; margin: 0.5rem 0; }
    .cta-button { background-color: #f0c040; padding: 0.5rem; display: inline-block; margin: 0.5rem 0; }
    img { max-width: 100%; height: auto; margin: 0.5rem 0; }
    .highlightKeyword {
      color: #e91e63;
      font-weight: bold;
    }
  `;

  const previewHtml = DOMPurify.sanitize(content);

  // ****************** ÉTAPE 1 ********************
  if (step === 1) {
    return (
      <>
        <style>{customPreviewCss}</style>

        <div style={{ display: 'flex', minHeight: '100vh' }}>
          {/* Section Gauche */}
          <div style={{ width: '350px', borderRight: '1px solid #ccc', padding: '1rem' }}>
            {loading && <Spin style={{ marginBottom: '1rem' }} />}

            {/* 1) “Let’s get traffic from this query” + market + 2 boutons */}
            <h2>Let's get traffic from this query:</h2>
            <p>
              Target keyword: <span className="highlightKeyword">{keyword}</span> <br/>
              Market: <span style={{ color: '#2196f3' }}>France</span>
            </p>
            <Button block style={{ marginBottom: '0.5rem' }} onClick={() => {
              message.info("Show metrics: volume, difficulty, BrodAI score, intent... (coming soon)");
            }}>
              Show Metrics
            </Button>
            <Button block style={{ marginBottom: '1rem' }} onClick={() => {
              message.info("Show competition: who is ranking, type of pages... (coming soon)");
            }}>
              Show Competition
            </Button>

            <p style={{ marginBottom: '1rem', fontSize: '0.95rem' }}>
              BrodAI analyzed all these informations to help you rank on the first page!
            </p>

            {/* Bouton Publish => ouvre la modal */}
            <Button type="primary" block style={{ marginBottom: '1rem' }} onClick={handleClickPublish}>
              Publish
            </Button>

            {/* 2) Explication: BrodAI does everything, but you can still refine */}
            <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
              BrodAI handles everything for you, but you can still customize or refine any part below:
            </p>
            <Button
              style={{ marginBottom: '1rem' }}
              block
              onClick={() =>
                setCollapseActiveKeys(['refine','cta','images','assets','linkbuild','tech'])
              }
            >
              Adjust Details
            </Button>

            {/* Les sections collapsibles */}
            <Collapse
              activeKey={collapseActiveKeys}
              onChange={(keys) => setCollapseActiveKeys(keys as string[])}
              items={[
                {
                  key: 'refine',
                  label: 'Refine Article 🔧',
                  children: (
                    <>
                      <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                        Didn’t like part of the text? Describe what to change:
                      </p>
                      <TextArea
                        rows={2}
                        placeholder="e.g. 'Rewrite the second paragraph about bananas'"
                        value={refinePrompt}
                        onChange={(e) => setRefinePrompt(e.target.value)}
                      />
                      <Button
                        block
                        style={{ marginTop: '0.5rem' }}
                        onClick={handleRefineContent}
                      >
                        Refine Content
                      </Button>
                    </>
                  ),
                },
                {
                  key: 'cta',
                  label: 'CTA Insertion 🚀',
                  children: (
                    <>
                      <Radio.Group
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === 'brodAi') {
                            setUseBrodAiCTAs(true);
                            setWantsCTA(false);
                          } else {
                            setUseBrodAiCTAs(false);
                            setWantsCTA(true);
                          }
                        }}
                        style={{ marginBottom: '0.5rem' }}
                      >
                        <Radio value="manual">I choose how many CTAs (1–5)</Radio>
                        <Radio value="brodAi">Let BrodAI figure them out</Radio>
                      </Radio.Group>

                      {wantsCTA && (
                        <div style={{ marginLeft: '1rem', marginBottom: '1rem' }}>
                          <p>Number of CTAs (1 to 5)</p>
                          <Input
                            type="number"
                            min={1}
                            max={5}
                            value={ctaCount}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10);
                              setCtaCount(val);
                              setCtaValues(Array(val).fill(CTA_OPTIONS[0]));
                            }}
                          />
                          {Array.from({ length: ctaCount }).map((_, i) => (
                            <div key={i} style={{ marginTop: '0.5rem' }}>
                              <p><strong>CTA #{i + 1}</strong></p>
                              <Select
                                style={{ width: '100%' }}
                                value={ctaValues[i]}
                                onChange={(val) => {
                                  const arr = [...ctaValues];
                                  arr[i] = val;
                                  setCtaValues(arr);
                                }}
                                options={CTA_OPTIONS.map((opt) => ({ label: opt, value: opt }))}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                      <Button block onClick={handleInsertCTAs}>
                        Insert CTA(s)
                      </Button>
                    </>
                  ),
                },
                {
                  key: 'images',
                  label: 'Images 🖼️',
                  children: (
                    <>
                      <Radio.Group
                        onChange={(e) => setImageStrategy(e.target.value)}
                        value={imageStrategy}
                        style={{ marginBottom: '0.5rem' }}
                      >
                        <Radio value="ownURL">Insert my own image URLs</Radio>
                        <Radio value="brodAi">BrodAI picks images</Radio>
                        <Radio value="aiGenerated">Generate images with AI</Radio>
                      </Radio.Group>

                      {imageStrategy === 'ownURL' && (
                        <div style={{ marginLeft: '0.5rem', marginBottom: '1rem' }}>
                          <p>How many images? (1 to 5)</p>
                          <Input
                            type="number"
                            min={1}
                            max={5}
                            value={imageCount}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10);
                              handleChangeImageCount(val);
                            }}
                          />
                          {Array.from({ length: imageCount }).map((_, i) => (
                            <div key={i} style={{ marginTop: '0.5rem' }}>
                              <p><strong>Image URL #{i + 1}</strong></p>
                              <Input
                                placeholder="https://example.com/image.jpg"
                                value={images[i]?.urlOrPrompt || ''}
                                onChange={(ev) => {
                                  const arr = [...images];
                                  arr[i].urlOrPrompt = ev.target.value;
                                  setImages(arr);
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                      {imageStrategy === 'brodAi' && (
                        <p>(Coming soon) BrodAI picks images for you</p>
                      )}
                      {imageStrategy === 'aiGenerated' && (
                        <p>(Coming soon) AI-generated images from your prompts</p>
                      )}

                      <Button block onClick={handleApplyImages}>
                        Insert Images
                      </Button>
                    </>
                  ),
                },
                {
                  key: 'assets',
                  label: 'Interactive Assets 🪄',
                  children: (
                    <>
                      <p style={{ fontStyle: 'italic', fontSize: '0.9rem' }}>
                        Boost user engagement with simulators, comparison tables, quizzes...
                      </p>
                      <TextArea
                        rows={2}
                        placeholder="e.g. 'Insert a price simulator for e-commerce'"
                        value={customAssetPrompt}
                        onChange={(e) => setCustomAssetPrompt(e.target.value)}
                      />
                      <Button block style={{ marginTop: '0.5rem' }} onClick={handleCustomAsset}>
                        Insert Custom Asset
                      </Button>
                    </>
                  ),
                },
                {
                  key: 'linkbuild',
                  label: 'Link Building 🌐',
                  children: (
                    <>
                      <p><strong>Website URL:</strong></p>
                      <Input
                        placeholder="https://mysite.com"
                        value={siteUrl}
                        onChange={(e) => setSiteUrl(e.target.value)}
                        style={{ marginBottom: '0.5rem' }}
                      />
                      <Button block onClick={handleInternalLink} style={{ marginBottom: '0.5rem' }} disabled>
                        Internal Link Building (soon)
                      </Button>
                      <Button block onClick={handleExternalLink}>
                        External Link Building
                      </Button>
                    </>
                  ),
                },
                {
                  key: 'tech',
                  label: 'Technical Audit of HTML Code 🏗️',
                  children: (
                    <p>(Coming soon) We'll check your HTML tags, headings, microdata, etc.</p>
                  ),
                },
              ]}
            />

            {/* Edit HTML & discard */}
            <div style={{ marginTop: '1rem' }}>
              <Button
                block
                onClick={() => setShowEditor(!showEditor)}
                style={{ marginBottom: '1rem' }}
              >
                {showEditor ? 'Hide Editor' : 'Edit HTML'}
              </Button>
              <Button block onClick={handleDiscard}>
                Discard
              </Button>
            </div>
          </div>

          {/* Section Droite => Titre + Preview / Editor */}
          <div style={{ flex: 1, padding: '1rem' }}>
            {loading && (
              <div style={{ marginBottom: '1rem' }}>
                <Spin /> Loading...
              </div>
            )}

            <style>{customPreviewCss}</style>

            {/* Titre en haut */}
            <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {!editTitleMode ? (
                <>
                  <h2 style={{ margin: 0 }}>{title}</h2>
                  <Button onClick={() => setEditTitleMode(true)}>Edit Title</Button>
                </>
              ) : (
                <>
                  <Input
                    style={{ fontSize: '1.1rem', fontWeight: 600 }}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <Button onClick={() => setEditTitleMode(false)}>Done</Button>
                </>
              )}
            </div>

            {/* Preview ou Editor */}
            {!showEditor && (
              <div
                style={{
                  border: '1px solid #ccc',
                  padding: '1rem',
                  minHeight: '300px',
                  lineHeight: 1.6,
                }}
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
              />
            )}
            {showEditor && (
              <div>
                <h3>HTML Editor</h3>
                <TextArea
                  style={{ height: 300 }}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
            )}
          </div>
        </div>

        {/* Modal Publish (Shopify domain + token) */}
        <Modal
          title="Publish to Shopify"
          open={isPublishModalOpen}
          onOk={handleOkPublish}
          onCancel={handleCancelPublish}
          okText="Publish"
        >
          <p>Enter your Shopify domain and access token to publish the article:</p>
          <Input
            style={{ marginBottom: '0.5rem' }}
            placeholder="myshop.myshopify.com"
            value={shopifyDomain}
            onChange={(e) => setShopifyDomain(e.target.value)}
          />
          <Input
            style={{ marginBottom: '0.5rem' }}
            placeholder="Shopify Access Token"
            value={shopifyToken}
            onChange={(e) => setShopifyToken(e.target.value)}
          />
        </Modal>
      </>
    );
  }

  // --- ÉTAPE 2 => (Optionnel) Shop config, si besoin ---
  if (step === 2) {
    return (
      <div style={{ minHeight: '100vh', padding: '2rem' }}>
        {loading && <Spin />}

        <h2>Shopify Configuration 🛍️ (Step 2 if needed)</h2>
        <p>Now that your content is ready, let's configure your Shopify blog details.</p>
        {/* ... ou on laisse vide si plus besoin ... */}
        <Button onClick={() => setStep(1)}>⬅️ Back</Button>
      </div>
    );
  }

  return null;
}
