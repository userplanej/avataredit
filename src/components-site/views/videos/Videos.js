import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

import SearchInput from '../../inputs/SearchInput';
import VideoCard from './VideoCard';

import { getAllVideos } from '../../../api/video/video';
import { Grid } from '@mui/material';

const boxStyle = {
  mt: '24px', 
  ml: '32px', 
  width: '95%'
}

const data = [
  {
    id: 1,
    img: null,
    name: "My first video",
    createdAt: "10 days ago",
    isDraft: true,
    time: '00:00:30',
    slides: 2
  },
  {
    id: 2,
    img: null,
    name: "New video",
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
    // getAllVideos().then(res => {
    //   setVideosList(res.rows);
    //   setLoading(false);
    // });
    setVideosList(data);
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
      <Grid container sx={boxStyle}>
        <Grid item xs={11} sm={7} md={6} lg={5} xl={3}>
          <SearchInput fullWidth placeholder="Search" onChange={handleSearch} />
        </Grid>
      </Grid>

      <Box sx={{ ...boxStyle, '& .MuiGrid-root': { m: '0px' } }}>
        {/* {loading && <Skeleton animation="wave" height={150} />} */}
        
        {/*!loading &&*/ videosList && videosList.map(video => {
          return <VideoCard key={video.id} video={video} />
        })}
      </Box>
    </Box>
  );
}
 
export default Videos;