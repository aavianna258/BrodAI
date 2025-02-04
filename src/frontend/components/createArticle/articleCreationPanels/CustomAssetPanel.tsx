'use client';

import React from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';

interface CustomAssetPanelProps {
  customAssetPrompt: string;
  setCustomAssetPrompt: (val: string) => void;
  onInsertAsset: () => void;
  loadingAction: string | null;
}

export default function CustomAssetPanel({
  customAssetPrompt,
  setCustomAssetPrompt,
  onInsertAsset,
  loadingAction,
}: CustomAssetPanelProps) {
  return (
    <div>
      <p style={{ fontSize: '0.9rem' }}>
        Describe the asset you want to insert:
      </p>
      <TextField
        multiline
        rows={2}
        fullWidth
        placeholder="e.g. 'Insert a price simulator for e-commerce'"
        value={customAssetPrompt}
        onChange={(e) => setCustomAssetPrompt(e.target.value)}
      />
      <Button
        variant="contained"
        fullWidth
        style={{ marginTop: '0.5rem' }}
        onClick={onInsertAsset}
        disabled={loadingAction === 'customAsset'}
      >
        {loadingAction === 'customAsset' ? <CircularProgress size={24} /> : 'Insert Custom Asset'}
      </Button>
    </div>
  );
}
