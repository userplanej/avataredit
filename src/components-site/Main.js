import React, { useState, useEffect } from 'react';
import { Switch, Route, Redirect, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import Box from '@mui/material/Box';
import Appbar from './Appbar';
import Sidebar from './Sidebar';
import Home from './views/home/Home';
import Videos from './views/videos/Videos';
import Editor from '../components/imagemap/ImageMapEditor';
import Avatars from './views/avatars/Avatars';
import Templates from './views/templates/Templates';

import { setDrawerWidth, setIsMinimal, setPathName } from '../redux/navigation/navigationSlice';
import { drawerMinWidth, drawerMaxWidth } from './constants/Drawer';
import { pathnameEnum } from './constants/Pathname';

export default function Main() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const pathname = history.location.pathname;
    if (pathname === pathnameEnum.editor) {
      dispatch(setIsMinimal(true));
      dispatch(setDrawerWidth(drawerMinWidth));
    } else {
      dispatch(setIsMinimal(false));
      dispatch(setDrawerWidth(drawerMaxWidth));
    }
    dispatch(setPathName(pathname));
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', height: '100%' }}>
      <Appbar handleDrawerToggle={() => handleDrawerToggle()} />
      <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={() => handleDrawerToggle()}/>
      <Switch>
        <Route exact path="/studio/home" component={Home} />
        <Route exact path="/studio/videos" component={Videos} />
        <Route exact path="/studio/editor" component={Editor} />
        <Route exact path="/studio/templates" component={Templates} />
        <Route exact path="/studio/avatars" component={Avatars} />
        <Redirect from="*" to="/studio/home" />
      </Switch>
    </Box>
  );
}
