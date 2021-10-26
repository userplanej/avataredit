import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { Grid } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Typography from '@mui/material/Typography';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

const slideContainerStyle = {
  width: '100%',
  height: '192px',
  margin: '16px 0px 18px',
  backgroundColor: '#e8e9e9',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center'
}

const addSlideContainerStyle = {
  width: '90%',
  height: '128px',
  padding: '36px 75px 28px 76px',
  borderRadius: '6px',
  border: 'solid 2px #e8e9e9',
  backgroundColor: '#f9f8fa',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center'
}

const btnAddTransitionStyle = {
  width: '90%',
  height: '32px',
  marginTop: '8px',
  padding: '6px 57px 6px 58px',
  borderRadius: '10px',
  backgroundColor: '#f9f8fa',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  border: '1px solid #f9f8fa'
}

const addTransitionTextStyle = {
  width: '109px',
  height: '20px',
  fontFamily: 'Omnes',
  fontSize: '16px',
  fontWeight: '500',
  fontStretch: 'normal',
  fontStyle: 'normal',
  lineHeight: 'normal',
  letterSpacing: 'normal',
  textAlign: 'left',
  color: '#5b5c62'
}

const Slides = () => {
  return (
    <List>
      <ListItem
        sx={{ ...slideContainerStyle }}
      >
        <Grid container>
          <Grid item md={1}>
            <span>1</span>
          </Grid>
          <Grid item md={11}>
            <div style={{ 
              width: '90%',
              height: '128px',
              padding: '36px 75px 28px 76px',
              borderRadius: '6px',
              backgroundColor: 'lightblue'
            }}>
            </div>
          </Grid>
        </Grid>

        <Grid container>
          <Grid item md={1}></Grid>
          <Grid item md={11}>
            <button style={{ ...btnAddTransitionStyle }}>
              <span style={{ ...addTransitionTextStyle }}>Add Transitions</span>
            </button>
          </Grid>
        </Grid>
      </ListItem>

      <ListItem>
        <Grid container>
          <Grid item md={1}>
            <span>2</span>
          </Grid>
          <Grid item md={11}>
            <div style={{ ...addSlideContainerStyle }}>
              <AddCircleIcon sx={{ color: '#0a1239', mb: '10px' }} />
              <Typography>Add slide</Typography>
            </div>
          </Grid>
        </Grid>
      </ListItem>
    </List>
  );
}
 
export default Slides;