'use client'

import EditableHTMLField from '@/components/createArticle/EditableHTMLField'
import { Box } from '@mui/material'
import React from 'react'

const page = () => {
  return (
    <Box>
        <EditableHTMLField initialHTML={'<h1> something to edit</h1>'}/>
    </Box>
  )
}

export default page