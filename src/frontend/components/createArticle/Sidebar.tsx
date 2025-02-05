'use client';

import React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMore from '@mui/icons-material/ExpandMore';

// Icons for each panel
import BuildIcon from '@mui/icons-material/Build';           // refine
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'; // CTA
import ImageIcon from '@mui/icons-material/Image';           // images
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';   // assets
import LanguageIcon from '@mui/icons-material/Language';     // link building

// Panels
import RefinePanel from '../../components/createArticle/articleCreationPanels/RefinePanel';
import CTASettingsPanel from '../../components/createArticle/articleCreationPanels/CTASettingsPanel';
import ImagesSettingsPanel from '../../components/createArticle/articleCreationPanels/ImagesSettingsPanel';
import CustomAssetPanel from '../../components/createArticle/articleCreationPanels/CustomAssetPanel';
import LinkBuildingPanel from '../../components/createArticle/articleCreationPanels/LinkBuildingPanel';

interface SidebarProps {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (val: boolean) => void;

  loadingAction: string | null;
  setPublishModalOpen: (open: boolean) => void;

  refinePrompt: string;
  setRefinePrompt: (val: string) => void;
  handleRefineContent: () => void;

  useBrodAiCTAs: boolean;
  setUseBrodAiCTAs: (val: boolean) => void;
  wantsCTA: boolean;
  setWantsCTA: (val: boolean) => void;
  ctaCount: number;
  setCtaCount: (val: number) => void;
  ctaValues: string[];
  setCtaValues: (vals: string[]) => void;
  handleInsertCTAs: () => void;

  imageStrategy: string;
  setImageStrategy: (val: string) => void;
  handleInsertImage: () => void;

  customAssetPrompt: string;
  setCustomAssetPrompt: (val: string) => void;
  handleCustomAsset: () => void;

  handleExternalLink: () => void;
  handleInternalLink: () => void;

  collapseActiveKeys: string[];
  setCollapseActiveKeys: (keys: string[]) => void;
}

const SIDEBAR_WIDTH_EXPANDED = 300;
const SIDEBAR_WIDTH_COLLAPSED = 60;

const SidebarContainer = styled(Box)<{ sidebarCollapsed: boolean }>(
  ({ sidebarCollapsed }) => ({
    width: sidebarCollapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED,
    transition: 'width 0.3s ease',
    overflowX: 'hidden',
    backgroundColor: '#2c3e50',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    borderRight: '1px solid #222',
  })
);

const StyledAccordion = styled(Accordion)({
  backgroundColor: '#34495e',
  color: '#fff',
  marginBottom: '0.5rem',
});

export default function Sidebar(props: SidebarProps) {
  const {
    sidebarCollapsed,
    loadingAction,
    setPublishModalOpen,
    refinePrompt,
    setRefinePrompt,
    handleRefineContent,
    useBrodAiCTAs,
    setUseBrodAiCTAs,
    wantsCTA,
    setWantsCTA,
    ctaCount,
    setCtaCount,
    ctaValues,
    setCtaValues,
    handleInsertCTAs,
    imageStrategy,
    setImageStrategy,
    handleInsertImage,
    customAssetPrompt,
    setCustomAssetPrompt,
    handleCustomAsset,
    handleExternalLink,
    handleInternalLink,
    collapseActiveKeys,
    setCollapseActiveKeys,
  } = props;

  // Helper to render each panel
  const renderAccordion = (
    panelKey: string,
    label: string,
    IconCmp: React.ReactNode,
    child: React.ReactNode
  ) => (
    <StyledAccordion
      expanded={!sidebarCollapsed && collapseActiveKeys.includes(panelKey)}
      onChange={() => {
        if (collapseActiveKeys.includes(panelKey)) {
          setCollapseActiveKeys(collapseActiveKeys.filter((k) => k !== panelKey));
        } else {
          setCollapseActiveKeys([...collapseActiveKeys, panelKey]);
        }
      }}
    >
      <AccordionSummary expandIcon={!sidebarCollapsed ? <ExpandMore sx={{ color: '#fff' }} /> : null}>
        {/* If sidebar is collapsed, hide the label text. Possibly show only the icon. */}
        {sidebarCollapsed ? (
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            {IconCmp}
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {IconCmp}
            <span>{label}</span>
          </div>
        )}
      </AccordionSummary>
      {!sidebarCollapsed && <AccordionDetails>{child}</AccordionDetails>}
    </StyledAccordion>
  );

  return (
    <SidebarContainer sidebarCollapsed={sidebarCollapsed}>
      {/* The Panels */}
      <Box sx={{ padding: sidebarCollapsed ? '0.5rem' : '1rem', flex: 1 }}>
        {renderAccordion(
          'refine',
          'Refine Article',
          <BuildIcon sx={{ color: '#fff' }} />,
          <RefinePanel
            refinePrompt={refinePrompt}
            setRefinePrompt={setRefinePrompt}
            loadingAction={loadingAction}
            onRefine={handleRefineContent}
          />
        )}
        {renderAccordion(
          'cta',
          'CTA Insertion',
          <RocketLaunchIcon sx={{ color: '#fff' }} />,
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
        {renderAccordion(
          'images',
          'Images',
          <ImageIcon sx={{ color: '#fff' }} />,
          <ImagesSettingsPanel
            imageStrategy={imageStrategy}
            setImageStrategy={setImageStrategy}
            onInsertImage={handleInsertImage}
            loadingAction={loadingAction}
          />
        )}
        {renderAccordion(
          'assets',
          'Interactive Assets',
          <AutoAwesomeIcon sx={{ color: '#fff' }} />,
          <CustomAssetPanel
            customAssetPrompt={customAssetPrompt}
            setCustomAssetPrompt={setCustomAssetPrompt}
            onInsertAsset={handleCustomAsset}
            loadingAction={loadingAction}
          />
        )}
        {renderAccordion(
          'linkbuild',
          'Link Building',
          <LanguageIcon sx={{ color: '#fff' }} />,
          <LinkBuildingPanel
            onInsertExternalLinks={handleExternalLink}
            onInsertInternalLinks={handleInternalLink}
            loadingAction={loadingAction}
          />
        )}
      </Box>

      {/* Publish button just under the panels */}
      <Box sx={{ padding: sidebarCollapsed ? '0 0.5rem 1rem' : '0 1rem 1rem' }}>
        {loadingAction === 'publish' ? (
          <Button
            variant="contained"
            fullWidth
            disabled
            startIcon={<CircularProgress size={20} />}
          >
            Publishing...
          </Button>
        ) : (
          <Button variant="contained" fullWidth onClick={() => setPublishModalOpen(true)}>
            Publish
          </Button>
        )}
      </Box>
    </SidebarContainer>
  );
}
