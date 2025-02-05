"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import Box from "@mui/material/Box";

import Header from "../../components/createArticle/Header";
import Sidebar from "../../components/createArticle/Sidebar";
import ArticleEditor from "../../components/createArticle/ArticleEditor";
import PublishModal from "../../components/createArticle/PublishModal";

import {
    fetchArticleByKeyword,
    refineContent,
    insertSingleImage,
    insertCTAs,
    applyImages,
    insertCustomAsset,
    addExternalLinks,
} from "../../components/backendService";
import EditableHTMLField from "@/components/createArticle/EditableHTMLField";
import { CircularProgress } from "@mui/material";

export default function CreateArticlePage() {
    const searchParams = useSearchParams();

    // Track whether the sidebar is collapsed or not
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    // Loading states
    const [loading, setLoading] = useState(false);
    const [loadingAction, setLoadingAction] = useState<string | null>(null);

    // Article data
    const [keyword, setKeyword] = useState("");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    // Title editing
    const [editTitleMode, setEditTitleMode] = useState(false);

    // Editor vs. Preview
    const [showEditor, setShowEditor] = useState(false);

    // CTA
    const [useBrodAiCTAs, setUseBrodAiCTAs] = useState(false);
    const [wantsCTA, setWantsCTA] = useState(false);
    const [ctaCount, setCtaCount] = useState(1);
    const [ctaValues, setCtaValues] = useState<string[]>([]);

    // Images
    const [imageStrategy, setImageStrategy] = useState("ownURL");
    const [imageCount, setImageCount] = useState(1);
    const [images, setImages] = useState<{ urlOrPrompt: string }[]>([]); // not used

    // Custom Asset
    const [customAssetPrompt, setCustomAssetPrompt] = useState("");

    // Refine
    const [refinePrompt, setRefinePrompt] = useState("");

    // Link building
    const [siteUrl, setSiteUrl] = useState("");

    // Collapsible panels
    const [collapseActiveKeys, setCollapseActiveKeys] = useState<string[]>([]);

    // Publish modal
    const [isPublishModalOpen, setPublishModalOpen] = useState(false);
    const [shopifyDomain, setShopifyDomain] = useState("");
    const [shopifyToken, setShopifyToken] = useState("");

    // Fetch article on mount if keyword is present
    useEffect(() => {
        const kw = searchParams.get("keyword");
        if (kw) {
            setKeyword(kw);
            doFetchArticle(kw);
        }
    }, [searchParams]);

    const doFetchArticle = async (kw: string) => {
        setLoading(true);
        try {
            const data = await fetchArticleByKeyword(kw);
            setTitle(data.title || "Untitled Article");
            const raw = data.content || "";
            const match = raw.match(/<div[\s\S]*?<\/div>/i);
            setContent(match ? match[0] : raw);
        } catch (err: any) {
            alert(err.message || "Could not generate article");
        } finally {
            setLoading(false);
        }
    };

    // Handlers
    const handleRefineContent = async () => {
        if (!refinePrompt) {
            alert("Please provide a refine instruction.");
            return;
        }
        setLoadingAction("refine");
        try {
            const data = await refineContent(content, refinePrompt);
            if (data.updated_content) {
                setContent(data.updated_content);
            } else {
                alert("Error refining content");
            }
        } catch (err: any) {
            alert(err.message);
        } finally {
            setLoadingAction(null);
        }
    };

    const handleInsertImage = async () => {
        setLoadingAction("image");
        try {
            const data = await insertSingleImage(content);
            if (data.updated_content) {
                setContent(data.updated_content);
            } else {
                alert("Error inserting image");
            }
        } catch (err: any) {
            alert(err.message);
        } finally {
            setLoadingAction(null);
        }
    };

    const handleInsertCTAs = async () => {
        setLoadingAction("cta");
        try {
            const data = await insertCTAs(
                content,
                useBrodAiCTAs,
                wantsCTA,
                ctaCount,
                ctaValues
            );
            if (data.updated_content) {
                setContent(data.updated_content);
            } else {
                alert("Error inserting CTAs");
            }
        } catch (err: any) {
            alert(err.message);
        } finally {
            setLoadingAction(null);
        }
    };

    const handleApplyImages = async () => {
        setLoadingAction("images");
        try {
            const data = await applyImages(content, imageStrategy, imageCount);
            if (data.updated_content) {
                setContent(data.updated_content);
            } else {
                alert("Error applying images");
            }
        } catch (err: any) {
            alert(err.message);
        } finally {
            setLoadingAction(null);
        }
    };

    const handleCustomAsset = async () => {
        if (!customAssetPrompt) {
            alert("Describe the asset you want to insert.");
            return;
        }
        setLoadingAction("customAsset");
        try {
            const data = await insertCustomAsset(content, customAssetPrompt);
            if (data.asset_html) {
                setContent(content + data.asset_html);
            } else {
                alert("Error inserting asset");
            }
        } catch (err: any) {
            alert(err.message);
        } finally {
            setLoadingAction(null);
        }
    };

    const handleExternalLink = async () => {
        setLoadingAction("externalLink");
        try {
            const data = await addExternalLinks(content);
            if (data.updated_content) {
                setContent(data.updated_content);
            } else {
                alert("Error adding external links");
            }
        } catch (err: any) {
            alert(err.message);
        } finally {
            setLoadingAction(null);
        }
    };

    const handleDiscard = () => {
        setContent("");
        setTitle("");
        alert("Article was reset to empty content");
    };

    // For styling the article preview
    const customPreviewCss = `
    h1 { font-size: 1.8rem; margin: 1rem 0; }
    h2 { font-size: 1.4rem; margin: 0.75rem 0; }
    p, li { font-size: 1rem; margin: 0.5rem 0; }
    .cta-button { background-color: #f0c040; padding: 0.5rem; display: inline-block; margin: 0.5rem 0; }
    img { max-width: 100%; height: auto; margin: 0.5rem 0; }
    .highlightKeyword { color: #e91e63; font-weight: bold; }
  `;

    return (
        <>
            <style>{customPreviewCss}</style>

            {/* Header at the top */}
            <Header
                keyword={keyword}
                sidebarCollapsed={sidebarCollapsed}
                setSidebarCollapsed={setSidebarCollapsed}
            />

            {/* Now place the sidebar + editor in a row below the header */}
            <Box
                component="main"
                display="flex"
                flexDirection="row"
                sx={{ minHeight: "calc(100vh - 64px)" }}
                // Adjust if your header is more/less than 64px
            >
                {/* SIDEBAR */}
                <Sidebar
                    sidebarCollapsed={sidebarCollapsed}
                    setSidebarCollapsed={setSidebarCollapsed}
                    loadingAction={loadingAction}
                    setPublishModalOpen={setPublishModalOpen}
                    refinePrompt={refinePrompt}
                    setRefinePrompt={setRefinePrompt}
                    handleRefineContent={handleRefineContent}
                    useBrodAiCTAs={useBrodAiCTAs}
                    setUseBrodAiCTAs={setUseBrodAiCTAs}
                    wantsCTA={wantsCTA}
                    setWantsCTA={setWantsCTA}
                    ctaCount={ctaCount}
                    setCtaCount={setCtaCount}
                    ctaValues={ctaValues}
                    setCtaValues={setCtaValues}
                    handleInsertCTAs={handleInsertCTAs}
                    imageStrategy={imageStrategy}
                    setImageStrategy={setImageStrategy}
                    handleInsertImage={handleInsertImage}
                    customAssetPrompt={customAssetPrompt}
                    setCustomAssetPrompt={setCustomAssetPrompt}
                    handleCustomAsset={handleCustomAsset}
                    handleExternalLink={handleExternalLink}
                    handleInternalLink={() =>
                        alert("Internal link building not implemented!")
                    }
                    collapseActiveKeys={collapseActiveKeys}
                    setCollapseActiveKeys={setCollapseActiveKeys}
                />

                {/* MAIN ARTICLE AREA (Example usage) */}
                <Box style={{ flex: 1, padding: "1rem" }}>
                    <EditableHTMLField
                        initialHTML={content}
                        loading={loading}
                        onChangeHTML={(val) => setContent(val)}
                    />
                </Box>
            </Box>

            {/* Publish Modal */}
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
