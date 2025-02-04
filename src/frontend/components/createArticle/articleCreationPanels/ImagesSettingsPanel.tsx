'use client';

import React from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

interface ImagesSettingsPanelProps {
  imageStrategy: string;
  setImageStrategy: (val: string) => void;
  onInsertImage: () => void;
  loadingAction: string | null;
}

export default function ImagesSettingsPanel({
  imageStrategy,
  setImageStrategy,
  onInsertImage,
  loadingAction,
}: ImagesSettingsPanelProps) {
  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageStrategy(e.target.value);
  };

  return (
    <div>
      <RadioGroup value={imageStrategy} onChange={handleRadioChange}>
        <FormControlLabel
          value="ownURL"
          control={<Radio />}
          label="Use my own URLs (disabled in demo)"
          disabled
        />
        <FormControlLabel
          value="aiGenerated"
          control={<Radio />}
          label="Generate with AI"
        />
      </RadioGroup>

      <Button
        variant="contained"
        fullWidth
        onClick={onInsertImage}
        disabled={loadingAction === 'image'}
      >
        {loadingAction === 'image' ? <CircularProgress size={24} /> : 'Insert Images'}
      </Button>
    </div>
  );
}
