import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

import Box from '@mui/material/Box';
import { Grid, Typography, BottomNavigation, Paper } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import SearchInput from '../../inputs/SearchInput';
import SortInput from '../../inputs/SortInput';
import VideoCard from './VideoCard';
import ConfirmDialog from '../../dialog/ConfirmDialog';

import { getAllImagePackage, deleteImagePackage, postImagePackage, updateImagePackage } from '../../../api/image/package';
import { postImageClip } from '../../../api/image/clip';
import { uploadFile } from '../../../api/s3';
import { downloadVideo } from '../../../api/output/output';

import { setShowBackdrop } from '../../../redux/backdrop/backdropSlice';

import { pathnameEnum } from '../../constants/Pathname';
import { drawerWidth } from '../../constants/Drawer';

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

const VideoList = (props) => {
  const { isHome } = props;

  const dispatch = useDispatch();
  const history = useHistory();
  const showBackdrop = useSelector(state => state.backdrop.showBackdrop);

  const [selected, setSelected] = useState([]);
  const [videosList, setVideosList] = useState([]);
  const [videosListToDisplay, setVideosListToDisplay] = useState([]);
  const [sortType, setSortType] = useState(1);
  const [isSortAsc, setIsSortAsc] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [videoIdSelected, setVideoIdSelected] = useState(null);
  const [isSearch, setIsSearch] = useState(false);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    dispatch(setShowBackdrop(true));

    const user = JSON.parse(sessionStorage.getItem('user'));

    await getAllImagePackage(user.user_id, false, isHome).then(res => {
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
      setIsSearch(false);
    } else {
      const newVideosList = videosList.filter(video => video.package_name.toLowerCase().includes(nameSearch.toLowerCase()));
      setVideosListToDisplay(newVideosList);
      setIsSearch(true);
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

  const handleDownloadVideo = async (output) => {
    const videoName = `${output.video_name.replaceAll(' ', '-')}.mp4`;
    const dataToSend = {
      video_dir: output.video_dir
    }
    await downloadVideo(dataToSend).then((res) => {
      const data = res.data;
      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = videoName;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  const handleDeleteVideo = async () => {
    await deleteImagePackage(videoIdSelected).then(() => {
      loadVideos();
      handleCloseConfirmDialog();
    });
  }

  const handleDuplicateVideo = async (video) => {
    dispatch(setShowBackdrop(true));
    
    // Duplicate video
    let packageId = null;
    const newVideo = {
      package_name: 'New video',
      package_name: video.package_name,
      is_draft: true,
      is_template: false,
      user_id: video.user_id
    }
    await postImagePackage(newVideo).then((res) => {
      packageId = res.data.body.package_id;
    });

    // Duplicate slides
    let firstClipId = null;
    const slidePromise = new Promise((resolve) => {
      const slides = video.image_clips;
      slides.forEach(async (slide, index) => {
        let newLocation = null;

        // Duplicate slide thumbnail
        const slideImage = slide.html5_dir;
        await axios.get(slideImage, { responseType: 'blob' }).then(async (res) => {
          const blob = res.data;
          const filename = `video-${packageId}-slide-${index}`;
          const file = new File([blob], filename, { type: "image/png" });

          const formData = new FormData();
          formData.append('files', file);
          await uploadFile(formData, 'slide-thumbnail').then((res) => {
            newLocation = res.data.body[0].file_dir;
          });
        });

        const imageClip = {
          ...slide,
          package_id: packageId,
          html5_dir: newLocation
        }
        delete imageClip.clip_id;
        delete imageClip.create_date;
        delete imageClip.update_date;

        await postImageClip(imageClip).then((res) => {
          if (index === 0) {
            firstClipId = res.data.body.clip_id;
          }
        });

        if (index === (slides.length - 1)) {
          resolve();
        }
      });
    });

    // Update video current clip_id
    slidePromise.then(async () => {
      await updateImagePackage(packageId, { clip_id: firstClipId }).then(() => {
        history.push(`${pathnameEnum.editor}/${packageId}`);
        dispatch(setShowBackdrop(false));
      });
    });
  }

  const handleCreateTemplateFromVideo = async (video) => {
    dispatch(setShowBackdrop(true));

    let packageId = null;
    let clipId = null;

    // Create package
    const user = JSON.parse(sessionStorage.getItem('user'));
    const imagePackage = {
      user_id: user.user_id,
      package_name: 'New template',
      is_draft: true,
      is_template: true
    }
    await postImagePackage(imagePackage).then((res) => {
      packageId = res.data.body.package_id;
    });

    // Create slides
    const slidePromise = new Promise((resolve) => {
      const slides = video.image_clips;
      slides.forEach(async (slide, index) => {
        let newLocation = null;

        // Duplicate slide thumbnail
        const slideImage = slide.html5_dir;
        await axios.get(slideImage, { responseType: 'blob' }).then(async (res) => {
          const blob = res.data;
          const filename = `video-${packageId}-slide-${index}`;
          const file = new File([blob], filename, { type: "image/png" });

          const formData = new FormData();
          formData.append('files', file);
          await uploadFile(formData, 'slide-thumbnail').then((res) => {
            newLocation = res.data.body[0].file_dir;
          });
        });

        const imageClip = {
          ...slide,
          package_id: packageId,
          html5_dir: newLocation
        }
        delete imageClip.clip_id;
        delete imageClip.create_date;
        delete imageClip.update_date;

        await postImageClip(imageClip).then((res) => {
          if (index === 0) {
            clipId = res.data.body.clip_id;
          }
        });

        if (index === (slides.length - 1)) {
          resolve();
        }
      });
    });

    // Update image package current clip_id
    slidePromise.then(async () => {
      await updateImagePackage(packageId, { clip_id: clipId }).then(() => {
        dispatch(setShowBackdrop(false));
        history.push(`${pathnameEnum.editorTemplate}/${packageId}`);
      });
    });
  }

  const handleSelectVideo = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  }

  const handleDeleteSelectedVideo = () => {
    if (selected.length > 0) {
      const promise = new Promise((resolve) => {
        selected.forEach(async (id) => {
          await deleteImagePackage(id);
        });
        resolve();
      });
      promise.then(() => {
        setSelected([]);
        loadVideos();
      });
    }
  }

  return (
    <Box sx={{ pb: 3 }}>
      {!isHome &&
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
      }

      {isHome &&
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
      }

      <Box sx={{ mt: 2, '& .MuiGrid-root': { m: '0px' }, maxHeight: isHome ? '730px' : '', overflowY: 'auto' }}>
        {!showBackdrop && videosListToDisplay && videosListToDisplay.length > 0 && videosListToDisplay.map(video => (
          <VideoCard
            key={video.package_id}
            video={video}
            output={video.output}
            onDownloadVideo={(output) => handleDownloadVideo(output)}
            onDeleteVideo={(id) => handleOpenConfirmDialog(id)}
            onDuplicateVideo={(video) => handleDuplicateVideo(video)}
            onCreateTemplate={(video) => handleCreateTemplateFromVideo(video)}
            onSelectVideo={(id) => handleSelectVideo(id)}
            isSelected={selected.indexOf(video.package_id) !== -1}
          />
        ))}
        {!showBackdrop && videosListToDisplay && videosListToDisplay.length === 0 && 
          <Typography variant="h6">
            {isSearch ? 'No result' : 'You have no videos, please create a new one.'}
          </Typography>
        }
      </Box>

      {selected.length > 0 &&
        <Box
          sx={{
            p: 2,
            backgroundColor: '#df678c',
            color: '#fff',
            position: 'fixed',
            bottom: 0,
            left: { xs: 0, lg: 'auto' },
            right: 0,
            zIndex: 'auto',
            width: { lg: `calc(100% - ${drawerWidth}px)` },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          {selected.length} selected
          <IconButton
            aria-label="delete"
            id="delete-button"
            onClick={handleDeleteSelectedVideo}
          >
            <DeleteForeverIcon sx={{ color: '#fff' }} />
          </IconButton>
        </Box>
      }

      <ConfirmDialog 
        open={openConfirmDialog}
        close={handleCloseConfirmDialog}
        title="Delete video"
        text="Are you sure you want to delete this video?"
        onConfirm={handleDeleteVideo}
      />
    </Box>
  );
}
 
export default VideoList;