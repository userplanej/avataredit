import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

import { setActiveObject } from '../../redux/canvas/canvasSlice';
import { setActiveTab } from '../../redux/toolbar/toolbarSlice';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import AutoAwesomeMosaicIcon from '@mui/icons-material/AutoAwesomeMosaic';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import ImageIcon from '@mui/icons-material/Image';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import CategoryIcon from '@mui/icons-material/Category';
import TextureIcon from '@mui/icons-material/Texture';
import FormatPaintIcon from '@mui/icons-material/FormatPaint';

import { TabStyle } from '../Styles';
import CommonButton from '../buttons/CommonButton';

const iconContainerStyle = {
  minWidth: '0px',
  width: '32px',
  height: '32px',
  padding: '8px',
  borderRadius: '6px',
  backgroundColor: '#e8dff4',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}

const iconContainerActiveStyle = {
  minWidth: '0px',
  width: '32px',
  height: '32px',
  padding: '8px',
  borderRadius: '6px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#4f4081'
}

const iconStyle = {
  color: '#4f4081'
}

const iconActiveStyle = {
  color: '#df678c'
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      key={index}
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

function a11yProps(index, value) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
    sx: { minWidth: '80px', fontSize: '12px', backgroundColor: value === index ? '#e8dff4' : '' }
  };
}

const ToolsView = (props) => {
  const dispatch = useDispatch();
  const activeObject = useSelector((state) => state.canvas.activeObject);
  const activeTab = useSelector((state) => state.toolbar.activeTab);

  const [backgroundTab, setBackgroundTab] = useState(0);

  const makeIcon = (index, icon) => {
    return (
      <Box key={index} sx={activeTab === index ? {...iconContainerActiveStyle} : {...iconContainerStyle}}>
        {icon}
      </Box>
    )
  }

  const handleChange = (event, newValue) => {
    dispatch(setActiveTab(newValue));
    dispatch(setActiveObject(null));
  }

  const handleChangeBackgroundTab = (event, newValue) => {
    setBackgroundTab(newValue);
  }

  const renderMoveButtons = () => {
    const { canvasRef } = props;
    return (
      <Box sx={{ mt: '20px' }}>
        <Typography variant="h6">Move</Typography>
        <Box sx={{ display: 'flex' }}>
          <CommonButton text="Back" onClick={() => canvasRef.handler.sendToBack()} />
          <CommonButton text="Backward" onClick={() => canvasRef.handler.sendBackwards()} />
          <CommonButton text="Forward" onClick={() => canvasRef.handler.bringForward()} />
          <CommonButton text="Front" onClick={() => canvasRef.handler.bringToFront()} />
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
        <Typography variant="h5">{title}</Typography>
        {renderMoveButtons()}
        {/* <Typography variant="h6">Layout</Typography>
        <Box>
          
        </Box> */}
      </Box>
    );
  }

  const sendTest = () => {
    const { canvasRef } = props;
    const canvasObjects = canvasRef.handler.getObjects();
    let dataToSend = {
      lifecycleName: 'Studio_Main_Lifecycle',
      payload: {
        apiId: 'ryu',
        apiKey: 'd0cad9547b9c4a65a5cdfe50072b1588',
        objects: canvasObjects[0].toObject()
      },
      catalogInstanceName: 'Studio_Main_Catalog',
      target: 'SoftwareCatalogInstance',
      async: false
    };

    let objects = [];
    // canvasObjects.map(object => {
    //   objects.push(object.toObject());
    // });
    // dataToSend.payload.objects = objects;

    console.log(dataToSend.payload.objects)

    const url = 'http://serengeti.maum.ai/api.app/app/v2/handle/catalog/instance/lifecycle/executes';
    const headers = {
      AccessKey: 'SerengetiAdministrationAccessKey',
      SecretKey: 'SerengetiAdministrationSecretKey',
      LoginId: 'maum-orchestra-com'
    }

    axios({
      method: 'post',
      url: url, 
      data: dataToSend,
      headers: headers
    });
  }

  return (
    <Grid
      container
      sx={{ flexGrow: 1, display: 'flex', height: '100%', backgroundColor: '#e8dff4', mt: '64px' }}
    >
      <Grid item md={11}>
        <TabPanel value={activeTab} index={0}>
          <Typography variant="h5">Select template</Typography>
          <Button onClick={sendTest}>Send to minds</Button>
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <Typography variant="h5">Select avatar, size and alignment</Typography>
          {props.avatars}
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <Typography variant="h5" sx={{ mb: '10px' }}>Select background</Typography>
          <Box sx={{ width: '100%' }}>
            <Box sx={{ width: '100%' }}>
              <Tabs value={backgroundTab} onChange={handleChangeBackgroundTab} aria-label="backgrounds-tabs" sx={TabStyle}>
                <Tab label="Colors"  />
                <Tab label="Images" />
                <Tab label="Videos" />
                <Tab label="Uploads" />
              </Tabs>
            </Box>
            <TabPanel value={backgroundTab} index={0}>{props.backgroundsColors}</TabPanel>
            <TabPanel value={backgroundTab} index={1}>{props.backgroundsImages}</TabPanel>
            <TabPanel value={backgroundTab} index={2}>Videos</TabPanel>
            <TabPanel value={backgroundTab} index={3}>Uploads</TabPanel>
          </Box>
        </TabPanel>

        <TabPanel value={activeTab} index={3}>
          <Typography variant="h5" sx={{ mb: '10px' }}> Select text</Typography>
          {props.texts}
        </TabPanel>

        <TabPanel value={activeTab} index={4}>
          <Typography variant="h5" sx={{ mb: '10px' }}>Select shape</Typography>
          {props.shapes}
        </TabPanel>

        <TabPanel value={activeTab} index={5}>
          <Typography variant="h5" sx={{ mb: '10px' }}>Select images</Typography>
          {props.images}
        </TabPanel>

        <TabPanel value={activeTab} index={6}>
          <Typography variant="h5">Select music</Typography>
        </TabPanel>

        <TabPanel value={activeTab} index={7}>
          {renderFormat()}
        </TabPanel>
      </Grid>

      <Grid item md={2} sx={{ backgroundColor: '#f5f0fa', height: '100%' }}>
        <Tabs
          orientation="vertical"
          indicatorColor="secondary"
          value={activeTab}
          onChange={handleChange}
          aria-label="tools tabs"
          sx={{ 
            borderRight: 1, 
            borderColor: 'divider',
            '& .MuiTabs-scroller': {
              width: '100%'
            }
          }}
        >
          <Tab icon={makeIcon(0, <AutoAwesomeMosaicIcon sx={activeTab === 0 ? {...iconActiveStyle} : {...iconStyle}} />)} label="Template" {...a11yProps(0, activeTab)} />
          <Tab icon={makeIcon(1, <AccountBoxIcon sx={activeTab === 1 ? {...iconActiveStyle} : {...iconStyle}} />)} label="Avatar" {...a11yProps(1, activeTab)} />
          <Tab icon={makeIcon(2, <TextureIcon sx={activeTab === 2 ? {...iconActiveStyle} : {...iconStyle}} />)} label="Background" {...a11yProps(2, activeTab)} />
          <Tab icon={makeIcon(3, <TextFieldsIcon sx={activeTab === 3 ? {...iconActiveStyle} : {...iconStyle}} />)} label="Text" {...a11yProps(3, activeTab)} />
          <Tab icon={makeIcon(4, <CategoryIcon sx={activeTab === 4 ? {...iconActiveStyle} : {...iconStyle}} />)} label="Shapes" {...a11yProps(4, activeTab)} />
          <Tab icon={makeIcon(5, <ImageIcon sx={activeTab === 5 ? {...iconActiveStyle} : {...iconStyle}} />)} label="Images" {...a11yProps(5, activeTab)} />
          <Tab icon={makeIcon(6, <MusicNoteIcon sx={activeTab === 6 ? {...iconActiveStyle} : {...iconStyle}} />)} label="Music" {...a11yProps(6, activeTab)} />
          {activeObject && <Tab icon={makeIcon(7, <FormatPaintIcon sx={activeTab === 7 ? {...iconActiveStyle} : {...iconStyle}} />)} label="Format" {...a11yProps(7, activeTab)} />}
        </Tabs>
      </Grid>
    </Grid>
  );
}

export default ToolsView;