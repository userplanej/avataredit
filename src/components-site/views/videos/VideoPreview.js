import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import axios from 'axios';

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
import BorderColorIcon from '@mui/icons-material/BorderColor';

import CustomInput from '../../inputs/CustomInput';
import ConfirmDialog from '../../dialog/ConfirmDialog';

import { setShowBackdrop } from '../../../redux/backdrop/backdropSlice';

import { deleteOutput, getOutputByVideoId, updateOutput } from '../../../api/output/output';
import { deleteImagePackage, getImagePackage, postImagePackage, updateImagePackage } from '../../../api/image/package';
import { postImageClip } from '../../../api/image/clip';
import { uploadFile } from '../../../api/s3';

import { pathnameEnum } from '../../constants/Pathname';

const labelStyle = {
  color: "#9a9a9a",
  mt: 3
}

const VideoPreview = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const routeMatchPreview = useRouteMatch([`${pathnameEnum.videos}/:id`, `${pathnameEnum.templates}/:id`]);
  const id = routeMatchPreview.params.id;

  const [isLoading, setIsLoading] = useState(true);
  const [video, setVideo] = useState(null);
  const [output, setOutput] = useState(null);
  const [title, setTitle] = useState('test');
  const [isEditTitle, setIsEditTitle] = useState(false);
  const [description, setDescription] = useState('test');
  const [isEditDescription, setIsEditDescription] = useState(false);
  const [openScriptDialog, setOpenScriptDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

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
      setOutput(video.output);
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
    a.download = `${title}.mp4`;
    a.click();
  }

  const handleDeleteVideo = async () => {
    await Promise.all([
      deleteImagePackage(id),
      deleteOutput(output.output_id)
    ]).then(() => {
      const path = video.is_template ? pathnameEnum.templates : pathnameEnum.videos;
      history.push(path);
    });
  }

  const handleOpenScriptDialog = () => {
    setOpenScriptDialog(true);
  }

  const handleCloseScriptDialog = () => {
    setOpenScriptDialog(false);
  }
  
  const handleOpenConfirmDialog = () => setOpenConfirmDialog(true);

  const handleCloseConfirmDialog = () => setOpenConfirmDialog(false);

  const handleCreateVideoFromTemplate = async () => {
    dispatch(setShowBackdrop(true));

    let packageId = null;
    let clipId = null;

    // Create package
    const user = JSON.parse(sessionStorage.getItem('user'));
    const imagePackage = {
      user_id: user.user_id,
      package_name: 'New video',
      is_draft: true,
      is_template: false
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
          const filename = `video-${packageId}-slide-${index}-${new Date().getTime()}`;
          const file = new File([blob], filename, { type: "image/png" });

          const formData = new FormData();
          formData.append('files', file);
          await uploadFile(formData, 'slide-thumbnail').then((res) => { 
            newLocation = res.data.body[0].file_dir;
          });
        });
        
        const imageClip = {
          package_id: packageId,
          background_type: slide.background_type,
          text_script: slide.text_script,
          html5_script: slide.html5_script,
          html5_dir: newLocation,
          avatar_pose: slide.avatar_pose,
          avatar_type: slide.avatar_type,
          avatar_size: slide.avatar_size,
          clip_order: slide.clip_order
        }
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
        history.push(pathnameEnum.editor + `/${packageId}`);
      });
    });
  }

  const handleDuplicateVideo = async () => {
    dispatch(setShowBackdrop(true));
    
    // Duplicate video/template
    let packageId = null;
    const newVideo = {
      package_name: video.is_template ? 'New template' : 'New video',
      is_draft: true,
      is_template: video.is_template,
      user_id: video.user_id
    }
    await postImagePackage(newVideo).then((res) => {
      packageId = res.data.body.package_id;
    });

    // Duplicate slides
    let firstClipId = null;
    video.image_clips.map(async (clip, index) => {
      const newSlide = {
        ...clip,
        clip_id: null,
        package_id: packageId
      }
      await postImageClip(newSlide).then((res) => {
        if (index === 0) {
          firstClipId = res.data.body.clip_id;
        }
      });
    });

    // Update video current clip_id
    await updateImagePackage(packageId, { clip_id: firstClipId }).then(() => {
      history.push(`${pathnameEnum.editor}/${packageId}`);
      dispatch(setShowBackdrop(false));
    });
  }

  return isLoading ? (
      <Container></Container>
    ) : (
      <Container maxWidth={false}>
        <Grid container sx={{ pb: 3 }}>
          <Grid item xs={12} lg={8} sx={{ mb: 4 }}>
            <Box sx={{ width: { xs: '98%', xl: '95%' } }}>
              <video controls style={{ width: '100%', borderRadius: '6px' }}>
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

            <Box sx={{ mt: 3 }}>
              <Link color="#df678c" onClick={handleOpenScriptDialog}>View scripts</Link>
            </Box>
          </Grid>
          
          <Grid item xs={12} lg={4} sx={{ p: 4, color: '#fff', backgroundColor: '#3c4045', height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              Enable {video.is_template ? 'template' : 'video'} sharing
              <Switch defaultChecked sx={{ mr: 1 }} />
            </Box>

            <Typography variant="subtitle1" sx={{ maxWidth: '300px' }}>
              Anyone with the link will be able to see this {video.is_template ? 'template' : 'video'}
            </Typography>

            {video.is_template ?
              (
                <Box sx={{ mt: 1 }}>
                  Shared templates can be duplicated by default.
                </Box>
              ) : (
                <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between' }}>
                  Allow duplicates
                  <Switch defaultChecked sx={{ mr: 1 }} />
                </Box>
              )
            }

            <Box sx={{ p: 2, mt: 2, backgroundColor: '#9a9a9a' }}>
              <Typography variant="subtitle1" color="#3c4045">Share your {video.is_template ? 'template' : 'video'}</Typography>

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
              <Typography variant="h6" color="#fff">{video.is_template ? 'Template' : 'Video'} options</Typography>

              <List>
                {!video.is_template &&
                  <ListItem disablePadding onClick={handleDownloadVideo}>
                    <ListItemButton>
                      <ListItemIcon>
                        <DownloadIcon sx={{ color: '#fff' }} />
                      </ListItemIcon>
                      <ListItemText primary="Download" />
                    </ListItemButton>
                  </ListItem>
                }

                {video.is_template &&
                  <ListItem disablePadding onClick={handleCreateVideoFromTemplate}>
                    <ListItemButton>
                      <ListItemIcon>
                        <AddCircleIcon sx={{ color: '#fff' }} />
                      </ListItemIcon>
                      <ListItemText primary="Create video" />
                    </ListItemButton>
                  </ListItem>
                }

                {/* {video.is_template &&
                  <ListItem disablePadding>
                    <ListItemButton>
                      <ListItemIcon>
                        <BorderColorIcon sx={{ color: '#fff' }} />
                      </ListItemIcon>
                      <ListItemText primary="Edit" />
                    </ListItemButton>
                  </ListItem>
                } */}

                <ListItem disablePadding onClick={handleDuplicateVideo}>
                  <ListItemButton>
                    <ListItemIcon>
                      <ContentCopyIcon sx={{ color: '#fff' }} />
                    </ListItemIcon>
                    <ListItemText primary="Duplicate" />
                  </ListItemButton>
                </ListItem>

                {!video.is_template &&
                  <ListItem disablePadding>
                    <ListItemButton>
                      <ListItemIcon>
                        <AddCircleIcon sx={{ color: '#fff' }} />
                      </ListItemIcon>
                      <ListItemText primary="Create template" />
                    </ListItemButton>
                  </ListItem>
                }

                <ListItem disablePadding onClick={handleOpenConfirmDialog}>
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

        <Dialog
          fullWidth
          maxWidth="sm"
          open={openScriptDialog}
          aria-labelledby="generate-video-dialog-title"
          aria-describedby="generate-video-dialog-description"
        >
          <DialogTitle id="generate-video-dialog-title" sx={{ textAlign: 'right' }}>
            <CloseIcon fontSize="large" onClick={handleCloseScriptDialog} sx={{ cursor: 'pointer', color: '#fff' }} />
          </DialogTitle>

          <DialogContent sx={{ pl: 5, pr: 15 }}>
            <Typography variant="h5" color="#fff" sx={{ mb: 2 }}>
              Scripts
            </Typography>
            <Box>
              {video.image_clips.map((clip, index) => (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ mr: 2 }}>{index + 1}</Typography>
                  <Typography color="#fff" variant="body1">{clip.text_script}</Typography>
                </Box>
              ))}
            </Box>
          </DialogContent>
          
          <DialogActions></DialogActions>
        </Dialog>

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
 
export default VideoPreview;