import React from 'react';
import { Container } from '@mui/material';
import Box from '@mui/material/Box';

import Canvas from '../../components/canvas/Canvas';
import ImageMapEditor from '../../components/imagemap/ImageMapEditor';

const SlidePreview = () => {
  return ( 
    <Container
      sx={{display: 'flex', justifyContent: 'center'}}
    >
      <Box
        sx={{
          mt: '40px',
          width: '90%',
          height: '400px',
          border: '1px solid black'
          // backgroundColor: 'lightblue'
        }}
      >
        {/* <canvas id={`canvas_1`} /> */}
        <ImageMapEditor />
      </Box>
    </Container>
  );
}
 
export default SlidePreview;