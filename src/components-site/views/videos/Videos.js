import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import Box from '@mui/material/Box';
import { Grid } from '@mui/material';

import SearchInput from '../../inputs/SearchInput';
import VideoCard from './VideoCard';

import { getAllImagePackage } from '../../../api/image/package';
import { setShowBackdrop } from '../../../redux/backdrop/backdropSlice';

const boxStyle = {
  mt: '24px', 
  ml: '32px', 
  width: '95%'
}

const Videos = () => {
  const dispatch = useDispatch();

  const [videosList, setVideosList] = useState([]);
  const [videosListToDisplay, setVideosListToDisplay] = useState([]);

  useEffect(() => {
    dispatch(setShowBackdrop(true));

    getAllImagePackage().then(res => {
      const videos = res.data.body.rows;
      const videosSorted = videos.sort((a, b) => (a.create_date < b.create_date) ? 1 : -1);
      setVideosList(videosSorted);
      setVideosListToDisplay(videosSorted);
      dispatch(setShowBackdrop(false));
    });
  }, []);

  const handleSearch = (event) => {
    const nameSearch = event.target.value;
    if (nameSearch && nameSearch === '') {
      setVideosListToDisplay(videosList);
    } else {
      const newVideosList = videosList.filter(video => video.package_name.toLowerCase().includes(nameSearch.toLowerCase()));
      setVideosListToDisplay(newVideosList);
    }
  }
  
  return (
    <Box sx={{ mt: '64px', width: '100%' }}>
      <Grid container sx={boxStyle}>
        <Grid item xs={11} sm={7} md={6} lg={5} xl={3}>
          <SearchInput fullWidth placeholder="Search" onChange={handleSearch} />
        </Grid>
      </Grid>

      <Box sx={{ ...boxStyle, '& .MuiGrid-root': { m: '0px' } }}>        
        {videosListToDisplay && videosListToDisplay.map(video => {
          return <VideoCard key={video.package_id} video={video} />
        })}
      </Box>
    </Box>
  );
}
 
export default Videos;