'use client';

import React, { useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import PublishModal from './PublishModal';
import TitleEditor from './TitleEditor';

import RefinePanel from './articleCreationPanels/RefinePanel';
import CTASettingsPanel from './articleCreationPanels/CTASettingsPanel';
import ImagesSettingsPanel from './articleCreationPanels/ImagesSettingsPanel';
import CustomAssetPanel from './articleCreationPanels/CustomAssetPanel';
import LinkBuildingPanel from './articleCreationPanels/LinkBuildingPanel';

interface Step1Props {
  loading: boolean;
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

  imageStrategy: string;
  setImageStrategy: (val: string) => void;
  imageCount: number; // not used in the example but could be
  setImageCount: (val: number) => void;

  customAssetPrompt: string;
  setCustomAssetPrompt: (val: string) => void;
  refinePrompt: string;
  setRefinePrompt: (val: string) => void;

  siteUrl: string;
  setSiteUrl: (val: string) => void;

  collapseActiveKeys: string[];
  setCollapseActiveKeys: (keys: string[]) => void;

  isPublishModalOpen: boolean;
  shopifyDomain: string;
  setShopifyDomain: (val: string) => void;
  shopifyToken: string;
  setShopifyToken: (val: string) => void;

  handleRefineContent: () => void;
  handleInsertCTAs: () => void;
  handleInsertImage: () => void;
  handleCustomAsset: () => void;
  handleInternalLink: () => void;
  handleExternalLink: () => void;

  handleClickPublish: () => void;
  handleDiscard: () => void;

  loadingAction: string | null; // to track which action is in progress
  setPublishModalOpen: (b: boolean) => void;
}

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
    customAssetPrompt, setCustomAssetPrompt,
    refinePrompt, setRefinePrompt,
    siteUrl, setSiteUrl,
    collapseActiveKeys, setCollapseActiveKeys,
    isPublishModalOpen,
    shopifyDomain,
    setShopifyDomain,
    shopifyToken,
    setShopifyToken,
    handleRefineContent,
    handleInsertCTAs,
    handleInsertImage,
    handleCustomAsset,
    handleInternalLink,
    handleExternalLink,
    handleClickPublish,
    handleDiscard,
    loadingAction,
    setPublishModalOpen,
  } = props;

  // Inline styles for the preview
  const customPreviewCss = `
    h1 { font-size: 1.8rem; margin: 1rem 0; }
    h2 { font-size: 1.4rem; margin: 0.75rem 0; }
    p, li { font-size: 1rem; margin: 0.5rem 0; }
    .cta-button { background-color: #f0c040; padding: 0.5rem; display: inline-block; margin: 0.5rem 0; }
    img { max-width: 100%; height: auto; margin: 0.5rem 0; }
    .highlightKeyword { color: #e91e63; font-weight: bold; }
  `;

  // Helper for rendering each accordion
  const renderAccordion = (panelKey: string, label: string, child: React.ReactNode) => (
    <Accordion
      expanded={collapseActiveKeys.includes(panelKey)}
      onChange={() => {
        if (collapseActiveKeys.includes(panelKey)) {
          setCollapseActiveKeys(collapseActiveKeys.filter(k => k !== panelKey));
        } else {
          setCollapseActiveKeys([...collapseActiveKeys, panelKey]);
        }
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        {label}
      </AccordionSummary>
      <AccordionDetails>{child}</AccordionDetails>
    </Accordion>
  );

  return (
    <>
      <style>{customPreviewCss}</style>

      <div style={{ display: 'flex', minHeight: '100vh' }}>
        {/* LEFT SIDEBAR */}
        <div style={{ width: '350px', borderRight: '1px solid #ccc', padding: '1rem' }}>
          <h2>Let's get traffic from this query:</h2>
          <p>
            Target keyword: <span className="highlightKeyword">{keyword}</span> <br />
            Market: <span style={{ color: '#2196f3' }}>France</span>
          </p>
          <p style={{ marginBottom: '1rem', fontSize: '0.95rem' }}>
            BrodAI analyzed data to help you rank on the first page!
          </p>

          {/* PUBLISH BUTTON (opens the Publish modal) */}
          <Button
            variant="contained"
            fullWidth
            style={{ marginBottom: '1rem' }}
            onClick={() => setPublishModalOpen(true)}
            disabled={loadingAction === 'publish'}
          >
            {loadingAction === 'publish'
              ? <><CircularProgress size={20} />&nbsp;Publishing...</>
              : 'Publish'
            }
          </Button>

          <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
            BrodAI handles everything, but you can refine below:
          </p>
          <Button
            variant="outlined"
            fullWidth
            style={{ marginBottom: '1rem' }}
            onClick={() =>
              setCollapseActiveKeys(['refine', 'cta', 'images', 'assets', 'linkbuild'])
            }
          >
            Adjust Details
          </Button>

          {/* ACCORDION PANELS */}
          {renderAccordion('refine', 'Refine Article 🔧',
            <RefinePanel
              refinePrompt={refinePrompt}
              setRefinePrompt={setRefinePrompt}
              loadingAction={loadingAction}
              onRefine={handleRefineContent}
            />
          )}

          {renderAccordion('cta', 'CTA Insertion 🚀',
            <CTASettingsPanel
              useBrodAiCTAs={useBrodAiCTAs}
              setUseBrodAiCTAs={setUseBrodAiCTAs}
              wantsCTA={wantsCTA}
              setWantsCTA={setWantsCTA}
              ctaCount={ctaCount}
              setCtaCount={setCtaCount}
              ctaValues={ctaValues}
              setCtaValues={setCtaValues}
              onInsertCTAs={handleInsertCTAs}
              loadingAction={loadingAction}
            />
          )}

          {renderAccordion('images', 'Images 🖼️',
            <ImagesSettingsPanel
              imageStrategy={imageStrategy}
              setImageStrategy={setImageStrategy}
              onInsertImage={handleInsertImage}
              loadingAction={loadingAction}
            />
          )}

          {renderAccordion('assets', 'Interactive Assets 🪄',
            <CustomAssetPanel
              customAssetPrompt={customAssetPrompt}
              setCustomAssetPrompt={setCustomAssetPrompt}
              onInsertAsset={handleCustomAsset}
              loadingAction={loadingAction}
            />
          )}

          {renderAccordion('linkbuild', 'Link Building 🌐',
            <LinkBuildingPanel
              onInsertExternalLinks={handleExternalLink}
              onInsertInternalLinks={handleInternalLink}
              loadingAction={loadingAction}
            />
          )}

          <div style={{ marginTop: '1rem' }}>
            <Button
              fullWidth
              variant="outlined"
              style={{ marginBottom: '1rem' }}
              onClick={() => setShowEditor(!showEditor)}
            >
              {showEditor ? 'Hide Editor' : 'Edit HTML'}
            </Button>
            <Button
              fullWidth
              variant="text"
              color="secondary"
              onClick={handleDiscard}
            >
              Discard
            </Button>
          </div>
        </div>

        {/* RIGHT SECTION => Title + Preview/Editor */}
        <div style={{ flex: 1, padding: '1rem' }}>
          {loading && (
            <div style={{ marginBottom: '1rem' }}>
              <CircularProgress />
              &nbsp;Loading...
            </div>
          )}

          {/* TITLE */}
          {!loading && (
            <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <TitleEditor
                title={title}
                editTitleMode={editTitleMode}
                setEditTitleMode={setEditTitleMode}
                setTitle={setTitle}
              />
            </div>
          )}

          {/* PREVIEW or EDITOR */}
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
              <TextField
                multiline
                fullWidth
                rows={15}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>

      <PublishModal
        isOpen={isPublishModalOpen}
        onClose={() => setPublishModalOpen(false)}
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
