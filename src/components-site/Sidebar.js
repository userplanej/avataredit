import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import HomeIcon from '@mui/icons-material/Home';
import VideocamIcon from '@mui/icons-material/Videocam';
import AutoAwesomeMosaicIcon from '@mui/icons-material/AutoAwesomeMosaic';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import SettingsIcon from '@mui/icons-material/Settings';
import Stack from '@mui/material/Stack';

import { setDrawerWidth, setIsMinimal, setPathName } from '../redux/navigation/navigationSlice';
import { drawerMinWidth, drawerMaxWidth } from './constants/Drawer';

const iconContainerStyle = {
  minWidth: '0px',
  width: '32px',
  height: '32px',
  margin: '0 16px 0 27px',
  padding: '8px',
  borderRadius: '6px',
  backgroundColor: '#e8dff4',
  alignItems: 'center',
  justifyContent: 'center'
}

const iconContainerActiveStyle = {
  minWidth: '0px',
  width: '32px',
  height: '32px',
  margin: '0 16px 0 27px',
  padding: '8px',
  borderRadius: '6px',
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

const DrawerItems = ({ active, onClickMenu, isMinimal }) => {
  const keys = {
    home: 'home',
    videos: 'videos',
    templates: 'templates',
    avatars: 'avatars'
  }

  const listItemStyle = {
    margin: '0px 0px 24px',
    padding: isMinimal ? '16px 0px' : ''
  }

  return (
    <Stack justifyContent="space-between" height="100%">
      <List 
        sx={{ 
          '& .Mui-selected': {
            backgroundColor: '#e8dff4'
          },
          '& .MuiTypography-root': {
            fontWeight: 'bold'
          }
        }}
      >
        <ListItem 
          sx={{ 
            justifyContent: 'center', 
            backgroundColor: '#e8dff4',
            width: !isMinimal ? '208px' : '32px',
            height: '96px',
            margin: '24px 24px',
            padding: !isMinimal ? '27px 35px' : '',
            borderRadius: '6px'
          }}
        >
          {!isMinimal && <Typography 
            variant="h4"
            sx={{
              color: '#df678c'
            }}
          >
            Minds
          </Typography>}
          {!isMinimal && <Typography 
            variant="h4"
            sx={{
              color: '#09113c'
            }}
          >
            Lab
          </Typography>}
        </ListItem>

        <ListItem 
          button 
          key={keys.home} 
          sx={listItemStyle} 
          selected={active === keys.home} 
          onClick={() => onClickMenu(keys.home)}
        >
          <ListItemIcon sx={active === keys.home ? { ...iconContainerActiveStyle } : { ...iconContainerStyle }}>
            <HomeIcon sx={active === keys.home ? { ...iconActiveStyle } : { ...iconStyle }} />
          </ListItemIcon>
          {!isMinimal && <ListItemText primary={'Home'} />}
        </ListItem>

        <ListItem 
          button 
          key={keys.videos} 
          sx={listItemStyle} 
          selected={active === keys.videos} 
          onClick={() => onClickMenu(keys.videos)}
        >
          <ListItemIcon sx={active === keys.videos ? { ...iconContainerActiveStyle } : { ...iconContainerStyle }}>
            <VideocamIcon sx={active === keys.videos ? { ...iconActiveStyle } : { ...iconStyle }} />
          </ListItemIcon>
          {!isMinimal && <ListItemText primary={'Videos'} />}
        </ListItem>

        <ListItem 
          button 
          key={keys.templates} 
          sx={listItemStyle} 
          selected={active === keys.templates}
          onClick={() => onClickMenu(keys.templates)}
        >
          <ListItemIcon sx={active === keys.templates ? { ...iconContainerActiveStyle } : { ...iconContainerStyle }}>
            <AutoAwesomeMosaicIcon sx={active === keys.templates ? { ...iconActiveStyle } : { ...iconStyle }} />
          </ListItemIcon>
          {!isMinimal && <ListItemText primary={'Templates'} />}
        </ListItem>

        <ListItem 
          button 
          key={keys.avatars} 
          sx={listItemStyle} 
          selected={active === keys.avatars} 
          onClick={() => onClickMenu(keys.avatars)}
        >
          <ListItemIcon sx={active === keys.avatars ? { ...iconContainerActiveStyle } : { ...iconContainerStyle }}>
            <AccountBoxIcon sx={active === keys.avatars ? { ...iconActiveStyle } : { ...iconStyle }} />
          </ListItemIcon>
          {!isMinimal && <ListItemText primary={'Avatars'} />}
        </ListItem>
      </List>

      <List
        sx={{
          '& .MuiTypography-root': {
            fontWeight: 'bold'
          }
        }}
      >
        <ListItem button key={'user'} sx={{ margin: '8px 0px', padding: isMinimal ? '16px 0px' : '' }}>
          <ListItemIcon sx={iconContainerStyle }>
            <AccountBoxIcon sx={iconStyle} />
          </ListItemIcon>
          {!isMinimal && <ListItemText primary={'User'} />}
        </ListItem>

        <ListItem button key={'settings'} sx={{ margin: '0px 0px 32px 0px', padding: isMinimal ? '16px 0px' : '' }}>
          <ListItemIcon sx={iconContainerStyle }>
            <SettingsIcon sx={iconStyle} />
          </ListItemIcon>
          {!isMinimal && <ListItemText primary={'Settings'} />}
        </ListItem>
      </List>
    </Stack>
  );
};

const Sidebar = ({ mobileOpen, handleDrawerToggle }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const isMinimal = useSelector(state => state.navigation.isMinimal);
  const drawerWidth = useSelector(state => state.navigation.drawerWidth);

  const [activeKey, setActiveKey] = useState('home');

  useEffect(() => {
    const pathname = history.location.pathname;
    setActiveKey(pathname.replace('/', ''));
    if (pathname === '/editor') {
      dispatch(setIsMinimal(true));
      dispatch(setDrawerWidth(drawerMinWidth));
    }
    dispatch(setPathName(pathname));
  }, []);

  const onClickMenu = (key) => {
    setActiveKey(key);
    dispatch(setPathName(`/${key}`));
    dispatch(setIsMinimal(false));
    dispatch(setDrawerWidth(drawerMaxWidth));
    history.push(`/${key}`);
  }

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#f5f0fa'
          }
        }}
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
      >
        <DrawerItems isMinimal={isMinimal} active={activeKey} onClickMenu={(key) => onClickMenu(key)} />
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#f5f0fa'
          }
        }}
        open
      >
        <DrawerItems isMinimal={isMinimal} active={activeKey} onClickMenu={(key) => onClickMenu(key)} />
      </Drawer>
    </Box>
  );
}

export default Sidebar;