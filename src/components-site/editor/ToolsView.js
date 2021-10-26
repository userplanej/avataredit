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
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
    sx: { minWidth: '80px', fontSize: '10px' }
  };
}

const ToolsView = () => {
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
      sx={{ flexGrow: 1, display: 'flex', height: '100%' }}
    >
      <Grid item md={10} sx={{ mt: '10px' }}>
        <TabPanel value={value} index={0}>
          Select template
        </TabPanel>
        <TabPanel value={value} index={1}>
          Select avatar
        </TabPanel>
        <TabPanel value={value} index={2}>
          Select background
        </TabPanel>
        <TabPanel value={value} index={3}>
          Select text
        </TabPanel>
        <TabPanel value={value} index={4}>
          Select shape
        </TabPanel>
        <TabPanel value={value} index={5}>
          Select images
        </TabPanel>
        <TabPanel value={value} index={6}>
          Select music
        </TabPanel>
      </Grid>
      <Grid item md={2} sx={{ backgroundColor: '#f5f0fa', height: '100%', mt: '10px' }}>
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
          <Tab icon={makeIcon(0, <AutoAwesomeMosaicIcon sx={value === 0 ? {...iconActiveStyle} : {...iconStyle}} />)} label="Template" {...a11yProps(0)} />
          <Tab icon={makeIcon(1, <AccountBoxIcon sx={value === 1 ? {...iconActiveStyle} : {...iconStyle}} />)} label="Avatar" {...a11yProps(1)} />
          <Tab icon={makeIcon(2, <TextureIcon sx={value === 2 ? {...iconActiveStyle} : {...iconStyle}} />)} label="Background" {...a11yProps(2)} />
          <Tab icon={makeIcon(3, <TextFieldsIcon sx={value === 3 ? {...iconActiveStyle} : {...iconStyle}} />)} label="Text" {...a11yProps(3)} />
          <Tab icon={makeIcon(4, <CategoryIcon sx={value === 4 ? {...iconActiveStyle} : {...iconStyle}} />)} label="Shapes" {...a11yProps(4)} />
          <Tab icon={makeIcon(5, <ImageIcon sx={value === 5 ? {...iconActiveStyle} : {...iconStyle}} />)} label="Images" {...a11yProps(5)} />
          <Tab icon={makeIcon(6, <MusicNoteIcon sx={value === 6 ? {...iconActiveStyle} : {...iconStyle}} />)} label="Music" {...a11yProps(6)} />
        </Tabs>
      </Grid>
    </Grid>
  );
}
 
export default ToolsView;