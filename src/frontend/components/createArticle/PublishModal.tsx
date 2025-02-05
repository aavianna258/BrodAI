'use client';

import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

import { publishToShopify } from '../../components/backendService';

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

  const handlePublish = async () => {
    try {
      setLoading(true);
      const data = await publishToShopify(shopifyDomain, shopifyToken, title, content);
      if (data.success) {
        alert('Article published successfully!');
        onClose();
      } else {
        alert('Shopify error: ' + JSON.stringify(data.error || 'unknown error'));
      }
    } catch (err: any) {
      alert(err.message || 'Unknown error while publishing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Publish to Shopify</DialogTitle>
      <DialogContent>
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button variant="contained" onClick={handlePublish} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Publish'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
