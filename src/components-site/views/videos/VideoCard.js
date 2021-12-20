import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

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

import { pathnameEnum } from '../../constants/Pathname';

const playButtonStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  color: '#fff',
  my: { xs: 1, sm: 0 }
}

const gridStyle = {
  display: 'flex',
  alignItems: 'center'
}

const ITEM_HEIGHT = 48;

const VideoCard = (props) => {
  const { video, output, onDownloadVideo, onDeleteVideo, onDuplicateVideo, onCreateTemplate } = props;

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

  const handleDownloadVideo = (event) => {
    event.stopPropagation();

    onDownloadVideo(output);
    handleCloseMenu(event);
  }

  const handleClickVideo = () => {
    const id = video.package_id;
    const path = video.is_draft ? pathnameEnum.editor + `/${id}` : pathnameEnum.videos + `/${id}`;
    history.push(path);
  }

  const handleDeleteVideo = (event) => {
    event.stopPropagation();
    
    const id = video.package_id;
    onDeleteVideo(id);
    handleCloseMenu(event);
  }

  const handleDuplicateVideo = async (event) => {
    event.stopPropagation();

    onDuplicateVideo(video);
    handleCloseMenu(event);
  }

  const handleCreateTemplate = (event) => {
    event.stopPropagation();

    onCreateTemplate(video);
    handleCloseMenu(event);
  }

  const options = [
    {
      name: 'Download',
      action: (event) => handleDownloadVideo(event)
    },
    {
      name: 'Duplicate',
      action: (event) => handleDuplicateVideo(event)
    },
    {
      name: 'Create template',
      action: (event) => handleCreateTemplate(event)
    },
    {
      name: 'Delete',
      action: (event) => handleDeleteVideo(event)
    }
  ];
  
  const hasSlideImage = video.image_clips && video.image_clips.length > 0 && video.image_clips[0].html5_dir;

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
      <Grid item xs={20} sm={2} md={1} lg={1} xl={1} sx={gridStyle}>
        <Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: 35 }, color: '#fff', width: '100%' }} onClick={handleSelectVideo} />
      </Grid>

      <Grid item xs={20} sm={3.2} md={2.1} lg={2} xl={1.5} sx={gridStyle}>
        <Box
          sx={{
            width: { xs: '100%', sm: '80px' },
            minHeight: { xs: '200px', sm: '80px' },
            borderRadius: '5px',
            backgroundColor: hasSlideImage ? '' : '#fff',
            backgroundImage: hasSlideImage ? `url(${video.image_clips[0].html5_dir})` : '',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: 'cover'
          }}
        />
      </Grid>

      <Grid item xs={20} sm={video.is_draft ? 9 : 14.8} md={7.9} lg={8} xl={8}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, wordBreak: 'break-all', mt: { xs: 2, sm: 0 } }}>
          <Typography variant="body1" sx={{ maxWidth: '100%', color: '#fff' }}>{getStringShortcut(video.package_name, 22)}</Typography>
          {video.is_draft && 
            <Box 
              sx={{ 
                textAlign: 'center', 
                fontSize: '14px', 
                fontWeight: 'bold', 
                color: '#9a9a9a', 
                minWidth: '65px', 
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

        <Typography variant="subtitle2" sx={{ color: '#fff' }}>{getTimeElapsedSinceDate(video.create_date)}</Typography>
      </Grid>

      <Grid item xs={0} sm={2} md={0} lg={0} xl={0} sx={{ display: { xs: 'none', sm: video.is_draft ? 'none' : 'block', md: 'none' } }}></Grid>

      <Grid item xs={20} sm={video.is_draft ? 3.5 : 3} md={2} lg={2} xl={2} sx={{ textAlign: { xs: 'left', sm: 'center' } }}>
        <Typography variant="body1" sx={{ color: '#fff', mt: { xs: 1, sm: 0 } }}>{video.time ? video.time : '00:00:00'}</Typography>
      </Grid>

      <Grid
        item
        xs={10} sm={5} md={2} lg={2} xl={2}
        sx={{
          textAlign: { xs: 'left', sm: 'center' },
          display: { xs: video.is_draft ? 'none' : 'block', md: 'block' }
        }}
      >
        {!video.is_draft && 
          <Typography variant="body1" sx={{ color: '#fff', mt: { xs: 1, sm: 0 } }}>
            {video.image_clips.length} Slide{video.image_clips.length > 1 ? 's' : ''}
          </Typography>
        }
      </Grid>

      <Grid item xs={20} sm={4} md={2} lg={2} xl={2} sx={{ display: { xs: video.is_draft ? 'none' : '', md: 'block' } }}>
        {!video.is_draft && 
          <Box sx={{ ...gridStyle, justifyContent: { xs: 'left', sm: 'center' }, mt: { xs: 1, sm: 0 } }}>
            {/* <Box sx={{ 
              mr: '30px',
              width: '17px',
              height: '17px',
              borderRadius: '30px',
              boxShadow: '0 3px 6px 0 rgba(159, 190, 157, 0.08)',
              backgroundColor: '#9ebe9d' }} /> */}
            <Typography variant="body1" sx={{ color: '#fff' }}>Ready</Typography>
          </Box>
        }
      </Grid>

      <Grid
        item
        xs={20} sm={3} md={2} lg={2} xl={2} 
        sx={{ 
          ...gridStyle,
          justifyContent: { xs: 'left', sm: 'center' },
          display: { xs: video.is_draft ? 'none' : '', md: 'block' }
        }}
      >
        {!video.is_draft && 
          <Box sx={playButtonStyle}>
            <PlayArrowIcon sx={{ mr: '5px' }} />
            <Typography variant="body1" sx={{ color: '#fff' }}>Play</Typography>
          </Box>
        }
      </Grid>

      <Grid item xs={20} sm={2} md={1} lg={1} xl={1} sx={{ ...gridStyle, justifyContent: 'center' }}>
        {video.is_draft && 
          <IconButton
            aria-label="delete"
            id="delete-button"
            onClick={(event) => handleDeleteVideo(event)}
          >
            <DeleteForeverIcon sx={{ color: '#fff' }} />
          </IconButton>
        }

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
                  onClick={(event) => option.action(event)} 
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