"use client";

import React, { useState } from "react";
import {
  Button, Input, Select, Spin, message, Radio, Collapse, Modal
} from "antd";

import PublishModal from "./PublishModal";  // <-- Import de ton composant modal

import { Tag } from "antd";  // <-- j'importe Tag d'Ant Design


const { TextArea } = Input;

type Step1Props = {
  // --- Props existants
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

  imageStrategy: "ownURL" | "brodAi" | "aiGenerated";
  setImageStrategy: (val: "ownURL" | "brodAi" | "aiGenerated") => void;
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

  // --- Handlers non utilisés maintenant (remplacés par fetch)
  handleRefineContent: () => void;
  handleInsertCTAs: () => void;
  handleChangeImageCount: (val: number) => void;
  handleApplyImages: () => void;
  handleCustomAsset: () => void;
  handleInternalLink: () => void;
  handleExternalLink: () => void;
  handleClickPublish: () => void;
  handleDiscard: () => void;

  // --- Modal Publish
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
    isPublishModalOpen,
    shopifyDomain,
    setShopifyDomain,
    shopifyToken,
    setShopifyToken,
    // anciens handlers qu'on remplace
    handleRefineContent: _oldHandleRefineContent,
    handleInsertCTAs: _oldHandleInsertCTAs,
    handleChangeImageCount: _oldHandleChangeImageCount,
    handleApplyImages: _oldHandleApplyImages,
    handleCustomAsset: _oldHandleCustomAsset,
    handleInternalLink: _oldHandleInternalLink,
    handleExternalLink: _oldHandleExternalLink,
    handleClickPublish: _oldHandleClickPublish,
    handleDiscard: _oldHandleDiscard
  } = props;

  // État local pour indiquer quelle action est en cours ("refine", "cta", "images", etc.)
  // Ainsi, on peut afficher un spinner sur le bouton correspondant.
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const [publishModalOpen, setPublishModalOpen] = useState(false);


  // === States pour le Technical Audit
  const [techAuditModalOpen, setTechAuditModalOpen] = useState(false);
  const [techAuditRecommendations, setTechAuditRecommendations] = useState<any[]>([]);
  const [techAuditOriginalContent, setTechAuditOriginalContent] = useState<string>("");

  // ================================
  // APPELS AU BACKEND (fetch)
  // ================================
  const handleRefineContent = async () => {
    if (!refinePrompt) {
      message.warning("Veuillez décrire la modification souhaitée.");
      return;
    }
    try {
      setLoadingAction("refine");
      const resp = await fetch("http://localhost:8000/refineContent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          refine_instruction: refinePrompt,
        }),
      });
      if (!resp.ok) {
        throw new Error("Server error refining content");
      }
      const data = await resp.json();
      if (data.updated_content) {
        setContent(data.updated_content);
        message.success("Contenu raffiné !");
      } else {
        message.error("Erreur lors du raffinage du contenu");
      }
    } catch (e) {
      console.error(e);
      message.error("Impossible de raffiner le contenu.");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleInsertCTAs = async () => {
    try {
      setLoadingAction("cta");
      const resp = await fetch("http://localhost:8000/insertCTAs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          useBrodAiCTAs,
          wantsCTA,
          ctaCount,
          ctaValues
        }),
      });
      if (!resp.ok) {
        throw new Error("Server error on /insertCTAs");
      }
      const data = await resp.json();
      if (data.updated_content) {
        setContent(data.updated_content);
        message.success("CTA(s) inséré(s) !");
      } else {
        message.error("Erreur lors de l'insertion des CTA");
      }
    } catch (e) {
      console.error(e);
      message.error("Impossible d'insérer le(s) CTA(s).");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleApplyImages = async () => {
    try {
      setLoadingAction("images");
      // On construit un tableau simple de strings (urlOrPrompt)
      const arrOfImages = images.map((imgObj) => imgObj.urlOrPrompt);

      const resp = await fetch("http://localhost:8000/applyImages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          imageStrategy,
          imageCount,
          images: arrOfImages,
        }),
      });
      if (!resp.ok) {
        throw new Error("Server error on /applyImages");
      }
      const data = await resp.json();
      if (data.updated_content) {
        setContent(data.updated_content);
        message.success("Images insérées !");
      } else {
        message.error("Erreur lors de l'insertion des images");
      }
    } catch (e) {
      console.error(e);
      message.error("Impossible d'insérer les images.");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleCustomAsset = async () => {
    if (!customAssetPrompt) {
      message.warning("Décrivez l'asset à insérer.");
      return;
    }
    try {
      setLoadingAction("customAsset");
      const resp = await fetch("http://localhost:8000/insertCustomAsset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: customAssetPrompt }),
      });
      if (!resp.ok) {
        throw new Error("Server error on /insertCustomAsset");
      }
      const data = await resp.json();
      if (data.asset_html) {
        // On concatène au contenu
        setContent((prev) => prev + "\n" + data.asset_html);
        message.success("Asset inséré !");
      } else {
        message.error("Erreur lors de l'insertion de l'asset");
      }
    } catch (e) {
      console.error(e);
      message.error("Impossible d'insérer l'asset.");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleExternalLink = async () => {
    try {
      setLoadingAction("externalLink");
      const resp = await fetch("http://localhost:8000/externalLinkBuilding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (!resp.ok) {
        throw new Error("Server error on /externalLinkBuilding");
      }
      const data = await resp.json();
      if (data.updated_content) {
        setContent(data.updated_content);
        message.success("Liens externes insérés !");
      } else {
        message.error("Erreur lors de l'ajout des liens externes.");
      }
    } catch (e) {
      console.error(e);
      message.error("Impossible d'insérer des liens externes.");
    } finally {
      setLoadingAction(null);
    }
  };

  // Ex. handleInternalLink (si tu crées /internalLinkBuilding)
  const handleInternalLink = () => {
    message.info("Fonction en cours de développement !");
  };

  // Handler pour Publish => /publishShopify
  const handleClickPublish = async () => {
    try {
      setLoadingAction("publish");
      const resp = await fetch("http://localhost:8000/publishShopify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: shopifyToken,
          store: shopifyDomain,
          title,
          content,
          tags: [],
          published: true
        }),
      });
      if (!resp.ok) {
        throw new Error("Server error on /publishShopify");
      }
      const data = await resp.json();
      if (data.success) {
        message.success("Article publié sur Shopify !");
      } else {
        message.error("Erreur lors de la publication Shopify");
      }
    } catch (err) {
      console.error(err);
      message.error("Impossible de publier l'article.");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDiscard = () => {
    setContent("");
    setTitle("");
    message.info("Article réinitialisé.");
  };




  // Pour la démo, on laisse un style custom pour l'aperçu
  const customPreviewCss = `
    h1 { font-size: 1.8rem; margin: 1rem 0; }
    h2 { font-size: 1.4rem; margin: 0.75rem 0; }
    p, li { font-size: 1rem; margin: 0.5rem 0; }
    .cta-button { background-color: #f0c040; padding: 0.5rem; display: inline-block; margin: 0.5rem 0; }
    img { max-width: 100%; height: auto; margin: 0.5rem 0; }
    .highlightKeyword { color: #e91e63; font-weight: bold; }
  `;
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "red";
      case "medium":
        return "orange";
      case "low":
        return "green";
      default:
        return "blue"; // fallback
    }
  };

  return (
    <>
      <style>{customPreviewCss}</style>

      <div style={{ display: 'flex', minHeight: '100vh' }}>
        {/* SECTION GAUCHE */}
        <div style={{ width: '350px', borderRight: '1px solid #ccc', padding: '1rem' }}>
          {/* Un spin si l'appli globale est en loading */}
          {loading && <Spin style={{ marginBottom: '1rem' }} />}

          <h2>Let's get traffic from this query:</h2>
          <p>
            Target keyword: <span className="highlightKeyword">{keyword}</span> <br/>
            Market: <span style={{ color: '#2196f3' }}>France</span>
          </p>

          <p style={{ marginBottom: '1rem', fontSize: '0.95rem' }}>
            BrodAI analyzed data to help you rank on the first page!
          </p>

          {/* Bouton Publish => ouvre la modal / ou appelle handleClickPublish */}
          <Button
            type="primary"
            block
            style={{ marginBottom: '1rem' }}
            onClick={() => setPublishModalOpen(true)}
            disabled={loadingAction === "publish"}
          >
            {loadingAction === "publish" ? <><Spin /> Publishing...</> : "Publish"}
          </Button>

          <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
            BrodAI handles everything, but you can refine below:
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
                      Décrivez ce que vous voulez changer:
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
                      disabled={loadingAction === "refine"}
                    >
                      {loadingAction === "refine" ? <Spin /> : "Refine Content"}
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
                      value={useBrodAiCTAs ? 'brodAi' : 'manual'}
                    >
                      <Radio value="manual">Je choisis moi-même (1–5)</Radio>
                      <Radio value="brodAi">Laisser BrodAI décider</Radio>
                    </Radio.Group>

                    {wantsCTA && (
                      <div style={{ marginLeft: '1rem', marginBottom: '1rem' }}>
                        <p>Nombre de CTAs (1 à 5)</p>
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
                    <Button 
                      block 
                      onClick={handleInsertCTAs} 
                      disabled={loadingAction === "cta"}
                    >
                      {loadingAction === "cta" ? <Spin /> : "Insert CTA(s)"}
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
                      <Radio value="ownURL">Mes propres URLs</Radio>
                      <Radio value="brodAi">BrodAI picks images</Radio>
                      <Radio value="aiGenerated">Générer avec l'IA</Radio>
                    </Radio.Group>

                    {imageStrategy === 'ownURL' && (
                      <div style={{ marginLeft: '0.5rem', marginBottom: '1rem' }}>
                        <p>Combien d'images? (1 to 5)</p>
                        <Input
                          type="number"
                          min={1}
                          max={5}
                          value={imageCount}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            setImageCount(val);
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
                                arr[i] = { urlOrPrompt: ev.target.value };
                                setImages(arr);
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                    {imageStrategy === 'brodAi' && (
                      <p>(Exemple) BrodAI choisit des images (placeholder)</p>
                    )}
                    {imageStrategy === 'aiGenerated' && (
                      <p>Indiquer le(s) prompt(s) de génération d'image, si besoin</p>
                    )}

                    <Button 
                      block 
                      onClick={handleApplyImages} 
                      disabled={loadingAction === "images"}
                    >
                      {loadingAction === "images" ? <Spin /> : "Insert Images"}
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
                      Insérer un simulateur, un quiz...
                    </p>
                    <TextArea
                      rows={2}
                      placeholder="e.g. 'Insérer un simulateur de prix e-commerce'"
                      value={customAssetPrompt}
                      onChange={(e) => setCustomAssetPrompt(e.target.value)}
                    />
                    <Button 
                      block 
                      style={{ marginTop: '0.5rem' }} 
                      onClick={handleCustomAsset}
                      disabled={loadingAction === "customAsset"}
                    >
                      {loadingAction === "customAsset" ? <Spin /> : "Insert Custom Asset"}
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
                    <Button 
                      block 
                      onClick={handleExternalLink}
                      disabled={loadingAction === "externalLink"}
                    >
                      {loadingAction === "externalLink" ? <Spin /> : "External Link Building"}
                    </Button>
                  </>
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

      {/* Modal Publish => si tu veux un modal "officiel", 
          ici on l'a laissé vide pour l'exemple. */}
      <PublishModal
        isOpen={publishModalOpen}               // on utilise notre state local
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
