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
import { getStringShortcut } from '../../../utils/StringUtils';

import { setVideo } from '../../../redux/video/videoSlice';
import { setPathName } from '../../../redux/navigation/navigationSlice';
import { setShowBackdrop } from '../../../redux/backdrop/backdropSlice';

import { deleteImagePackage } from '../../../api/image/package';

import { pathnameEnum } from '../../constants/Pathname';

const playButtonStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  color: '#fff'
}

const gridStyle = {
  display: 'flex', 
  alignItems: 'center'
}

const ITEM_HEIGHT = 48;

const VideoCard = (props) => {
  const { video, reloadVideosList } = props;

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

  const handleDeleteVideo = async (event, id) => {
    event.stopPropagation();

    await deleteImagePackage(id).then(() => {
      reloadVideosList()
    });
  }

  const handleClickVideo = () => {
    const id = video.package_id;
    dispatch(setVideo(video));
    dispatch(setPathName(pathnameEnum.editor));
    history.push(pathnameEnum.editor, { id });
  }

  const options = [
    {
      name: 'Download',
      action: (event) => handleCloseMenu(event)
    },
    {
      name: 'Duplicate',
      action: (event) => handleCloseMenu(event)
    },
    {
      name: 'Create template',
      action: (event) => handleCloseMenu(event)
    },
    {
      name: 'Delete',
      action: (event, id) => handleDeleteVideo(event, id)
    }
  ];
  
  return (
    <Grid 
      key={video.package_id}
      container 
      columns={20}
      onClick={handleClickVideo}  
      sx={{ 
        width: '100%', 
        alignItems: 'center', 
        backgroundColor: '#202427', 
        padding: '12px 20px 12px 20px', 
        cursor: 'pointer',
        ':hover': {
          backgroundColor: '#3c4045'
        },
        '& .MuiGrid-item': {
          p: '0px'
        }
      }}
    >
      <Grid item xs={3} sm={2} md={1} lg={1} xl={1} sx={gridStyle}>
        <Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: 35 }, color: '#fff', width: '100%' }} onClick={handleSelectVideo} />
      </Grid>

      <Grid item xs={16} sm={13} md={9} lg={10} xl={7} sx={gridStyle}>
        <Box sx={{ minWidth: '80px', height: '80px', borderRadius: '5px', backgroundColor: '#fff', mr: 2 }}></Box>

        <Box>
          <Box sx={gridStyle}>
            <Typography variant="h6" sx={{ color: '#fff' }}>{getStringShortcut(video.package_name, 40)}</Typography>
            {video.is_draft && 
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

          <Typography variant="subtitle1" sx={{ color: '#fff' }}>{getTimeElapsedSinceDate(video.create_date)}</Typography>
        </Box>
      </Grid>

      <Grid item xs={10} sm={5} md={2} lg={2} xl={2} sx={{ textAlign: 'center' }}>
        <Typography variant="h6" sx={{ color: '#fff' }}>{video.time ? video.time : '00:00:00'}</Typography>
      </Grid>

      <Grid item xs={10} sm={7} md={2} lg={2} xl={4} sx={{ textAlign: 'center' }}>
        {!video.is_draft && 
        <Typography variant="h6" sx={{ color: '#fff' }}>{video.slides ? video.slides : '1'} Slide{video.slides && video.slides > 1 ? 's' : ''}</Typography>
        }
      </Grid>

      <Grid item xs={6} sm={5} md={2} lg={2} xl={2}>
        {!video.is_draft && 
        <Box sx={{ ...gridStyle, justifyContent: 'center' }}>
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

      <Grid item xs={6} sm={4} md={2} lg={2} xl={2} sx={{ ...gridStyle, justifyContent: 'center' }}>
        {!video.is_draft && 
        <Box sx={playButtonStyle}>
          <PlayArrowIcon sx={{ mr: '5px' }} />
          <Typography variant="h6" sx={{ color: '#fff' }}>Play</Typography>
        </Box>}
      </Grid>

      <Grid item xs={6} sm={4} md={1} lg={1} xl={2} sx={{ ...gridStyle, justifyContent: 'center' }}>
        {video.is_draft && 
        <IconButton
          aria-label="delete"
          id="delete-button"
          onClick={(event) => handleDeleteVideo(event, video.package_id)}
        >
          <DeleteForeverIcon sx={{ color: '#fff' }} />
        </IconButton>}

        {!video.is_draft && 
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
                key={option.name}  
                onClick={(event) => option.action(event, video.package_id)} 
                sx={{ ':hover': { backgroundColor: '#f5f0fa' } }}
              >
                {option.name}
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