import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import AutoAwesomeMosaicIcon from '@mui/icons-material/AutoAwesomeMosaic';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import ImageIcon from '@mui/icons-material/Image';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import CategoryIcon from '@mui/icons-material/Category';
import TextureIcon from '@mui/icons-material/Texture';

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
  const [value, setValue] = useState(0);

  const makeIcon = (index, icon) => {
    return (
      <Box sx={value === index ? {...iconContainerActiveStyle} : {...iconContainerStyle}}>
        {icon}
      </Box>
    )
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Grid
      container
      sx={{ flexGrow: 1, display: 'flex', height: '100%', backgroundColor: '#e8dff4', mt: '64px' }}
    >
      <Grid item md={11}>
        <TabPanel value={value} index={0}>
          <Typography variant="h5">Select template</Typography>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Typography variant="h5">Select avatar</Typography>
          {props.avatars}
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Typography variant="h5" sx={{ mb: '10px' }}>Select background</Typography>
          {props.backgrounds}
        </TabPanel>
        <TabPanel value={value} index={3}>
          <Typography variant="h5" sx={{ mb: '10px' }}> Select text</Typography>
          {props.texts}
        </TabPanel>
        <TabPanel value={value} index={4}>
          <Typography variant="h5" sx={{ mb: '10px' }}>Select shape</Typography>
          {props.shapes}
        </TabPanel>
        <TabPanel value={value} index={5}>
          <Typography variant="h5" sx={{ mb: '10px' }}>Select images</Typography>
          {props.images}
        </TabPanel>
        <TabPanel value={value} index={6}>
          <Typography variant="h5">Select music</Typography>
        </TabPanel>
      </Grid>
      <Grid item md={2} sx={{ backgroundColor: '#f5f0fa', height: '100%' }}>
        <Tabs
          orientation="vertical"
          indicatorColor="secondary"
          value={value}
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
          <Tab icon={makeIcon(0, <AutoAwesomeMosaicIcon sx={value === 0 ? {...iconActiveStyle} : {...iconStyle}} />)} label="Template" {...a11yProps(0, value)} />
          <Tab icon={makeIcon(1, <AccountBoxIcon sx={value === 1 ? {...iconActiveStyle} : {...iconStyle}} />)} label="Avatar" {...a11yProps(1, value)} />
          <Tab icon={makeIcon(2, <TextureIcon sx={value === 2 ? {...iconActiveStyle} : {...iconStyle}} />)} label="Background" {...a11yProps(2, value)} />
          <Tab icon={makeIcon(3, <TextFieldsIcon sx={value === 3 ? {...iconActiveStyle} : {...iconStyle}} />)} label="Text" {...a11yProps(3, value)} />
          <Tab icon={makeIcon(4, <CategoryIcon sx={value === 4 ? {...iconActiveStyle} : {...iconStyle}} />)} label="Shapes" {...a11yProps(4, value)} />
          <Tab icon={makeIcon(5, <ImageIcon sx={value === 5 ? {...iconActiveStyle} : {...iconStyle}} />)} label="Images" {...a11yProps(5, value)} />
          <Tab icon={makeIcon(6, <MusicNoteIcon sx={value === 6 ? {...iconActiveStyle} : {...iconStyle}} />)} label="Music" {...a11yProps(6, value)} />
        </Tabs>
      </Grid>
    </Grid>
  );
}
 
export default ToolsView;