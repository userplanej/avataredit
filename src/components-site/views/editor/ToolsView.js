import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import FlipToBackIcon from '@mui/icons-material/FlipToBack';
import FlipToFrontIcon from '@mui/icons-material/FlipToFront';

import { setActiveObject } from '../../../redux/canvas/canvasSlice';
import { setActiveTab } from '../../../redux/toolbar/toolbarSlice';

function TabPanel(props) {
  const { children, value, index, name, ...other } = props;

  return (
    <div
      key={name.concat('-', index)}
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
    sx: { fontSize: '15px', mt: 1 }
  };
}

const ToolsView = (props) => {
  const dispatch = useDispatch();
  const activeObject = useSelector((state) => state.canvas.activeObject);
  const activeTab = useSelector((state) => state.toolbar.activeTab);

  const [avatarTab, setAvatarTab] = useState(0);
  const [backgroundTab, setBackgroundTab] = useState(0);
  const [imageTab, setImageTab] = useState(0);

  useEffect(() => {
    dispatch(setActiveTab(0));
  }, []);

  const handleChange = (event, newValue) => {
    dispatch(setActiveTab(newValue));
    dispatch(setActiveObject(null));
  }

  const handleChangeAvatarTab = (event, newValue) => {
    setAvatarTab(newValue);
  }

  const handleChangeBackgroundTab = (event, newValue) => {
    setBackgroundTab(newValue);
  }

  const handleChangeImageTab = (event, newValue) => {
    setImageTab(newValue);
  }

  const renderMoveButtons = () => {
    const { canvasRef } = props;
    return (
      <Box sx={{ mt: 1 }}>
        <Typography variant="h6">Move</Typography>
        <Box sx={{ display: 'flex', mt: 1 }}>
          <Button 
            variant="contained" 
            color="secondary" 
            startIcon={<FlipToBackIcon />} 
            onClick={() => canvasRef.handler.sendToBack()}
            sx={{ backgroundColor: '#e8e9e9', border: 'none', color: '#202427', mr: 1 }}
          >
            Back
          </Button>
          <Button 
            variant="contained" 
            color="secondary" 
            startIcon={<FlipToBackIcon />} 
            onClick={() => canvasRef.handler.sendBackwards()}
            sx={{ backgroundColor: '#e8e9e9', border: 'none', color: '#202427', mr: 1 }}
          >
            Backward
          </Button>
          <Button 
            variant="contained" 
            color="secondary" 
            startIcon={<FlipToFrontIcon />} 
            onClick={() => canvasRef.handler.bringForward()}
            sx={{ backgroundColor: '#e8e9e9', border: 'none', color: '#202427', mr: 1 }}
          >
            Forward
          </Button>
          <Button 
            variant="contained" 
            color="secondary" 
            startIcon={<FlipToFrontIcon />} 
            onClick={() => canvasRef.handler.bringToFront()}
            sx={{ backgroundColor: '#e8e9e9', border: 'none', color: '#202427' }}
          >
            Front
          </Button>
        </Box>
      </Box>
    );
  }

  const renderFormat = () => {
    let title = '';
    if (activeObject) {
      switch (activeObject.type) {
        case 'textbox':
          title = 'Text format';
          break;
        case 'shape':
          title = 'Shape format';
          break;
        default:
          break;
      }
    }
    return (
      <Box>
        <Typography variant="h5" sx={{ mb: 2 }}>{title}</Typography>

        <hr />
        
        {renderMoveButtons()}
        
        {/* <Typography variant="h6">Layout</Typography>
        <Box>
          
        </Box> */}
      </Box>
    );
  }

  return (
    <Grid container sx={{ height: '100%', justifyContent: 'end' }}>
      <Grid item xs={8} md={8} lg={8} xl={9} sx={{ backgroundColor: '#3c4045' }}>
        <TabPanel name="main" value={activeTab} index={0}>
          <Typography variant="h6" sx={{ mb: '10px' }}>Select template</Typography>
        </TabPanel>

        <TabPanel name="main" value={activeTab} index={1}>
          <Typography variant="h6" sx={{ mb: '10px' }}>Select avatar, size and alignment</Typography>
          <Box sx={{ height: '600px', maxHeight: '550px', overflowY: 'auto' }}>{props.avatars}</Box>

          <Box sx={{ width: '100%' }}>
            <Box sx={{ width: '100%', borderBottom: '1px solid #fff' }}>
              <Tabs 
                value={avatarTab} 
                variant="fullWidth" 
                scrollButtons="auto" 
                onChange={handleChangeAvatarTab} 
                aria-label="avatars-tabs"
              >
                <Tab label="Full body" />
                <Tab label="Circle" />
                <Tab label="Voice only" />
              </Tabs>
            </Box>
            <TabPanel name="avatar" value={avatarTab} index={0}>Full body</TabPanel>
            <TabPanel name="avatar" value={avatarTab} index={1}>Circle</TabPanel>
            <TabPanel name="avatar" value={avatarTab} index={2}>Voice only</TabPanel>
          </Box>
        </TabPanel>

        <TabPanel name="main" value={activeTab} index={2}>
          <Typography variant="h6" sx={{ mb: '10px' }}>Select background</Typography>
          <Box sx={{ width: '100%' }}>
            <Box sx={{ width: '100%', borderBottom: '1px solid #fff' }}>
              <Tabs value={backgroundTab} variant="fullWidth" scrollButtons="auto" onChange={handleChangeBackgroundTab} aria-label="backgrounds-tabs">
                <Tab label="Colors" />
                <Tab label="Images" />
                <Tab label="Videos" />
                <Tab label="Uploads" />
              </Tabs>
            </Box>
            <TabPanel name="background" value={backgroundTab} index={0}>{props.backgroundsColors}</TabPanel>
            <TabPanel name="background" value={backgroundTab} index={1}>{props.backgroundsImagesDefault}</TabPanel>
            <TabPanel name="background" value={backgroundTab} index={2}>Videos</TabPanel>
            <TabPanel name="background" value={backgroundTab} index={3}>{props.backgroundsImagesUploaded}</TabPanel>
          </Box>
        </TabPanel>

        <TabPanel name="main" value={activeTab} index={3}>
          <Typography variant="h6" sx={{ mb: '10px' }}>Text</Typography>
          {props.texts}
        </TabPanel>

        <TabPanel name="main" value={activeTab} index={4}>
          <Typography variant="h6" sx={{ mb: '10px' }}>Select shape</Typography>
          {props.shapes}
        </TabPanel>

        <TabPanel name="main" value={activeTab} index={5}>
          <Typography variant="h6" sx={{ mb: '10px' }}>Select images</Typography>
          <Box sx={{ width: '100%' }}>
            <Box sx={{ width: '100%', borderBottom: '1px solid #fff' }}>
              <Tabs value={imageTab} onChange={handleChangeImageTab} aria-label="images-tabs">
                <Tab label="Images" />
                <Tab label="Uploads" />
              </Tabs>
            </Box>
            <TabPanel name="image" value={imageTab} index={0}>{props.imagesDefault}</TabPanel>
            <TabPanel name="image" value={imageTab} index={1}>{props.imagesUploaded}</TabPanel>
          </Box>
        </TabPanel>

        <TabPanel name="main" value={activeTab} index={6}>
          <Typography variant="h6">Select music</Typography>
        </TabPanel>

        <TabPanel name="main" value={activeTab} index={7}>
          {renderFormat()}
        </TabPanel>
      </Grid>

      <Grid item xs={2} md={4} lg={3} xl={2} sx={{ backgroundColor: '#30353a', height: '100%' }}>
        <Tabs
          orientation="vertical"
          indicatorColor="secondary"
          value={activeTab}
          onChange={handleChange}
          aria-label="tools tabs"
          sx={{ 
            mt: 2,
            '& .MuiTab-root': {
              backgroundColor: '#30353a'
            },
            '& .Mui-selected': {
              backgroundColor: '#3c4045',
              color: '#fff'
            },
            '& .MuiTabs-scroller': {
              width: '100%'
            },
            '& .MuiTabs-indicator': {      
              width: '0px'
            }
          }}
        >
          <Tab label="Template" {...a11yProps(0)} />
          <Tab label="Avatar" {...a11yProps(1)} />
          <Tab label="Background" {...a11yProps(2)} />
          <Tab label="Text" {...a11yProps(3)} />
          <Tab label="Shapes" {...a11yProps(4)} />
          <Tab label="Images" {...a11yProps(5)} />
          <Tab label="Music" {...a11yProps(6)} />
          {activeObject && <Tab label="Format" {...a11yProps(7)} />}
        </Tabs>
      </Grid>
    </Grid>
  );
}

export default ToolsView;