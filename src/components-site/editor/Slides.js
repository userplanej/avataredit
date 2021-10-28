import React, { useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { Grid, Box } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Typography from '@mui/material/Typography';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

const slideContainerStyle = {
  width: '100%',
  height: '192px',
  margin: '16px 0px 18px',
  padding: '0',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center'
}

const slideActiveContainerStyle = {
  width: '100%',
  height: '192px',
  margin: '16px 0px 18px',
  padding: '0',
  backgroundColor: '#e8e9e9',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center'
}

const addSlideContainerStyle = {
  width: '100%',
  height: '128px',
  borderRadius: '6px',
  border: 'solid 2px #e8e9e9',
  backgroundColor: '#f9f8fa',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  ':hover': { 
    backgroundColor: 'rgba(232, 233, 233, 0.8)', 
    border: 'solid 2px #d1d1d1',
    cursor: 'pointer' 
  }
}

const btnAddTransitionStyle = {
  width: '90%',
  height: '32px',
  marginTop: '8px',
  borderRadius: '10px',
  backgroundColor: '#f9f8fa',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  border: '1px solid #f9f8fa'
}

const addTransitionTextStyle = {
  fontFamily: 'Omnes',
  fontSize: '14px',
  fontWeight: '500',
  fontStretch: 'normal',
  fontStyle: 'normal',
  lineHeight: 'normal',
  letterSpacing: 'normal',
  textAlign: 'center',
  color: '#5b5c62',
  whiteSpace: 'nowrap'

}

const Slides = () => {
  const [slidesData, setSlidesData] = useState([{ id: 1 }]);
  const [activeSlide, setActiveSlide] = useState(1);

  const addSlide = () => {
    const id = slidesData.length + 1;
    const newSlide = { id };
    setSlidesData([...slidesData, newSlide]);
    setActiveSlide(id);
  }

  return (
    <List sx={{ mt: '64px' }}>
      <Box sx={{ maxHeight: '700px', overflowY: 'auto' }}>
      {slidesData && slidesData.map((slide) => {
        return (
          <ListItem
            key={slide.id}
            sx={activeSlide === slide.id ? {...slideActiveContainerStyle} : { ...slideContainerStyle }}
          >
            <Grid container sx={{ borderLeft: '4px solid #df678c'}}>
              <Grid item md={1} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div>{slide.id}</div>
                <DragIndicatorIcon sx={{ mt: '28px' }} />
              </Grid>
              <Grid item md={11}>
                <div style={{ 
                  width: '90%',
                  height: '128px',
                  borderRadius: '6px',
                  backgroundColor: 'white'
                }}>
                </div>
              </Grid>
            </Grid>

            <Grid container>
              <Grid item md={1}></Grid>
              <Grid item md={11}>
                <button style={{ ...btnAddTransitionStyle }}>
                  <span style={{ ...addTransitionTextStyle }}>Add Transitions</span>
                </button>
              </Grid>
            </Grid>
          </ListItem>
        )
      })}
      </Box>

      <ListItem 
        // sx={{ ':hover': { backgroundColor: 'rgba(232, 233, 233, 0.7)', cursor: 'pointer' } }}
        onClick={() => addSlide()}
      >
        <Grid container>
          <Grid item md={1}></Grid>
          <Grid item md={10}>
            <Box sx={{ ...addSlideContainerStyle }}>
              <AddCircleIcon sx={{ color: '#0a1239', mb: '10px' }} />
              <div style={{ fontSize: '14px'}}>Add slide</div>
            </Box>
          </Grid>
        </Grid>
      </ListItem>
    </List>
  );
}
 
export default Slides;