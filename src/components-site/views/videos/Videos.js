import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import Box from '@mui/material/Box';
import { Grid } from '@mui/material';

import SearchInput from '../../inputs/SearchInput';
import SortInput from '../../inputs/SortInput';
import VideoCard from './VideoCard';

import { getAllImagePackage } from '../../../api/image/package';
import { setShowBackdrop } from '../../../redux/backdrop/backdropSlice';

const boxStyle = {
  mt: '24px', 
  ml: '32px', 
  width: '95%'
}

const sortItems = [
  {
    value: 1,
    label: 'Date'
  },
  {
    value: 2,
    label: 'Title'
  }
]

const Videos = () => {
  const dispatch = useDispatch();

  const [videosList, setVideosList] = useState([]);
  const [videosListToDisplay, setVideosListToDisplay] = useState([]);
  const [sortType, setSortType] = useState(1);
  const [isSortAsc, setIsSortAsc] = useState(false);

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

  const handleChangeSortType = (event) => {
    const newValue = event.target.value;
    setSortType(newValue);
    changeSort(newValue, isSortAsc);
  }

  const handleChangeSortOrder = () => {
    const newValue = !isSortAsc;
    setIsSortAsc(newValue);
    changeSort(sortType, newValue);
  }

  const changeSort = (sortType, isSortAsc) => {
    const newVideosList = videosList.sort((a, b) => {
      if (sortType === 1) {
        // Date
        const compareResult = isSortAsc ? a.create_date > b.create_date : a.create_date < b.create_date;
        return compareResult ? 1 : -1;
      } else {
        // Title
        const compareResult = isSortAsc ? a.package_name > b.package_name : a.package_name < b.package_name;
        return compareResult ? 1 : -1;
      }
    });
    setVideosListToDisplay(newVideosList);
  }
  
  return (
    <Box sx={{ mt: '64px', width: '100%' }}>
      <Grid container sx={boxStyle}>
        <Grid item xs={11} sm={6} md={5} lg={5} xl={3}>
          <SearchInput fullWidth placeholder="Search" onChange={handleSearch} sx={{ margin: 0 }} />
        </Grid>

        <Grid item xs={11} sm={6} md={7} lg={7} xl={9} sx={{ mt: { xs: 1, sm: 0 }, display: 'flex', justifyContent: 'end'}}>
          <SortInput 
            id="sort-videos"
            name="sort-videos"
            items={sortItems}
            value={sortType}
            onChange={handleChangeSortType}
            onClickButton={handleChangeSortOrder}
            isSortAsc={isSortAsc}
          />
        </Grid>
      </Grid>

      <Box sx={{ ...boxStyle, '& .MuiGrid-root': { m: '0px' }, maxHeight: '730px', overflowY: 'auto' }}>        
        {videosListToDisplay && videosListToDisplay.map(video => {
          return <VideoCard key={video.package_id} video={video} />
        })}
      </Box>
    </Box>
  );
}
 
export default Videos;