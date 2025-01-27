'use client';

import React, { useState } from 'react';
import { Modal, Input, message, notification } from 'antd';

type PublishModalProps = {
  isOpen: boolean;
  onClose: () => void;
  shopifyDomain: string;
  setShopifyDomain: (val: string) => void;
  shopifyToken: string;
  setShopifyToken: (val: string) => void;
  title: string;
  content: string;
};

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
    console.log('=== [PublishModal] handlePublish called ===');

    try {
      setLoading(true);

      // Logs avant d'envoyer la requête
      console.log('--- Debug Info (front) ---');
      console.log('Shopify Domain:', shopifyDomain);
      console.log('Shopify Token:', shopifyToken);
      console.log('Article Title:', title);
      console.log('Article Content (first 100 chars):', content.slice(0, 100) + '...');
      console.log('--------------------------');

      // On vérifie juste si le domaine ou token sont vides
      if (!shopifyDomain || !shopifyToken) {
        message.warning('Please provide a valid Shopify domain and token!');
        setLoading(false);
        return;
      }

      // Envoi de la requête au backend Python
      console.log('[PublishModal] Sending request to /publishShopify...');
      const res = await fetch('http://localhost:8000/publishShopify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: shopifyToken,
          store: shopifyDomain,
          blogId: 'gid://shopify/Blog/114693013829',
          title,
          content,
          tags: [],
          published: true
        }),
      });
      console.log('[PublishModal] Response status:', res.status);

      if (!res.ok) {
        // On tente de lire le JSON d'erreur
        let errMsg = 'Unknown error';
        try {
          const errData = await res.json();
          errMsg = errData.error || 'Unknown server error';
          console.error('[PublishModal] Server error data:', errData);
        } catch (jsonErr) {
          console.error('[PublishModal] Could not parse error JSON:', jsonErr);
        }
        throw new Error(errMsg);
      }

      // Lecture du JSON de succès
      const data = await res.json();
      console.log('[PublishModal] Response JSON:', data);

      if (data.success) {
        message.success(`Article published! ID: ${data.article?.id || 'unknown'}`);
        notification.info({
          message: 'Article Published',
          description: 'Check your Shopify admin to see the new article.',
        });
        console.log('[PublishModal] Article publication success!');
        // Ferme la modale
        onClose();
      } else {
        // data.success = false => on affiche l’erreur
        const errMsg = JSON.stringify(data.error || 'unknown error');
        message.error(`Shopify error: ${errMsg}`);
      }

    } catch (err: any) {
      console.error('[PublishModal] Catch error:', err);
      message.error(err.message);
    } finally {
      setLoading(false);
      console.log('[PublishModal] handlePublish finished!');
    }
  };

  const handleCancel = () => {
    console.log('[PublishModal] handleCancel => closing modal');
    onClose();
  };

  return (
    <Modal
      title="Publish to Shopify"
      open={isOpen}
      onOk={handlePublish}
      onCancel={handleCancel}
      okText={loading ? 'Publishing...' : 'Publish'}
      confirmLoading={loading}
    >
      <p>Enter your Shopify domain and access token to publish the article:</p>
      <Input
        style={{ marginBottom: '0.5rem' }}
        placeholder="myshop.myshopify.com"
        value={shopifyDomain}
        onChange={(e) => setShopifyDomain(e.target.value)}
      />
      <Input
        style={{ marginBottom: '0.5rem' }}
        placeholder="Shopify Access Token"
        value={shopifyToken}
        onChange={(e) => setShopifyToken(e.target.value)}
      />
    </Modal>
  );
}
