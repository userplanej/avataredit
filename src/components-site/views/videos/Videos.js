import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import { Grid, Container, Typography } from '@mui/material';

import SearchInput from '../../inputs/SearchInput';
import SortInput from '../../inputs/SortInput';
import VideoCard from './VideoCard';
import ConfirmDialog from '../../dialog/ConfirmDialog';

import { getAllImagePackage, deleteImagePackage } from '../../../api/image/package';
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

const Videos = () => {
  const dispatch = useDispatch();
  const showBackdrop = useSelector(state => state.backdrop.showBackdrop);

  const [videosList, setVideosList] = useState([]);
  const [videosListToDisplay, setVideosListToDisplay] = useState([]);
  const [sortType, setSortType] = useState(1);
  const [isSortAsc, setIsSortAsc] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [videoIdSelected, setVideoIdSelected] = useState(null);

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

  const handleOpenConfirmDialog = (id) => {
    setVideoIdSelected(id);
    setOpenConfirmDialog(true);
  }

  const handleCloseConfirmDialog = () => setOpenConfirmDialog(false);

  const handleDeleteVideo = async () => {
    await deleteImagePackage(videoIdSelected).then(() => {
      loadVideos();
      handleCloseConfirmDialog();
    });
  }
  
  return (
    <Container maxWidth={false}>
      <Box sx={{ pb: 3 }}>
        <Grid container>
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

        <Box sx={{ mt: 2, '& .MuiGrid-root': { m: '0px' }, maxHeight: '730px', overflowY: 'auto' }}>        
          {!showBackdrop && videosListToDisplay && videosListToDisplay.length > 0 && videosListToDisplay.map(video => (
            <VideoCard
              key={video.package_id}
              video={video}
              output={video.output}
              onDeleteVideo={(id) => handleOpenConfirmDialog(id)}
            />
          ))}
          {!showBackdrop && videosListToDisplay && videosListToDisplay.length === 0 && 
            <Typography variant="h6">You have no videos, please create a new one.</Typography>
          }
        </Box>
      </Box>

      <ConfirmDialog 
        open={openConfirmDialog}
        close={handleCloseConfirmDialog}
        title="Delete video"
        text="Are you sure you want to delete this video?"
        onConfirm={handleDeleteVideo}
      />
    </Container>
  );
}
 
export default Videos;