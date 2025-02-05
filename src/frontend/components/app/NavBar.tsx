'use client';

import React from 'react';
import { Box, Container, Grid, Typography, IconButton } from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import GitHubIcon from '@mui/icons-material/GitHub';

export default function AppFooter() {
  const accentColor = '#3B82F6';

  return (
    <Box component="footer" sx={{ bgcolor: '#f9f9f9', py: 5 }}>
      <Container>
        <Grid container spacing={4} justifyContent="center" alignItems="flex-start">
          {/* Brand / Mission Column */}
          <Grid item xs={12} sm={6} md={3}>
            <Box display="flex" alignItems="center" mb={2}>
              {/* Circle as brand logo placeholder */}
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor: accentColor,
                  mr: 1,
                }}
              />
              <Typography variant="h6" component="div" sx={{ m: 0 }}>
                BrodAI
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" display="block">
              Starting with SEO to get you more visitors from Google
            </Typography>
            <Typography variant="body2" color="text.secondary" display="block" mt={1}>
              © 2024 - All rights reserved
            </Typography>

            {/* Social icons */}
            <Box mt={2} display="flex" gap={2}>
              <IconButton aria-label="LinkedIn" sx={{ color: '#555' }}>
                <LinkedInIcon />
              </IconButton>
              <IconButton aria-label="Twitter" sx={{ color: '#555' }}>
                <TwitterIcon />
              </IconButton>
              <IconButton aria-label="GitHub" sx={{ color: '#555' }}>
                <GitHubIcon />
              </IconButton>
            </Box>
          </Grid>

          {/* Contact Column */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              CONTACT
            </Typography>
            <Typography variant="body2" color="text.secondary" display="block">
              Email: admin@brodai.ai
            </Typography>
          </Grid>

          {/* Legal Column */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              LEGAL
            </Typography>
            <Typography variant="body2" color="text.secondary" display="block" mb={1}>
              Terms of Service
            </Typography>
            <Typography variant="body2" color="text.secondary" display="block">
              Privacy Policy
            </Typography>
          </Grid>

          {/* Blog Column */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              BLOG
            </Typography>
            <Typography variant="body2" color="text.secondary" display="block">
              <a href="/blog" style={{ color: 'inherit', textDecoration: 'none' }}>
                All Posts
              </a>
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
