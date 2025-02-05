'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Backdrop,
  CircularProgress,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';

interface EditableHTMLFieldProps {
  /** The initial HTML string to display or edit. */
  initialHTML: string;
  /**
   * If true, show a centered CircularProgress instead of the hover/edit UI.
   */
  loading?: boolean;
  /**
   * Callback fired when user finishes editing.
   * The updated HTML string is passed as `updated`.
   */
  onChangeHTML?: (updated: string) => void;
}

const HoverContainer = styled(Box)({
  position: 'relative',
  overflow: 'hidden',
  border: '1px solid #ccc',
  borderRadius: 4,
});

/**
 * EditableHTMLField:
 * - Renders HTML in a Typography by default.
 * - On hover, shows a Backdrop & pen icon (top-right).
 * - Clicking the pen toggles a TextField to edit HTML.
 * - If `loading === true`, shows a centered spinner instead.
 */
export default function EditableHTMLField({
  initialHTML,
  loading = false,
  onChangeHTML,
}: EditableHTMLFieldProps) {
  const [value, setValue] = useState(initialHTML);
  const [isEditing, setIsEditing] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // Called when TextField loses focus (or use a "Done" button if desired).
  const handleDoneEditing = () => {
    setIsEditing(false);
    if (onChangeHTML) {
      onChangeHTML(value);
    }
  };

  if (loading) {
    return (
      <HoverContainer
        sx={{
          p: 2,
          minHeight: 120,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </HoverContainer>
    );
  }

  return (
    <HoverContainer
      sx={{ p: 2 }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Backdrop + pen icon appear only if NOT editing */}
      {!isEditing && (
        <>
          <Backdrop
            open={isHovering}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: (theme) => theme.zIndex.drawer + 1,
              backgroundColor: alpha('#000', 0.2),
            }}
          />
          {isHovering && (
            <IconButton
              size="small"
              onClick={() => setIsEditing(true)}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                color: '#fff',
                zIndex: (theme) => theme.zIndex.drawer + 2,
              }}
            >
              <EditIcon />
            </IconButton>
          )}
        </>
      )}

      {isEditing ? (
        <TextField
          multiline
          fullWidth
          minRows={4}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleDoneEditing}
          sx={{
            fontFamily: 'monospace', // code-like style
          }}
        />
      ) : (
        <Typography
          component="div"
          sx={{ whiteSpace: 'pre-wrap' }}
          dangerouslySetInnerHTML={{ __html: value }}
        />
      )}
    </HoverContainer>
  );
}
