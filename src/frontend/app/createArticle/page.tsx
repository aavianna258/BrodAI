'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

// MUI imports used in Step1
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Child components originally used in Step1
import PublishModal from '../../components/createArticle/PublishModal';
import TitleEditor from '../../components/createArticle/TitleEditor';
import RefinePanel from '../../components/createArticle/articleCreationPanels/RefinePanel';
import CTASettingsPanel from '../../components/createArticle/articleCreationPanels/CTASettingsPanel';
import ImagesSettingsPanel from '../../components/createArticle/articleCreationPanels/ImagesSettingsPanel';
import CustomAssetPanel from '../../components/createArticle/articleCreationPanels/CustomAssetPanel';
import LinkBuildingPanel from '../../components/createArticle/articleCreationPanels/LinkBuildingPanel';

// Services
import {
  fetchArticleByKeyword,
  refineContent,
  insertSingleImage,
  insertCTAs,
  applyImages,
  insertCustomAsset,
  addExternalLinks,
} from '../../components/backendService';

export default function CreateArticlePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ------------------------------ States (previously in createArticle.tsx)
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
  const [images, setImages] = useState<{ urlOrPrompt: string }[]>([]); // not currently used

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

  // ------------------------------ Fetch article on mount
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

  // ------------------------------ Action handlers (from Step1)
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

  // ------------------------------ Helpers for UI
  const customPreviewCss = `
    h1 { font-size: 1.8rem; margin: 1rem 0; }
    h2 { font-size: 1.4rem; margin: 0.75rem 0; }
    p, li { font-size: 1rem; margin: 0.5rem 0; }
    .cta-button { background-color: #f0c040; padding: 0.5rem; display: inline-block; margin: 0.5rem 0; }
    img { max-width: 100%; height: auto; margin: 0.5rem 0; }
    .highlightKeyword { color: #e91e63; font-weight: bold; }
  `;

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

  // ------------------------------ Render (merged Step1 UI)
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

          {/* ACCORDIONS */}
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

      {/* The publish modal at the bottom */}
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
