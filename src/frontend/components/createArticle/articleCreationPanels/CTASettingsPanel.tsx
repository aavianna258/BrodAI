'use client';

import React from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

interface CTASettingsPanelProps {
  useBrodAiCTAs: boolean;
  setUseBrodAiCTAs: (val: boolean) => void;
  wantsCTA: boolean;
  setWantsCTA: (val: boolean) => void;
  ctaCount: number;
  setCtaCount: (val: number) => void;
  ctaValues: string[];
  setCtaValues: (val: string[]) => void;
  onInsertCTAs: () => void;
  loadingAction: string | null;
}

export default function CTASettingsPanel({
  useBrodAiCTAs,
  setUseBrodAiCTAs,
  wantsCTA,
  setWantsCTA,
  ctaCount,
  setCtaCount,
  ctaValues,
  setCtaValues,
  onInsertCTAs,
  loadingAction,
}: CTASettingsPanelProps) {
  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === 'brodAi') {
      setUseBrodAiCTAs(true);
      setWantsCTA(false);
    } else {
      setUseBrodAiCTAs(false);
      setWantsCTA(true);
    }
  };

  return (
    <div>
      <RadioGroup
        row
        value={useBrodAiCTAs ? 'brodAi' : 'manual'}
        onChange={handleRadioChange}
      >
        <FormControlLabel
          value="manual"
          control={<Radio />}
          label="I choose my own CTAs"
        />
        <FormControlLabel
          value="brodAi"
          control={<Radio />}
          label="Let BrodAI decide"
        />
      </RadioGroup>

      {wantsCTA && (
        <div style={{ marginLeft: '1rem', marginBottom: '1rem' }}>
          <p>Number of CTAs (1 to 5)</p>
          <TextField
            type="number"
            inputProps={{ min: 1, max: 5 }}
            value={ctaCount}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              setCtaCount(val);
              const newArr = [...ctaValues];
              if (val < newArr.length) {
                newArr.splice(val);
              } else {
                while (newArr.length < val) {
                  newArr.push('Buy Now');
                }
              }
              setCtaValues(newArr);
            }}
          />
          {Array.from({ length: ctaCount }).map((_, i) => (
            <div key={i} style={{ marginTop: '0.5rem' }}>
              <p><strong>CTA #{i + 1}</strong></p>
              <Select
                fullWidth
                value={ctaValues[i] || ''}
                onChange={(e) => {
                  const arr = [...ctaValues];
                  arr[i] = e.target.value;
                  setCtaValues(arr);
                }}
              >
                <MenuItem value="Buy Now">Buy Now</MenuItem>
                <MenuItem value="Add to cart">Add to cart</MenuItem>
                <MenuItem value="Contact sales">Contact sales</MenuItem>
                <MenuItem value="Contact us">Contact us</MenuItem>
              </Select>
            </div>
          ))}
        </div>
      )}
      <Button
        variant="contained"
        fullWidth
        onClick={onInsertCTAs}
        disabled={loadingAction === 'cta'}
      >
        {loadingAction === 'cta' ? <CircularProgress size={24} /> : 'Insert CTA(s)'}
      </Button>
    </div>
  );
}
