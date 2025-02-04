'use client';

import React from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

interface LinkBuildingPanelProps {
  onInsertExternalLinks: () => void;
  onInsertInternalLinks: () => void;
  loadingAction: string | null;
}

export default function LinkBuildingPanel({
  onInsertExternalLinks,
  onInsertInternalLinks,
  loadingAction,
}: LinkBuildingPanelProps) {
  return (
    <div>
      <Button
        variant="contained"
        fullWidth
        style={{ marginBottom: '0.5rem' }}
        onClick={onInsertInternalLinks}
        disabled
      >
        Internal Link Building (soon)
      </Button>
      <Button
        variant="contained"
        fullWidth
        onClick={onInsertExternalLinks}
        disabled={loadingAction === 'externalLink'}
      >
        {loadingAction === 'externalLink' ? <CircularProgress size={24} /> : 'External Link Building'}
      </Button>
    </div>
  );
}
