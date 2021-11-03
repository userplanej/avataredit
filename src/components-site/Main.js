import React, { useState } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Appbar from './Appbar';
import Sidebar from './Sidebar';
import Home from './home/Home';
import Videos from './videos/Videos';
import Editor from '../components/imagemap/ImageMapEditor';
import Avatars from './avatars/Avatars';
import Templates from './templates/Templates';

const theme = createTheme({
  typography: {
    fontFamily: 'Omnes',
    fontWeight: '500'
  },
});

export default function Main() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', height: '100%' }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Appbar handleDrawerToggle={() => handleDrawerToggle()} />
        <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={() => handleDrawerToggle()}/>
        <Switch>
          <Route exact path="/home" component={Home} />
          <Route exact path="/videos" component={Videos} />
          <Route exact path="/editor" component={Editor} />
          <Route exact path="/templates" component={Templates} />
          <Route exact path="/avatars" component={Avatars} />
          <Redirect from="*" to="/home" />
        </Switch>
      </ThemeProvider>
    </Box>
  );
}
