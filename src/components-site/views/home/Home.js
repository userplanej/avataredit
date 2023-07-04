import React from 'react';

import Box from '@mui/material/Box';
import { Container } from '@mui/material';

import VideoList from '../videos/VideoList';
import TemplateList from '../templates/TemplateList';

const Home = () => {
  return (
    <Container maxWidth={false}>
      <Box sx={{ pb: 3 }}>
        {/* <TemplateList isHome />
        <Box sx={{ mb: 2 }} /> */}
        <VideoList isHome />
      </Box>
    </Container>
  );
}
 
export default Home;