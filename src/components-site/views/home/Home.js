import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Grid, Container } from '@mui/material';

import SearchInput from '../../inputs/SearchInput';
import SortInput from '../../inputs/SortInput';
import VideoCard from '../videos/VideoCard';

import { getAllImagePackage } from '../../../api/image/package';
import { setShowBackdrop } from '../../../redux/backdrop/backdropSlice';

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

const Home = () => {
  const dispatch = useDispatch();

  const [videosList, setVideosList] = useState([]);
  const [videosListToDisplay, setVideosListToDisplay] = useState([]);
  const [sortType, setSortType] = useState(1);
  const [isSortAsc, setIsSortAsc] = useState(false);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    dispatch(setShowBackdrop(true));

    const user = JSON.parse(sessionStorage.getItem('user'));

    await getAllImagePackage(user.user_id).then(res => {
      const videos = res.data.body.rows;
      const videosSorted = videos.sort((a, b) => (a.create_date < b.create_date) ? 1 : -1);
      setVideosList(videosSorted);
      setVideosListToDisplay(videosSorted);
      dispatch(setShowBackdrop(false));
    });
  }

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
    <Container maxWidth={false}>
      <Box sx={{ pb: 3 }}>
        <Typography variant="h5" color="#fff">Templates</Typography>
        
        <Grid container sx={{ alignItems: 'center' }}>
          <Grid item xs={11} sm={5} md={5} lg={7} xl={8}>
            <Typography variant="h5" color="#fff">Recent videos</Typography>
          </Grid>

          <Grid item xs={11} sm={7} md={7} lg={5} xl={4} sx={{ mt: { xs: 1, sm: 0 }, display: 'flex', justifyContent: 'end'}}>
            <SearchInput placeholder="Search" onChange={handleSearch} sx={{ margin: 0, mr: 1 }} />

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

        <Box sx={{ mt: 2, '& .MuiGrid-root': { m: '0px' }, maxHeight: '420px', overflowY: 'auto' }}>
          {videosListToDisplay && videosListToDisplay.map(video => {
            return <VideoCard key={video.package_id} video={video} reloadVideosList={() => loadVideos()} />
          })}
        </Box>
      </Box>
    </Container>
  );
}
 
export default Home;