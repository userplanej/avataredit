import React from 'react';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Container } from '@mui/material';

import VideoList from '../videos/VideoList';

const Home = () => {
  return (
    <Container maxWidth={false}>
      <Box sx={{ pb: 3 }}>
        <Typography variant="h5" color="#fff">Templates</Typography>
        
        <VideoList isHome />
      </Box>
    </Container>
  );
}
 
export default Home;