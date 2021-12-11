import React, { useState, useEffect } from 'react';
import { Switch, Route, Redirect, useHistory, useRouteMatch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Appbar from './Appbar';
import Sidebar from './Sidebar';
import Home from './views/home/Home';
import Videos from './views/videos/Videos';
import Editor from '../components/imagemap/ImageMapEditor';
import Avatars from './views/avatars/Avatars';
import Templates from './views/templates/Templates';
import Account from './views/account/Account';
import Backdrop from './backdrop/Backdrop';
import Billing from './views/billing/Billing';
import VideoPreview from './views/videos/VideoPreview';

import { setPathName } from '../redux/navigation/navigationSlice';
import { pathnameEnum } from './constants/Pathname';

export default function Main() {
  const dispatch = useDispatch();
  const history = useHistory();
  const routeMatch = useRouteMatch([`${pathnameEnum.editor}/:id`, `${pathnameEnum.editorTemplate}/:id`]);
  const showBackdrop = useSelector(state => state.backdrop.showBackdrop);

  const [mobileOpen, setMobileOpen] = useState(false);

  const isEditor = routeMatch !== null;

  useEffect(() => {
    return history.listen((location) => { 
      dispatch(setPathName(location.pathname));
   }) 
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  if (!sessionStorage.getItem('user')) {
    return <Redirect to="/login" />;
  }

  return (
    <Box sx={{ display: 'flex', height: '100%', width: '100%', pt: isEditor ? 8 : 10 }}>
      {!isEditor && <Appbar handleDrawerToggle={() => handleDrawerToggle()} />}
      {!isEditor && <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={() => handleDrawerToggle()}/>}
      <Switch>
        <Route exact path={pathnameEnum.home} component={Home} />
        <Route exact path={pathnameEnum.videos} component={Videos} />
        <Route exact path={pathnameEnum.editor + '/:id'} component={Editor} />
        <Route exact path={pathnameEnum.editorTemplate + '/:id'} component={Editor} />
        <Route exact path={pathnameEnum.templates} component={Templates} />
        <Route exact path={pathnameEnum.avatars} component={Avatars} />
        <Route exact path={pathnameEnum.account} component={Account} />
        <Route exact path={pathnameEnum.billing} component={Billing} />
        <Route exact path={pathnameEnum.videos + '/:id'} component={VideoPreview} />
        <Route exact path={pathnameEnum.templates + '/:id'} component={VideoPreview} />
        <Redirect from="/studio/" to={pathnameEnum.home} />
      </Switch>

      <Backdrop open={showBackdrop} />
    </Box>
  );
}
