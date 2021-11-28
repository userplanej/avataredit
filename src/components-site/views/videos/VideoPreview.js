import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ClickAwayListener, Grid, InputLabel, Link, Container, Switch, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
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

import { setShowBackdrop } from '../../../redux/backdrop/backdropSlice';

import { deleteOutput, getOutputByVideoId, updateOutput } from '../../../api/output/output';
import { deleteImagePackage, getImagePackage, updateImagePackage } from '../../../api/image/package';

import { pathnameEnum } from '../../constants/Pathname';

const labelStyle = {
  color: "#9a9a9a",
  mt: 3
}

const VideoPreview = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const routeMatchPreview = useRouteMatch(`${pathnameEnum.videos}/:id`);
  const id = routeMatchPreview.params.id;

  const [isLoading, setIsLoading] = useState(true);
  const [video, setVideo] = useState(null);
  const [output, setOutput] = useState(null);
  const [title, setTitle] = useState('test');
  const [isEditTitle, setIsEditTitle] = useState(false);
  const [description, setDescription] = useState('test');
  const [isEditDescription, setIsEditDescription] = useState(false);
  const [openScriptDialog, setOpenScriptDialog] = useState(false);

  useEffect(() => {
    dispatch(setShowBackdrop(true));
    
    Promise.all([
      loadVideo(id),
      loadOutput(id)
    ]).then(() => {
      dispatch(setShowBackdrop(false));
      setIsLoading(false);
    });
  }, []);

  const loadVideo = async (id) => {
    await getImagePackage(id).then((res) => {
      const video = res.data.body;
      setVideo(video);
      setTitle(video.package_name);
    });
  }

  const loadOutput = async (id) => {
    await getOutputByVideoId(id).then((res) => {
      const output = res.data.body.rows[0];
      setOutput(output);
      setDescription(output.description);
    });
  }

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
    saveVideoTitle();
  }

  const saveVideoTitle = async () => {
    await updateImagePackage(id, { package_name: title });
  }

  const handleLeaveEditDescription = () => {
    setIsEditDescription(false);
    saveOutputDescription();
  }

  const saveOutputDescription = async () => {
    await updateOutput(output.output_id, { description: description });
  }

  const handleDownloadVideo = () => {
    const a = document.createElement("a");
    a.href = output.video_dir;
    a.download = `${video.package_name}.mp4`;
    a.click();
  }

  const handleDeleteVideo = async () => {
    await Promise.all([
      deleteImagePackage(id),
      deleteOutput(output.output_id)
    ]).then(() => {
      history.push(pathnameEnum.videos);
    });
  }

  const handleOpenScriptDialog = () => {
    setOpenScriptDialog(true);
  }

  const handleCloseScriptDialog = () => {
    setOpenScriptDialog(false);
  }

  return isLoading ? (
      <Container></Container>
    ) : (
      <Container maxWidth={false}>
        <Grid container sx={{ pb: 3 }}>
          <Grid item xs={12} lg={8} sx={{ mb: 4 }}>
            <Box sx={{ width: { xs: '98%', xl: '95%' } }}>
              <video controls style={{ width: '100%', height: '500px', borderRadius: '6px' }}>
                <source src={output.video_dir} type="video/mp4" />
                <source type="video/webm" src={output.video_dir} />
              </video>
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

            {/* <Box sx={{ mt: 3 }}>
              <Link color="#df678c" onClick={handleOpenScriptDialog}>View scripts</Link>
            </Box> */}
          </Grid>
          
          <Grid item xs={12} lg={4} sx={{ p: 4, color: '#fff', backgroundColor: '#3c4045', height: '100%' }}>
            {/* <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              Enable video sharing
              <Switch defaultChecked sx={{ mr: 1 }} />
            </Box>

            <Typography variant="subtitle1" sx={{ maxWidth: '300px' }}>
              Anyone with the link will be able to see this video
            </Typography>

            <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between' }}>
              Allow duplicates
              <Switch defaultChecked sx={{ mr: 1 }} />
            </Box> */}

            {/* <Box sx={{ p: 2, mt: 2, backgroundColor: '#9a9a9a' }}>
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
            </Box> */}

            <Box sx={{ p: 2, mt: 2, border: '3px solid #9a9a99' }}>
              <Typography variant="h6" color="#fff">Video options</Typography>

              <List>
                <ListItem disablePadding onClick={handleDownloadVideo}>
                  <ListItemButton>
                    <ListItemIcon>
                      <DownloadIcon sx={{ color: '#fff' }} />
                    </ListItemIcon>
                    <ListItemText primary="Download" />
                  </ListItemButton>
                </ListItem>

                {/* <ListItem disablePadding>
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
                </ListItem> */}

                <ListItem disablePadding onClick={handleDeleteVideo}>
                  <ListItemButton>
                    <ListItemIcon>
                      <DeleteForeverIcon sx={{ color: '#fff' }} />
                    </ListItemIcon>
                    <ListItemText primary="Delete" />
                  </ListItemButton>
                </ListItem>
              </List>
            </Box>

            {/* <Box sx={{ mt: 3 }}>
              <Link color="#df678c" onClick={() => {}}>Issues with pronunciation or pause?</Link>
            </Box> */}
          </Grid>
        </Grid>

        {/* <Dialog
          maxWidth="md"
          open={openScriptDialog}
          aria-labelledby="generate-video-dialog-title"
          aria-describedby="generate-video-dialog-description"
        >
          <DialogTitle id="generate-video-dialog-title" sx={{ textAlign: 'right' }}>
            <CloseIcon fontSize="large" onClick={handleCloseScriptDialog} sx={{ cursor: 'pointer', color: '#fff' }} />
          </DialogTitle>

          <DialogContent sx={{ pl: 5, pr: 15 }}>
            <Box>
              
            </Box>
          </DialogContent>
          
          <DialogActions>
            <Button variant="contained" color="secondary" fullWidth onClick={handleCloseScriptDialog}>
              Close
            </Button>
          </DialogActions>
        </Dialog> */}
      </Container>
    );
}
 
export default VideoPreview;