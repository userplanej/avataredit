import React from 'react';
import Grid from '@mui/material/Grid';
import SlidePreview from './SlidePreview';
import Slides from './Slides';
import ToolsView from './ToolsView';

const EditorView = () => {
  return (
    <Grid container sx={{ height: '100%' }}>
      <Grid item md={2} sx={{  backgroundColor: '#e8dff4', height: '100%' }}>
        <Slides />
      </Grid>
      <Grid item md={5}>
        <SlidePreview />
      </Grid>
      <Grid item md={5}>
        <ToolsView />
      </Grid>
    </Grid>
  );
}
 
export default EditorView;