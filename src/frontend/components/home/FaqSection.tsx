// components/home/FaqSection.tsx
'use client';

import React from 'react';
import { Typography, Card, Collapse } from 'antd';

const { Title, Paragraph } = Typography;
const { Panel } = Collapse;

export default function FaqSection() {
  return (
    <div
      id="faq"
      style={{
        /* 
          "80px auto" means 80px margin-top, 80px margin-bottom, 
          and auto for left/right (which centers it horizontally).
        */
        margin: '80px auto',
        maxWidth: 800,
        /* If you want the entire FAQ text left-aligned, keep 'left';
           if you want the entire section center-aligned, use 'center'. */
        textAlign: 'left', 
      }}
    >
      {/* Center the FAQ title itself: */}
      <Title level={2} style={{ marginBottom: 16, textAlign: 'center' }}>
        Frequently Asked Questions
      </Title>

      <Card
        style={{ borderRadius: 8 }}
        /* Use styles.body instead of bodyStyle for AntD v5 */
        styles={{
          body: {
            padding: 24,
          },
        }}
      >
        <Collapse accordion>
          <Panel 
            header="How is BrodAI different from other AI generators that use GPT?" 
            key="1"
          >
            <Paragraph>
              BrodAI’s blog engine collaborates with each client, ensuring the 
              content is genuinely informational — not shallow AI text. We can 
              produce thousands of words on each subject, breaking it down thoroughly. 
              That’s how we stand out from typical GPT tools that generate low‐quality 
              content.
            </Paragraph>
          </Panel>

          <Panel header="Does Google penalize AI-generated content?" key="2">
            <Paragraph>
              Google does not penalize content just because it’s AI‐generated. It 
              focuses on low‐quality or spammy articles. At BrodAI, we partner 
              with you to ensure your content is thorough and meets Google’s 
              quality standards, even for complex subjects.
            </Paragraph>
          </Panel>

          <Panel header="How do I get BrodAI running on my website?" key="3">
            <Paragraph>
              BrodAI can connect via API to popular CMS platforms like WordPress 
              and Shopify. For other hosts, please contact us — we can tailor a 
              solution to integrate with your site, whether self‐hosted or via 
              a hosting service.
            </Paragraph>
          </Panel>
        </Collapse>
      </Card>
    </div>
  );
}
