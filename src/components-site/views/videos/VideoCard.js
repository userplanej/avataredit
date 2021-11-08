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

import { setDrawerWidth, setIsMinimal, setPathName } from '../../../redux/navigation/navigationSlice';
import { drawerMinWidth } from '../../constants/Drawer';
import { pathnameEnum } from '../../constants/Pathname';

const playButtonStyle = {
  width: '100px',
  height: '40px',
  margin: '0 8px 0 12px',
  borderRadius: '10px',
  boxShadow: '4px 6px 6px 0 rgba(0, 0, 0, 0.03)',
  border: 'solid 2px #babbbb',
  backgroundColor: '#e8e9e9',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  color: '#5b5c62'
}

const ITEM_HEIGHT = 48;

const options = [
  'Download',
  'Duplicate',
  'Create template'
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
    dispatch(setPathName(pathnameEnum.editor));
    dispatch(setIsMinimal(true));
    dispatch(setDrawerWidth(drawerMinWidth));
    history.push('/studio/editor');
  }
  
  return (
    <Grid 
      key={video.id}
      container 
      spacing="12" 
      onClick={handleClickVideo}  
      sx={{ 
        width: '100%', 
        alignItems: 'center', 
        backgroundColor: '#f9f8fa', 
        padding: '16px 20px 16px 20px', 
        cursor: 'pointer',
        ':hover': {
          backgroundColor: '#e8e9e9'
        },
        '& .MuiGrid-item': {
          p: '0px'
        }
      }}
    >
      <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
        <Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: 35 }, mr: '15px' }} onClick={handleSelectVideo} />
      </Grid>

      <Grid item md={1} sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '80px', height: '80px', borderRadius: '5px', backgroundColor: 'red' }}></Box>
      </Grid>

      <Grid item md={1}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{video.name}</Typography>
        <Typography variant="subtitle1">{video.createdAt}</Typography>
      </Grid>

      <Grid item md={1} sx={{ display: 'flex', justifyContent: 'right' }}>
        {video.isDraft && 
        <Box sx={{ textAlign: 'center', fontSize: '14px', fontWeight: 'bold', color: '#5b5c62', width: '65px', height: '25px', borderRadius: '10px', border: 'solid 2px #babbbb' }}>Draft</Box>
        }
      </Grid>

      <Grid item md={2} sx={{ textAlign: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{video.slides} Slides</Typography>
      </Grid>

      <Grid item md={2} sx={{ textAlign: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{video.time}</Typography>
      </Grid>

      <Grid item md={2}>
        {!video.isDraft && 
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Box sx={{ 
            mr: '30px',
            width: '17px',
            height: '17px',
            borderRadius: '30px',
            boxShadow: '0 3px 6px 0 rgba(159, 190, 157, 0.08)',
            backgroundColor: '#9ebe9d' }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Ready</Typography>
        </Box>}
      </Grid>

      <Grid item md={2} sx={{ display: 'flex', justifyContent: 'center' }}>
        {!video.isDraft && 
        <Box sx={playButtonStyle}>
          <PlayArrowIcon sx={{ mr: '5px' }} />
          Play
        </Box>}
      </Grid>

      <Grid item>
        {video.isDraft && 
        <IconButton
          aria-label="delete"
          id="delete-button"
          onClick={handleDeleteVideo}
        >
          <DeleteForeverIcon />
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
            <MoreVertIcon />
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
                width: '15ch',
              },
            }}
          >
            {options.map((option) => (
              <MenuItem 
                key={option} 
                selected={option === 'Pyxis'} 
                onClick={handleCloseMenu} 
                sx={{ ':hover': { backgroundColor: '#f5f0fa' } }}
              >
                {option}
              </MenuItem>
            ))}
          </Menu>
        </Box>}
      </Grid>
    </Grid>
  );
}
 
export default VideoCard;