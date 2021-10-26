import React from 'react';
import { Container } from '@mui/material';
import Box from '@mui/material/Box';

import Canvas from '../../components/canvas/Canvas';

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
          backgroundColor: 'lightblue'
        }}
      >
        {/* <Canvas /> */}
      </Box>
    </Container>
  );
}
 
export default SlidePreview;