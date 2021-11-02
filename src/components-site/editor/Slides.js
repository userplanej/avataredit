import React, { useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { Grid, Box } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

const slideContainerStyle = {
  width: '100%',
  height: '192px',
  margin: '16px 0px 18px',
  padding: '0',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  ':hover': {
    backgroundColor: 'rgba(232, 233, 233, 0.7)',
  }
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
  width: '80%',
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
  width: '100%',
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

const Slides = (props) => {
  const [slidesData, setSlidesData] = useState([{ id: 1, objects: [] }]);
  const [activeSlide, setActiveSlide] = useState(1);

  const addSlide = () => {
    const currentSlide = slidesData[activeSlide - 1];
    saveSlide(currentSlide);

    const id = slidesData.length + 1;
    const newSlide = { id, objects: [] };
    setSlidesData([...slidesData, newSlide]);

    props.canvasRef.handler.clear();
    props.canvasRef.handler.importJSON(newSlide.objects);
    setActiveSlide(id);
  }

  const saveSlide = (slide) => {
    const objects = props.canvasRef.handler.exportJSON();
    const currentObjects = slide.objects;
    
    const newObjects = [];
    objects.map(obj => {
      if (obj.id === 'workarea') {
        const workarea = currentObjects.find(obj => obj.id === 'workarea');
        if (workarea) {
          return;
        }
      }
      newObjects.push(obj);
    });

    slide.objects = newObjects;
  }

  const loadSlide = (id) => {
    if (id === activeSlide) {
      return;
    }
    const currentSlide = slidesData[activeSlide - 1];
    saveSlide(currentSlide);

    const slideToLoad = slidesData.find(slide => slide.id === id);
    if (slideToLoad) {
      props.canvasRef.handler.clear();
      props.canvasRef.handler.importJSON(slideToLoad.objects);
    }

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
            onClick={() => loadSlide(slide.id)}
          >
            <Grid container sx={activeSlide === slide.id ? { borderLeft: '4px solid #df678c'} : null}>
              <Grid item md={2} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div>{slide.id}</div>
                <DragIndicatorIcon sx={{ mt: '28px', cursor: 'grab' }} />
              </Grid>
              <Grid item md={10}>
                <div style={{ 
                  width: '100%',
                  height: '128px',
                  borderRadius: '6px',
                  backgroundColor: 'white'
                }}>
                </div>
              </Grid>
            </Grid>

            <Grid container>
              <Grid item md={2}></Grid>
              <Grid item md={10}>
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
        sx={{ display: 'flex', justifyContent: 'center' }}
        onClick={() => addSlide()}
      >
        <Box sx={{ ...addSlideContainerStyle }}>
          <AddCircleIcon sx={{ color: '#0a1239', mb: '10px' }} />
          <div style={{ fontSize: '14px'}}>Add slide</div>
        </Box>
      </ListItem>
    </List>
  );
}
 
export default Slides;