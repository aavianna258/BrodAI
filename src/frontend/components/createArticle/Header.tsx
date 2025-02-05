'use client';

import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

interface HeaderProps {
  keyword: string;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (val: boolean) => void;
}

export default function Header({ keyword, sidebarCollapsed, setSidebarCollapsed }: HeaderProps) {
  const handleToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: '#2c3e50', // same dark blue
        padding: '0.5rem 0',
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <IconButton
          edge="start"
          color="inherit"
          sx={{ position: 'absolute', left: 8 }}
          onClick={handleToggle}
        >
          {sidebarCollapsed ? <MenuIcon /> : <ChevronLeftIcon />}
        </IconButton>

        {/* Centered text */}
        <div style={{ textAlign: 'center' }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            Let&apos;s get traffic from this query
          </Typography>
          <Typography variant="body1">
            Target keyword:&nbsp;
            <span style={{ color: '#e91e63', fontWeight: 'bold' }}>{keyword}</span>
            &nbsp;|&nbsp;Market:&nbsp;
            <span style={{ color: '#ffeb3b' }}>France</span>
          </Typography>
        </div>
      </Toolbar>
    </AppBar>
  );
}
