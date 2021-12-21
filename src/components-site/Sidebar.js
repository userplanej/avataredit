import React, { useState, useEffect } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PersonIcon from '@mui/icons-material/Person';
import Stack from '@mui/material/Stack';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';

import { pathnameEnum } from './constants/Pathname';
import { drawerWidth } from './constants/Drawer';

const keys = {
  home: 'home',
  videos: 'videos',
  templates: 'templates',
  avatars: 'avatars',
  account: 'account',
  settings: 'settings',
  new: 'new',
  howTo: 'howTo',
  help: 'help'
}

const DrawerItems = ({ active, onClickMenu, handleClickUserMenu }) => {
  const listItemStyle = {
    margin: '0px 0px 14px',
  }

  const user = JSON.parse(sessionStorage.getItem('user'));

  return (
    <Stack justifyContent="space-between" height="100%">
      <List 
        sx={{ 
          p: 2,
          '& .Mui-selected': {
            backgroundColor: '#3c4045'
          }
        }}
      >
        <ListItem 
          sx={{ 
            justifyContent: 'center',
            margin: '20px 0 46px'
          }}
        >
          <img style={{ width: '190px' }} src="/images/img_mstudio.png" />
        </ListItem>

        <ListItem 
          button 
          key={keys.home} 
          sx={listItemStyle} 
          selected={active === keys.home} 
          onClick={() => onClickMenu(keys.home)}
        >
          <ListItemText primary={'Home'} />
        </ListItem>

        <ListItem 
          button 
          key={keys.videos} 
          sx={listItemStyle} 
          selected={active === keys.videos} 
          onClick={() => onClickMenu(keys.videos)}
        >
          <ListItemText primary={'Videos'} />
        </ListItem>

        {/* <ListItem 
          button 
          key={keys.templates} 
          sx={listItemStyle} 
          selected={active === keys.templates}
          onClick={() => onClickMenu(keys.templates)}
        >
          <ListItemText primary={'Templates'} />
        </ListItem> */}

        {/* <ListItem 
          button 
          key={keys.avatars} 
          sx={listItemStyle} 
          selected={active === keys.avatars} 
          onClick={() => onClickMenu(keys.avatars)}
        >
          <ListItemText primary={'Avatars'} />
        </ListItem> */}
      </List>

      <List
        sx={{
          p: 2,
          '& .Mui-selected': {
            backgroundColor: '#3b4046'
          }
        }}
      >
        {/* <ListItem 
          button 
          key={keys.new}
        >
          <ListItemText primary={'What\'s new'} />
        </ListItem>
        
        <ListItem 
          button 
          key={keys.howTo}
        >
          <ListItemText primary={'How to make videos'} />
        </ListItem>

        <ListItem 
          button 
          key={keys.help}
        >
          <ListItemText primary={'Help'} />
        </ListItem> */}

        <ListItem 
          button 
          key={keys.account} 
          sx={{ margin: '25px 0px 15px' }}
          selected={active === keys.account} 
          onClick={handleClickUserMenu}
        >
          <ListItemIcon 
            sx={{
              justifyContent: 'center',
              alignItems: 'center',
              minWidth: '30px',
              height: '30px',
              borderRadius: '20px',
              backgroundColor: '#fff',
              mr: 2
            }}
          >
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary={user.name} secondary={user.company && user.company !== '' ? user.company : null} />
        </ListItem>
      </List>
    </Stack>
  );
};

const Sidebar = ({ mobileOpen, handleDrawerToggle }) => {
  const history = useHistory();
  const routeMatch = useRouteMatch([`${pathnameEnum.editor}/:id`, `${pathnameEnum.editorTemplate}/:id`]);

  const [activeKey, setActiveKey] = useState('home');
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  
  useEffect(() => {
    const pathname = history.location.pathname;
    const pathnameKey = pathname.split('/');
    setActiveKey(pathnameKey[2]);
  }, []);

  const handleClickUserMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };

  const onClickMenu = (key) => {
    setAnchorEl(null);
    setActiveKey(key);
    history.push(pathnameEnum[key]);
  }

  const onClickLogout = () => {
    sessionStorage.removeItem('user');
    history.push(pathnameEnum.login);
  }

  const isEditorPage = () => {
    return routeMatch !== null;
  }

  return (
    <Box
      component="nav"
      sx={{ width: { lg: isEditorPage() ? 0 : drawerWidth, xl: isEditorPage() ? 0 : drawerWidth }, flexShrink: { lg: 0 } }}
    >
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#30353a'
          }
        }}
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
      >
        <DrawerItems active={activeKey} onClickMenu={(key) => onClickMenu(key)} handleClickUserMenu={handleClickUserMenu} />
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'none', md: 'none', lg: isEditorPage() ? 'none' : 'block', xl: isEditorPage() ? 'none' : 'block' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#30353a'
          }
        }}
        open
      >
        <DrawerItems active={activeKey} onClickMenu={(key) => onClickMenu(key)} handleClickUserMenu={handleClickUserMenu} />
      </Drawer>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseUserMenu}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem onClick={() => onClickMenu(keys.account)}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText disableTypography>Settings</ListItemText>
        </MenuItem>

        <MenuItem onClick={onClickLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText disableTypography>Logout</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
}

export default Sidebar;