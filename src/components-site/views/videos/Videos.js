import React from 'react';

import { Container } from '@mui/material';

import VideoList from './VideoList';

const Videos = () => {
  return (
    <Container maxWidth={false}>
      <VideoList />
    </Container>
  );
}
 
export default Videos;