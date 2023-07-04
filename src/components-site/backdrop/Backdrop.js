import React from 'react';

import BackdropMui from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

/**
 * Display a backdrop with circular progress indicating that something is loading. 
 */
const Backdrop = (props) => {
  const { 
    // Boolean to display backdrop or not
    open
  } = props;

  return (
    <BackdropMui
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={open}
    >
      <CircularProgress color="inherit" />
    </BackdropMui>
  );
}
 
export default Backdrop;