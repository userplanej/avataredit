import React, { useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { Grid, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
// import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import PanoramaIcon from '@mui/icons-material/Panorama';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const slideContainerStyle = {
  width: '100%',
  height: '192px',
  margin: '5px 0px 5px',
  padding: '0',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  // ':hover': {
  //   backgroundColor: 'rgba(232, 233, 233, 0.7)',
  // }
}

// const slideActiveContainerStyle = {
//   width: '100%',
//   height: '192px',
//   margin: '16px 0px 18px',
//   padding: '0',
//   backgroundColor: '#e8e9e9',
//   display: 'flex',
//   flexDirection: 'column',
//   alignItems: 'center',
//   justifyContent: 'center'
// }

const addSlideContainerStyle = {
  width: '100%',
  height: '128px',
  border: 'solid 2px #e8e9e9',
  color: '#fff',
  backgroundColor: '#3c4045',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  ':hover': { 
    backgroundColor: 'rgba(232, 233, 233, 0.3)', 
    border: 'solid 2px #d1d1d1',
    cursor: 'pointer' 
  }
}

const btnAddTransitionStyle = {
  width: '100%',
  height: '32px',
  marginTop: '8px',
  borderRadius: '4px',
  backgroundColor: '#3c4045',
  color: '#fff',
  textTransform: 'none',
  ':hover': {
    backgroundColor: 'rgba(232, 233, 233, 0.3)', 
  }
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

    props.canvasRef.handler.workareaHandler.setImage(null, false);
    props.canvasRef.handler.workareaHandler.setWorkareaBackgroundColor('#e8e9e9');
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
    <List>
      <Box sx={{ maxHeight: '650px', overflowY: 'auto' }}>
      {slidesData && slidesData.map((slide) => {
        const isActive = activeSlide === slide.id;
        return (
          <ListItem
            key={slide.id}
            sx={slideContainerStyle}
            // sx={isActive ? slideActiveContainerStyle : slideContainerStyle}
            onClick={() => loadSlide(slide.id)}
          >
            <Grid container /*sx={isActive ? { borderLeft: '4px solid #df678c' } : null}*/>
              <Grid item xs={1} md={1} xl={1} sx={{ px: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#fff' }}>
                <Box>{slide.id}</Box>
                {/* <DragIndicatorIcon sx={{ mt: '28px', cursor: 'grab' }} /> */}
              </Grid>
              
              <Grid item xs={10} md={9} xl={9}>
                <Box sx={{ 
                  width: '100%',
                  height: '128px',
                  border: !isActive ? '1px solid #e8e9e9' : null,
                  borderRadius: '6px',
                  backgroundColor: '#fff',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <PanoramaIcon />
                </Box>
              </Grid>
            </Grid>

            <Grid container /*sx={isActive ? { borderLeft: '4px solid #e8e9e9'} : null}*/>
              <Grid item xs={1} md={1} xl={1} sx={{ px: 2 }}></Grid>
              <Grid item xs={10} md={9} xl={9}>
                <Button variant="contained" variant="secondary" sx={btnAddTransitionStyle}>
                  Add transitions
                </Button>
              </Grid>
            </Grid>
          </ListItem>
        )
      })}
      </Box>

      <ListItem 
        sx={{ ...slideContainerStyle, mt: 0}}
        onClick={() => addSlide()}
      >
        <Grid container>
          <Grid item xs={1} md={1} xl={1} sx={{ px: 2 }}></Grid>

          <Grid item xs={10} md={9} xl={9} sx={addSlideContainerStyle}>
            <AddIcon sx={{ color: '#fff', mb: '10px', fontSize: '2rem' }} />
            <Typography sx={{ fontSize: '14px'}}>Add slides</Typography>
          </Grid>
        </Grid>
      </ListItem>
    </List>
  );
}
 
export default Slides;