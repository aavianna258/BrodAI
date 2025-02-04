'use client';

import React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

interface TitleEditorProps {
  title: string;
  editTitleMode: boolean;
  setEditTitleMode: (val: boolean) => void;
  setTitle: (val: string) => void;
}

export default function TitleEditor({
  title,
  editTitleMode,
  setEditTitleMode,
  setTitle,
}: TitleEditorProps) {
  if (!editTitleMode) {
    return (
      <>
        <h2 style={{ margin: 0 }}>{title}</h2>
        <Button
          variant="outlined"
          size="small"
          onClick={() => setEditTitleMode(true)}
        >
          Edit Title
        </Button>
      </>
    );
  }

  return (
    <>
      <TextField
        fullWidth
        style={{ fontSize: '1.1rem', fontWeight: 600 }}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Button variant="contained" size="small" onClick={() => setEditTitleMode(false)}>
        Done
      </Button>
    </>
  );
}
