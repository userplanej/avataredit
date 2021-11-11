import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PanoramaIcon from '@mui/icons-material/Panorama';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import CloseIcon from '@mui/icons-material/Close';

const avatarBoxStyle = {
  m: 1,
  p: 2,
  width: '80%',
  borderRadius: '6px',
  ':hover': {
    backgroundColor: '#3c4045'
  }
}

const data = [
  {
    id: 1,
    src: '',
    name: 'Mia'
  },
  {
    id: 2,
    src: '',
    name: 'Kim'
  },
  {
    id: 3,
    src: '',
    name: 'Isabella'
  },
  {
    id: 4,
    src: '',
    name: 'Sofia'
  },
  {
    id: 5,
    src: '',
    name: 'Sofia'
  },
  {
    id: 6,
    src: '',
    name: 'Sofia'
  },
  {
    id: 7,
    src: '',
    name: 'Sofia'
  },
  {
    id: 8,
    src: '',
    name: 'Sofia'
  },
  {
    id: 9,
    src: '',
    name: 'Sofia'
  },
  {
    id: 10,
    src: '',
    name: 'Sofia'
  }
]

const Avatars = () => {
  const [open, setOpen] = useState(false);
  const [avatar, setAvatar] = useState(null);

  const handleClickOpen = (avatar) => {
    setAvatar(avatar);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ width: '100%', height: '100%', mt: 14 }}>
      <Grid container sx={{ display: 'flex' }}>
        {data.map(avatar => {
          return (
            <Grid item key={avatar.id} xs={12} md={5} lg={4} xl={3} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box sx={avatarBoxStyle}>
                <Box sx={{ display: 'flex', justifyContent: 'center', cursor: 'pointer' }} onClick={() => handleClickOpen(avatar)}>
                  <Box sx={{ backgroundColor: '#fff', width: '100%', height: '230px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {(avatar.src === null || avatar.src === '') && <PanoramaIcon fontSize="large" />}
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                  <Typography variant="h5" color="#fff">{avatar.name}</Typography>
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
        onClose={handleClose}
        aria-labelledby="avatar-dialog-title"
        aria-describedby="avatar-dialog-description"
      >
        <DialogTitle id="avatar-dialog-title" sx={{ textAlign: 'right' }}>
          <CloseIcon fontSize="large" onClick={handleClose} sx={{ cursor: 'pointer', color: '#fff' }} />
        </DialogTitle>

        <DialogContent>
          <DialogContentText id="avatar-dialog-description">
            <Box sx={{ background: '#f9f8fa', width: '100%', height: '400px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {avatar && (avatar.src === null || avatar.src === '') && <PanoramaIcon fontSize="large" />}
            </Box>

            <Typography variant="h5" sx={{ my: 2, color: '#fff' }}>{avatar && avatar.name} Avatar</Typography>

            <Typography variant="subtitle1" sx={{ color: '#d3d9df' }}>
              {avatar && avatar.name} is one of our most versatile presenters. She is confident and her presentation style is suited to all types of content.
            </Typography>

            <Typography variant="subtitle1" sx={{ color: '#9a9a9a', my: 2 }}>Preferred languages</Typography>
            
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 4 }}>
              <Chip label="English" />
              <Chip label="German" />
              <Chip label="Spanish" />
              <Chip label="Italian" />
              <Chip label="French" />
            </Stack>
          </DialogContentText>
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