import React, { useState } from 'react';

import Box from '@mui/material/Box';

import SearchInput from '../inputs/SearchInput';
import VideoCard from './VideoCard';

const boxStyle = {
  mt: '24px', 
  ml: '32px', 
  width: '95%'
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

const Videos = () => {
  const [videosList, setVideosList] = useState(data);

  const handleSearch = (event) => {
    const nameSearch = event.target.value;
    if (nameSearch && nameSearch === '') {
      setVideosList(data);
    }
    const newVideosList = data.filter(video => video.name.toLowerCase().includes(nameSearch));
    setVideosList(newVideosList);
  }
  
  return (
    <Box sx={{ mt: '64px', width: '100%' }}>
      <Box sx={boxStyle}>
        <SearchInput placeholder="Search" onChange={handleSearch} />
      </Box>

      <Box sx={{ ...boxStyle, '& .MuiGrid-root': { m: '0px' } }}>
        {videosList.map(video => {
          return <VideoCard video={video} />
        })}
      </Box>
    </Box>
  );
}
 
export default Videos;