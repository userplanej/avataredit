import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

import SearchInput from '../../inputs/SearchInput';
import VideoCard from './VideoCard';

import { getAllVideos } from '../../../api/video/video';

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
  const [loading, setLoading] = useState(true);
  const [videosList, setVideosList] = useState([]);

  useEffect(() => {
    getAllVideos().then(res => {
      setVideosList(res.rows);
      setLoading(false);
    });
  }, []);

  const handleSearch = (event) => {
    const nameSearch = event.target.value;
    if (nameSearch && nameSearch === '') {
      setVideosList(data);
    }
    const newVideosList = data.filter(video => video.name.toLowerCase().includes(nameSearch.toLowerCase()));
    setVideosList(newVideosList);
  }
  
  return (
    <Box sx={{ mt: '64px', width: '100%' }}>
      <Box sx={boxStyle}>
        <SearchInput placeholder="Search" onChange={handleSearch} />
      </Box>

      <Box sx={{ ...boxStyle, '& .MuiGrid-root': { m: '0px' } }}>
        {loading && <Skeleton animation="wave" height={150} />}
        
        {!loading && data.map(video => {
          return <VideoCard video={video} />
        })}
      </Box>
    </Box>
  );
}
 
export default Videos;