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
import Account from './views/account/Account';

import { setPathName } from '../redux/navigation/navigationSlice';
import { pathnameEnum } from './constants/Pathname';

export default function Main() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [mobileOpen, setMobileOpen] = useState(false);

  const pathname = history.location.pathname;

  useEffect(() => {
    dispatch(setPathName(pathname));
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  if (!sessionStorage.getItem('logged')) {
    return <Redirect to="/login" />;
  }

  return (
    <Box sx={{ display: 'flex', height: '100%', width: '100%' }}>
      {pathname !== pathnameEnum.editor && <Appbar handleDrawerToggle={() => handleDrawerToggle()} />}
      {pathname !== pathnameEnum.editor && <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={() => handleDrawerToggle()}/>}
      <Switch>
        <Route exact path={pathnameEnum.home} component={Home} />
        <Route exact path={pathnameEnum.videos} component={Videos} />
        <Route exact path={pathnameEnum.editor} component={Editor} />
        <Route exact path={pathnameEnum.templates} component={Templates} />
        <Route exact path={pathnameEnum.avatars} component={Avatars} />
        <Route exact path={pathnameEnum.account} component={Account} />
        <Redirect from="/studio/" to={pathnameEnum.home} />
      </Switch>
    </Box>
  );
}
