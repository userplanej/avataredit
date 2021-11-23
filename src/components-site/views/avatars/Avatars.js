import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PanoramaIcon from '@mui/icons-material/Panorama';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import CloseIcon from '@mui/icons-material/Close';

import { setShowBackdrop } from '../../../redux/backdrop/backdropSlice';

import { getAllAvatars } from '../../../api/avatar/avatar';

const avatarBoxStyle = {
  m: 1,
  p: 2,
  width: '80%',
  borderRadius: '6px',
  ':hover': {
    backgroundColor: '#3c4045'
  }
}

const Avatars = () => {
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [avatars, setAvatars] = useState([]);
  const [avatarSelected, setAvatarSelected] = useState(null);

  useEffect(() => {
    getAvatars();
  }, []);

  const getAvatars = async () => {
    dispatch(setShowBackdrop(true));
    
    await getAllAvatars().then((res) => {
      const avatars = res.data.body.rows;
      setAvatars(avatars);
      dispatch(setShowBackdrop(false));
    });
  }

  const handleClickOpen = (avatar) => {
    setAvatarSelected(avatar);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ width: '100%', height: '100%', mt: 14 }}>
      <Grid container sx={{ display: 'flex' }}>
        {avatars.map(avatar => {
          return (
            <Grid item key={avatar.avatar_id} xs={12} md={5} lg={4} xl={3} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box sx={avatarBoxStyle}>
                <Box sx={{ display: 'flex', justifyContent: 'center', cursor: 'pointer' }} onClick={() => handleClickOpen(avatar)}>
                  <Box 
                    sx={{ 
                      backgroundColor: '#fff',
                      width: '100%',
                      height: '230px',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center', 
                      justifyContent: 'center',
                      backgroundImage: avatar.avatar_dir !== null ? `url(${avatar.avatar_dir})` : '',
                      backgroundPosition: 'center', /* Center the image */
                      backgroundSize: 'cover'
                    }}
                  >
                    {(avatar.avatar_dir === null || avatar.avatar_dir === '') && <PanoramaIcon fontSize="large" />}
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                  <Typography variant="h5" color="#fff">{avatar.avatar_name}</Typography>
                  {/* <Box sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', cursor: 'pointer' }}>Create video <AddCircleIcon sx={{ ml: 1 }} /></Box> */}
                </Box>
              </Box>
            </Grid>
          );
        })}
      </Grid>

      <Dialog
        maxWidth="md"
        open={open}
        aria-labelledby="avatar-dialog-title"
        aria-describedby="avatar-dialog-description"
      >
        <DialogTitle id="avatar-dialog-title" sx={{ textAlign: 'right' }}>
          <CloseIcon fontSize="large" onClick={handleClose} sx={{ cursor: 'pointer', color: '#fff' }} />
        </DialogTitle>

        <DialogContent>
          <Box 
            sx={{ 
              background: '#f9f8fa',
              width: '100%', 
              height: '400px', 
              borderRadius: '6px',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundImage: avatarSelected && avatarSelected.avatar_dir !== null ? `url(${avatarSelected.avatar_dir})` : '',
              backgroundPosition: 'center', /* Center the image */
              backgroundSize: 'cover'
            }}
          >
            {avatarSelected && (avatarSelected.avatar_dir === null || avatarSelected.avatar_dir === '') && <PanoramaIcon fontSize="large" />}
          </Box>

          <Typography variant="h5" sx={{ my: 2, color: '#fff' }}>{avatarSelected && avatarSelected.avatar_name}</Typography>

          <Typography variant="subtitle1" sx={{ color: '#d3d9df' }}>
            {avatarSelected && avatarSelected.avatar_name} is one of our most versatile presenters. She is confident and her presentation style is suited to all types of content.
          </Typography>

          <Typography variant="subtitle1" sx={{ color: '#9a9a9a', my: 2 }}>Preferred languages</Typography>
          
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 4 }}>
            <Chip label="English" />
            <Chip label="German" />
            <Chip label="Spanish" />
            <Chip label="Italian" />
            <Chip label="French" />
          </Stack>
        </DialogContent>
        
        <DialogActions>
          <Button variant="contained" fullWidth onClick={handleClose}>
            Create video with this avatar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
 
export default Avatars;