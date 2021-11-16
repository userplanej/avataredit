import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import { getTimeElapsedSinceDate } from '../../../utils/DateUtils';

import { setVideo } from '../../../redux/video/videoSlice';
import { setPathName } from '../../../redux/navigation/navigationSlice';
import { pathnameEnum } from '../../constants/Pathname';

const playButtonStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  color: '#fff'
}

const ITEM_HEIGHT = 48;

const options = [
  'Download',
  'Duplicate',
  'Create template',
  'Delete'
];

const VideoCard = (props) => {
  const { video } = props;

  const dispatch = useDispatch();
  const history = useHistory();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClickMenu = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = (event) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  const handleSelectVideo = (event) => {
    event.stopPropagation();
  }

  const handleDeleteVideo = (event) => {
    event.stopPropagation();
  }

  const handleClickVideo = () => {
    const id = video.package_id;
    dispatch(setVideo(video));
    dispatch(setPathName(pathnameEnum.editor));
    history.push(pathnameEnum.editor, { id });
  }
  
  return (
    <Grid 
      key={video.package_id}
      container 
      columns={13}
      onClick={handleClickVideo}  
      sx={{ 
        width: '100%', 
        alignItems: 'center', 
        backgroundColor: '#202427', 
        padding: '16px 20px 16px 20px', 
        cursor: 'pointer',
        ':hover': {
          backgroundColor: '#3c4045'
        },
        '& .MuiGrid-item': {
          p: '0px'
        }
      }}
    >
      <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
        <Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: 35 }, mr: '15px', color: '#fff' }} onClick={handleSelectVideo} />
      </Grid>

      <Grid item lg={1} sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '80px', height: '80px', borderRadius: '5px', backgroundColor: '#fff' }}></Box>
      </Grid>

      <Grid item lg={2}>
        <Box sx={{ display: 'flex', alignItems: 'center', pl: 2 }}>
          <Typography variant="h6" sx={{ color: '#fff' }}>{video.package_name}</Typography>
          {video.isDraft && 
            <Box 
              sx={{ 
                textAlign: 'center', 
                fontSize: '14px', 
                fontWeight: 'bold', 
                color: '#9a9a9a', 
                width: '65px', 
                height: '25px', 
                borderRadius: '4px', 
                border: 'solid 2px #babbbb',
                ml: 2
              }}
            >
              Draft
            </Box>
          }
        </Box>
        
        <Typography variant="subtitle1" sx={{ color: '#fff', pl: 2 }}>{getTimeElapsedSinceDate(video.create_date)}</Typography>
      </Grid>

      <Grid item lg={1} xl={2} sx={{ textAlign: 'center' }}>
        <Typography variant="h6" sx={{ color: '#fff' }}>{video.time ? video.time : '00:00:00'}</Typography>
      </Grid>

      <Grid item lg={1} xl={2} sx={{ textAlign: 'center' }}>
        <Typography variant="h6" sx={{ color: '#fff' }}>{video.slides ? video.slides : '1'} Slide{video.slides && video.slides > 1 ? 's' : ''}</Typography>
      </Grid>

      <Grid item lg={1} xl={2}>
        {!video.isDraft && 
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {/* <Box sx={{ 
            mr: '30px',
            width: '17px',
            height: '17px',
            borderRadius: '30px',
            boxShadow: '0 3px 6px 0 rgba(159, 190, 157, 0.08)',
            backgroundColor: '#9ebe9d' }} /> */}
          <Typography variant="h6" sx={{ color: '#fff' }}>Ready</Typography>
        </Box>}
      </Grid>

      <Grid item lg={1} xl={2} sx={{ display: 'flex', justifyContent: 'center' }}>
        {!video.isDraft && 
        <Box sx={playButtonStyle}>
          <PlayArrowIcon sx={{ mr: '5px' }} />
          <Typography variant="h6" sx={{ color: '#fff' }}>Play</Typography>
        </Box>}
      </Grid>

      <Grid item lg={1} xl={1}>
        {video.isDraft && 
        <IconButton
          aria-label="delete"
          id="delete-button"
          onClick={handleDeleteVideo}
        >
          <DeleteForeverIcon sx={{ color: '#fff' }} />
        </IconButton>}

        {!video.isDraft && 
        <Box>
          <IconButton
            aria-label="more"
            id="video-menu-button"
            aria-controls="video-menu"
            aria-expanded={open ? 'true' : undefined}
            aria-haspopup="true"
            onClick={handleClickMenu}
          >
            <MoreVertIcon sx={{ color: '#fff' }} />
          </IconButton>

          <Menu
            id="video-menu"
            MenuListProps={{
              'aria-labelledby': 'video-button',
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleCloseMenu}
            PaperProps={{
              style: {
                maxHeight: ITEM_HEIGHT * 4.5,
                width: '16ch',
              },
            }}
          >
            {options.map((option) => (
              <MenuItem 
                key={option}  
                onClick={handleCloseMenu} 
                sx={{ ':hover': { backgroundColor: '#f5f0fa' } }}
              >
                {option}
              </MenuItem>
            ))}
          </Menu>
        </Box>
        }
      </Grid>
    </Grid>
  );
}
 
export default VideoCard;