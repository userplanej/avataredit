import React from 'react';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import VideoCard from '../videos/VideoCard';

const boxStyle = {
  mt: 3, 
  ml: 4, 
  width: '95%',
  color: '#fff'
}

const data = [
  {
    id: 1,
    img: null,
    name: "Video 1",
    createdAt: "10 days ago",
    isDraft: true,
    time: '00:00:30',
    slides: 2
  },
  {
    id: 2,
    img: null,
    name: "Video 2",
    createdAt: "15 days ago",
    isDraft: false,
    time: '00:01:30',
    slides: 5
  }
]

const Home = () => {
  return (
    <Box sx={{ mt: 7, width: '100%' }}>
      <Typography variant="h5" sx={boxStyle}>Templates</Typography>
      
      <Typography variant="h5" sx={boxStyle}>Recent videos</Typography>

      <Box sx={{ ...boxStyle, '& .MuiGrid-root': { m: '0px' } }}>
        {data.map(video => {
          return <VideoCard key={video.id} video={video} />
        })}
      </Box>
    </Box>
  );
}
 
export default Home;