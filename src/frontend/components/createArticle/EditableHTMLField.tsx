'use client';

import React, { useState, useEffect } from 'react';
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
  initialHTML: string;
  loading?: boolean;
  onChangeHTML?: (updated: string) => void;
}

const HoverContainer = styled(Box)({
  position: 'relative',
  overflow: 'hidden',
  border: '1px solid #ccc',
  borderRadius: 4,
});

export default function EditableHTMLField({
  initialHTML,
  loading = false,
}: EditableHTMLFieldProps) {
  const [value, setValue] = useState(initialHTML);
  const [isEditing, setIsEditing] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // ****************** ADD THIS ******************
  useEffect(() => {
    setValue(initialHTML);
  }, [initialHTML]);
  // **********************************************

  const handleDoneEditing = () => {
    setIsEditing(false);
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
              backgroundColor: alpha('#000', 0.2),
              zIndex: (theme) => theme.zIndex.drawer + 1,
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
          autoFocus={true}
          minRows={4}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleDoneEditing}
          sx={{
            fontFamily: 'monospace',
          }}
        />
      ) : (
        <Typography
          component="div"
        //   sx={{ whiteSpace: 'pre-wrap' }}
          dangerouslySetInnerHTML={{ __html: value }}
        />
      )}
    </HoverContainer>
  );
}
