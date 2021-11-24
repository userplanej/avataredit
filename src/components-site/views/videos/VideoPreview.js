import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ClickAwayListener, Grid, InputLabel, Link, Container, Switch, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import LinkIcon from '@mui/icons-material/Link';
import IosShareIcon from '@mui/icons-material/IosShare';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DownloadIcon from '@mui/icons-material/Download';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import CustomInput from '../../inputs/CustomInput';

const labelStyle = {
  color: "#9a9a9a",
  mt: 3
}

const VideoPreview = () => {
  
  const [title, setTitle] = useState('test');
  const [isEditTitle, setIsEditTitle] = useState(false);
  const [description, setDescription] = useState('test');
  const [isEditDescription, setIsEditDescription] = useState(false);

  const handleEditTitle = () => {
    setIsEditTitle(true);
  }

  const handleEditDescription = () => {
    setIsEditDescription(true);
  }

  const onChangeTitle = (value) => {
    setTitle(value);
  }

  const onChangeDescription = (value) => {
    setDescription(value);
  }

  const handleLeaveEditTitle = () => {
    setIsEditTitle(false);
  }

  const handleLeaveEditDescription = () => {
    setIsEditDescription(false);
  }

  return (
    <Container maxWidth={false}>
      <Grid container sx={{ pb: 3 }}>
        <Grid item xs={12} lg={8} sx={{ mb: 4 }}>
          <Box sx={{ width: { xs: '98%', xl: '95%' } }}>
            <video controls style={{ width: '100%', height: '500px', borderRadius: '6px' }}><source src={null} type="video/mp4" /></video>
          </Box>

          <InputLabel sx={labelStyle}>Title</InputLabel>
          {!isEditTitle && 
            <Typography variant="h6" sx={{ color: "#fff", display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={handleEditTitle}>
              {title} <EditIcon fontSize="small" sx={{ ml: 1 }} />
            </Typography>
          }
          {isEditTitle && 
            <ClickAwayListener onClickAway={handleLeaveEditTitle}>
              <Box sx={{ width: '50%' }}>
                <CustomInput 
                  value={title}
                  fullWidth
                  onChange={(event) => onChangeTitle(event.target.value)}
                  sx={{ backgroundColor: '#3c4045' }}
                />
              </Box>
            </ClickAwayListener>
          }
          
          <InputLabel sx={labelStyle}>Description</InputLabel>
          {!isEditDescription && 
            <Typography variant="h6" sx={{ color: "#fff", display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={handleEditDescription}>
              {description} <EditIcon fontSize="small" sx={{ ml: 1 }} />
            </Typography>
          }
          {isEditDescription && 
            <ClickAwayListener onClickAway={handleLeaveEditDescription}>
              <Box sx={{ width: '80%' }}>
                <CustomInput 
                  value={description}
                  fullWidth
                  onChange={(event) => onChangeDescription(event.target.value)}
                  sx={{ backgroundColor: '#3c4045' }}
                />
              </Box>
            </ClickAwayListener>
          }

          <Box sx={{ mt: 3 }}>
            <Link color="#df678c" onClick={() => {}}>View scripts</Link>
          </Box>
        </Grid>
        
        <Grid item xs={12} lg={4} sx={{ p: 4, color: '#fff', backgroundColor: '#3c4045' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            Enable video sharing
            <Switch defaultChecked sx={{ mr: 1 }} />
          </Box>

          <Typography variant="subtitle1" sx={{ maxWidth: '300px' }}>
            Anyone with the link will be able to see this video
          </Typography>

          <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between' }}>
            Allow duplicates
            <Switch defaultChecked sx={{ mr: 1 }} />
          </Box>

          <Box sx={{ p: 2, mt: 2, backgroundColor: '#9a9a9a' }}>
            <Typography variant="subtitle1" color="#3c4045">Share your video</Typography>

            <Grid container sx={{ mt: 1 }}>
              <Grid item xs={12} sm={10} lg={8.5} xl={9.5}>
                <Button 
                  variant="contained"
                  color="secondary"
                  startIcon={<LinkIcon />}
                  fullWidth
                  sx={{ maxWidth: 'none', color: '#fff', mr: 1, backgroundColor: '#3c4045', border: 'none' }}
                >
                  Copy shareable link
                </Button>
              </Grid>
              
              <Grid item xs={0.5}></Grid>

              <Grid item xs={12} sm={1.5} lg={3} xl={2} sx={{ mt: { xs: 1, sm: 0 } }}>
                <Button variant="contained" color="secondary" sx={{ color: '#fff', backgroundColor: '#d3d9de', border: 'none' }}>
                  <IosShareIcon />
                </Button>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ p: 2, mt: 2, border: '3px solid #9a9a99' }}>
            <Typography variant="h6" color="#fff">Video options</Typography>

            <List>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <DownloadIcon sx={{ color: '#fff' }} />
                  </ListItemIcon>
                  <ListItemText primary="Download" />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <ContentCopyIcon sx={{ color: '#fff' }} />
                  </ListItemIcon>
                  <ListItemText primary="Duplicate" />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <AddCircleIcon sx={{ color: '#fff' }} />
                  </ListItemIcon>
                  <ListItemText primary="Create template" />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <DeleteForeverIcon sx={{ color: '#fff' }} />
                  </ListItemIcon>
                  <ListItemText primary="Delete" />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>

          <Box sx={{ mt: 3 }}>
            <Link color="#df678c" onClick={() => {}}>Issues with pronunciation or pause?</Link>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
 
export default VideoPreview;