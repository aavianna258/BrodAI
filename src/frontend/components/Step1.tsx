'use client';

import React from 'react';
import {
  Button, Input, Select, Spin, message, Radio, Collapse, Modal
} from 'antd';


const { TextArea } = Input;

type Step1Props = {
  // === States ===
  loading: boolean;
  step: number;
  setStep: (s: number) => void;

  keyword: string;
  title: string;
  setTitle: (t: string) => void;
  content: string;
  setContent: (c: string) => void;
  editTitleMode: boolean;
  setEditTitleMode: (b: boolean) => void;
  showEditor: boolean;
  setShowEditor: (b: boolean) => void;

  useBrodAiCTAs: boolean;
  setUseBrodAiCTAs: (b: boolean) => void;
  wantsCTA: boolean;
  setWantsCTA: (b: boolean) => void;
  ctaCount: number;
  setCtaCount: (n: number) => void;
  ctaValues: string[];
  setCtaValues: (vals: string[]) => void;

  imageStrategy: 'ownURL' | 'brodAi' | 'aiGenerated';
  setImageStrategy: (val: 'ownURL' | 'brodAi' | 'aiGenerated') => void;
  imageCount: number;
  setImageCount: (n: number) => void;
  images: { urlOrPrompt: string }[];
  setImages: (arr: { urlOrPrompt: string }[]) => void;

  customAssetPrompt: string;
  setCustomAssetPrompt: (p: string) => void;
  refinePrompt: string;
  setRefinePrompt: (p: string) => void;
  siteUrl: string;
  setSiteUrl: (s: string) => void;

  collapseActiveKeys: string[];
  setCollapseActiveKeys: (keys: string[]) => void;

  // === Handlers ===
  handleRefineContent: () => void;
  handleInsertCTAs: () => void;
  handleChangeImageCount: (val: number) => void;
  handleApplyImages: () => void;
  handleCustomAsset: () => void;
  handleInternalLink: () => void;
  handleExternalLink: () => void;
  handleClickPublish: () => void;
  handleDiscard: () => void;

  // === Modal Publish ===
  isPublishModalOpen: boolean;
  shopifyDomain: string;
  setShopifyDomain: (d: string) => void;
  shopifyToken: string;
  setShopifyToken: (t: string) => void;
};

export default function Step1(props: Step1Props) {
  const {
    loading,
    keyword,
    title, setTitle,
    content, setContent,
    editTitleMode, setEditTitleMode,
    showEditor, setShowEditor,
    useBrodAiCTAs, setUseBrodAiCTAs,
    wantsCTA, setWantsCTA,
    ctaCount, setCtaCount,
    ctaValues, setCtaValues,
    imageStrategy, setImageStrategy,
    imageCount, setImageCount,
    images, setImages,
    customAssetPrompt, setCustomAssetPrompt,
    refinePrompt, setRefinePrompt,
    siteUrl, setSiteUrl,
    collapseActiveKeys, setCollapseActiveKeys,
    handleRefineContent,
    handleInsertCTAs,
    handleChangeImageCount,
    handleApplyImages,
    handleCustomAsset,
    handleInternalLink,
    handleExternalLink,
    handleClickPublish,
    handleDiscard,
    isPublishModalOpen,
    shopifyDomain,
    setShopifyDomain,
    shopifyToken,
    setShopifyToken,
  } = props;

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

  return (
    <>
      <style>{customPreviewCss}</style>

      <div style={{ display: 'flex', minHeight: '100vh' }}>
        {/* SECTION GAUCHE */}
        <div style={{ width: '350px', borderRight: '1px solid #ccc', padding: '1rem' }}>
          {loading && <Spin style={{ marginBottom: '1rem' }} />}

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
          <Button
            type="primary"
            block
            style={{ marginBottom: '1rem' }}
            onClick={handleClickPublish}
          >
            Publish
          </Button>

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
                            setCtaValues(Array(val).fill('Buy Now'));
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
                              options={[
                                { label: 'Buy Now', value: 'Buy Now' },
                                { label: 'Add to cart', value: 'Add to cart' },
                                { label: 'Contact sales', value: 'Contact sales' },
                                { label: 'Contact us', value: 'Contact us' },
                              ]}
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
                    <Button
                      block
                      onClick={handleInternalLink}
                      style={{ marginBottom: '0.5rem' }}
                      disabled
                    >
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

        {/* SECTION DROITE => Titre + Preview/Editor */}
        <div style={{ flex: 1, padding: '1rem' }}>
          {loading && (
            <div style={{ marginBottom: '1rem' }}>
              <Spin /> Loading...
            </div>
          )}

          <style>{customPreviewCss}</style>

          {/* Titre */}
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
          {!showEditor ? (
            <div
              style={{
                border: '1px solid #ccc',
                padding: '1rem',
                minHeight: '300px',
                lineHeight: 1.6,
              }}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : (
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

      {/* Modal Publish => on l'extrait en composant, mais on peut aussi le laisser ici */}
      <Modal
        title="Publish to Shopify"
        open={isPublishModalOpen}
        onOk={() => {}}
        onCancel={() => {}}
        okText="Publish"
      >
        {/* On laisse vide, ou on retire ce code pour le mettre dans PublishModal.tsx */}
      </Modal>
    </>
  );
}
