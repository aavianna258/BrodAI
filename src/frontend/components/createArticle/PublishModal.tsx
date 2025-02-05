'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  TextField,
  Button,
  CircularProgress,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
} from '@mui/material';

import { publishToShopify, publishToWordPress } from '../../components/backendService';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  shopifyDomain: string;
  setShopifyDomain: (val: string) => void;
  shopifyToken: string;
  setShopifyToken: (val: string) => void;
  title: string;
  content: string;
}

export default function PublishModal({
  isOpen,
  onClose,
  shopifyDomain,
  setShopifyDomain,
  shopifyToken,
  setShopifyToken,
  title,
  content,
}: PublishModalProps) {
  const [loading, setLoading] = useState(false);

  // Radio toggle: 'shopify' or 'wordpress'
  const [publishMethod, setPublishMethod] = useState<'shopify' | 'wordpress'>('shopify');

  // WordPress credentials (only relevant if user selects WordPress)
  const [wpDomain, setWpDomain] = useState('');
  const [wpUser, setWpUser] = useState('');
  const [wpPassword, setWpPassword] = useState('');

  const handlePublish = async () => {
    setLoading(true);
    try {
      if (publishMethod === 'shopify') {
        const data = await publishToShopify(shopifyDomain, shopifyToken, title, content);
        if (data.success) {
          alert('Article published successfully to Shopify!');
          onClose();
        } else {
          alert('Shopify error: ' + JSON.stringify(data.error || 'unknown error'));
        }
      } else {
        // WordPress
        const data = await publishToWordPress(wpDomain, wpUser, wpPassword, title, content); // image to implement
        if (data.success) {
          alert('Article published successfully to WordPress!');
          onClose();
        } else {
          alert('WordPress error: ' + JSON.stringify(data.error || 'unknown error'));
        }
      }
    } catch (err: any) {
      alert(err.message || 'Unknown error while publishing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Publish Article</DialogTitle>
      <DialogContent>
        {/* Publish method radio buttons */}
        <FormLabel component="legend" sx={{ marginTop: 1 }}>
          Publish to:
        </FormLabel>
        <RadioGroup
          row
          value={publishMethod}
          onChange={(e) => setPublishMethod(e.target.value as 'shopify' | 'wordpress')}
        >
          <FormControlLabel value="shopify" control={<Radio />} label="Shopify" />
          <FormControlLabel value="wordpress" control={<Radio />} label="WordPress" />
        </RadioGroup>

        {/* Conditionally show Shopify or WordPress fields */}
        {publishMethod === 'shopify' ? (
          <>
            <p>Enter your Shopify domain and access token to publish the article:</p>
            <TextField
              label="Shopify Domain"
              variant="outlined"
              fullWidth
              margin="normal"
              placeholder="myshop.myshopify.com"
              value={shopifyDomain}
              onChange={(e) => setShopifyDomain(e.target.value)}
            />
            <TextField
              label="Shopify Access Token"
              variant="outlined"
              fullWidth
              margin="normal"
              placeholder="Shopify Access Token"
              value={shopifyToken}
              onChange={(e) => setShopifyToken(e.target.value)}
            />
          </>
        ) : (
          <>
            <p>Enter your WordPress credentials to publish the article:</p>
            <TextField
              label="WordPress URL"
              variant="outlined"
              fullWidth
              margin="normal"
              placeholder="https://example.com"
              value={wpDomain}
              onChange={(e) => setWpDomain(e.target.value)}
            />
            <TextField
              label="WordPress Username"
              variant="outlined"
              fullWidth
              margin="normal"
              placeholder="admin"
              value={wpUser}
              onChange={(e) => setWpUser(e.target.value)}
            />
            <TextField
              label="WordPress Password"
              variant="outlined"
              fullWidth
              margin="normal"
              type="password"
              value={wpPassword}
              onChange={(e) => setWpPassword(e.target.value)}
            />
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handlePublish} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Publish'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
