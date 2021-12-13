import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fabric } from 'fabric';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import FlipToBackIcon from '@mui/icons-material/FlipToBack';
import FlipToFrontIcon from '@mui/icons-material/FlipToFront';
import PersonIcon from '@mui/icons-material/Person';
import { Stack, Slider, InputLabel } from '@mui/material';

import CustomInput from '../../inputs/CustomInput';
import SelectInput from '../../inputs/SelectInput';
import TemplateDetail from './TemplateDetail';

import { updateImageClip } from '../../../api/image/clip';

import { setActiveObject } from '../../../redux/canvas/canvasSlice';
import { setActiveTab } from '../../../redux/toolbar/toolbarSlice';
import { setHeight, setLeft, setTop, setWidth, setIsFront, setIsBack, setAvatarPose as setCurrentAvatarPose } from '../../../redux/object/objectSlice';

import { scaling } from '../../../components/canvas/constants';
import { avatarPoseEnum, avatarPoseValues } from '../../../enums/AvatarPose';

const propertiesNames = {
  position: 'position',
  size: 'size'
}

const avatarPositionValues = {
  left: 'left',
  center: 'center',
  right: 'right'
}

function TabPanel(props) {
  const { children, value, index, name, ...other } = props;

  return (
    <div
      key={name.concat('-', index)}
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

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
    sx: { fontSize: '15px', mt: 1 }
  };
}

const ToolsView = (props) => {
  const dispatch = useDispatch();
  const activeObject = useSelector((state) => state.canvas.activeObject);
  const activeTab = useSelector((state) => state.toolbar.activeTab);
  const activeObjectLeft = useSelector(state => state.object.left);
  const activeObjectTop = useSelector(state => state.object.top);
  const activeObjectWidth = useSelector(state => state.object.width);
  const activeObjectHeight = useSelector(state => state.object.height);
  const avatarPositionSaved = useSelector(state => state.object.avatarPosition);
  const isActiveObjectFront = useSelector(state => state.object.isFront);
  const isActiveObjectBack = useSelector(state => state.object.isBack);
  const currentAvatarPose = useSelector(state => state.object.avatarPose);
  const activeSlide = useSelector(state => state.video.activeSlide);

  const [avatarTab, setAvatarTab] = useState(0);
  const [backgroundTab, setBackgroundTab] = useState(0);
  const [imageTab, setImageTab] = useState(0);
  const [avatarSize, setAvatarSize] = useState(100);
  const [avatarPosition, setAvatarPosition] = useState('center');
  const [avatarPose, setAvatarPose] = useState(avatarPoseEnum.all_around);

  useEffect(() => {
    dispatch(setActiveTab(1));
    dispatch(setActiveObject(null));
  }, []);

  useEffect(() => {
    setAvatarPosition(avatarPositionSaved);
  }, [avatarPositionSaved]);

  useEffect(() => {
    setAvatarPose(currentAvatarPose);
  }, [currentAvatarPose]);

  const handleChange = (event, newValue) => {
    dispatch(setActiveTab(newValue));
  }

  const handleChangeAvatarTab = (event, newValue) => {
    setAvatarTab(newValue);
  }

  const handleChangeBackgroundTab = (event, newValue) => {
    setBackgroundTab(newValue);
  }

  const handleChangeImageTab = (event, newValue) => {
    setImageTab(newValue);
  }

  const handleChangeAvatarSize = (event, newValue) => {
    setAvatarSize(newValue);
    updateAvatarSize(newValue);
  };

  const handleChangeAvatarPose = (newValue) => {
    setAvatarPose(newValue);
    updateAvatarPose(newValue);
  }

  const updateAvatarSize = (size) => {
    const { canvasRef } = props;
    const objects = canvasRef.handler.getObjects();
    const avatar = objects.find((obj) => obj.subtype === 'avatar');

    const defaultScale = scaling.AVATAR - 0.01;
    let newScale = (parseInt(size) * defaultScale) / 100;
    canvasRef.handler.setByObject(avatar, 'scaleX', newScale);
    canvasRef.handler.setByObject(avatar, 'scaleY', newScale);
  }

  const updateAvatarPose = async (pose) => {
    const id = activeSlide.clip_id;
    await updateImageClip(id, { avatar_pose: pose }).then(() => dispatch(setCurrentAvatarPose(pose)));
  }

  const renderMoveButtons = () => {
    return (
      <Box sx={{ mt: 1, mb: 2 }}>
        <Typography variant="h6">Move</Typography>
        <Grid container spacing={1} sx={{ display: 'flex', mt: 1 }}>
          <Grid item>
            <Button 
              variant="contained" 
              color="secondary" 
              fullWidth
              startIcon={<FlipToBackIcon />} 
              onClick={sendToBack}
              disabled={isActiveObjectBack}
              sx={{ backgroundColor: '#e8e9e9', border: 'none', color: '#202427', mr: 1 }}
            >
              Back
            </Button>
          </Grid>

          <Grid item>
            <Button 
              variant="contained" 
              color="secondary" 
              fullWidth
              startIcon={<FlipToBackIcon />} 
              onClick={sendBackwards}
              disabled={isActiveObjectBack}
              sx={{ backgroundColor: '#e8e9e9', border: 'none', color: '#202427', mr: 1 }}
            >
              Backward
            </Button>
          </Grid>

          <Grid item>
            <Button 
              variant="contained" 
              color="secondary" 
              fullWidth
              startIcon={<FlipToFrontIcon />} 
              onClick={bringForward}
              disabled={isActiveObjectFront}
              sx={{ backgroundColor: '#e8e9e9', border: 'none', color: '#202427', mr: 1 }}
            >
              Forward
            </Button>
          </Grid>

          <Grid item>
            <Button 
              variant="contained" 
              color="secondary" 
              fullWidth
              startIcon={<FlipToFrontIcon />} 
              onClick={bringToFront}
              disabled={isActiveObjectFront}
              sx={{ backgroundColor: '#e8e9e9', border: 'none', color: '#202427' }}
            >
              Front
            </Button>
          </Grid>
        </Grid>
      </Box>
    );
  }

  const sendToBack = () => {
    const { canvasRef, onSaveSlide } = props;
    canvasRef.handler.sendToBack();
    updateBackFrontValues();
    setTimeout(() => onSaveSlide(), 100);
  }

  const sendBackwards = () => {
    const { canvasRef, onSaveSlide } = props;
    canvasRef.handler.sendBackwards();
    updateBackFrontValues();
    setTimeout(() => onSaveSlide(), 100);
  }

  const bringForward = () => {
    const { canvasRef, onSaveSlide } = props;
    canvasRef.handler.bringForward();
    updateBackFrontValues();
    setTimeout(() => onSaveSlide(), 100);
  }

  const bringToFront = () => {
    const { canvasRef, onSaveSlide } = props;
    canvasRef.handler.bringToFront();
    updateBackFrontValues();
    setTimeout(() => onSaveSlide(), 100);
  }

  /**
   * Update boolean values if active object is the first or last object (at the front or back)
   */
  const updateBackFrontValues = () => {
    const { canvasRef } = props;
    const objects = canvasRef.handler.getObjects();
    const activeObject = canvasRef.handler.getActiveObject();
    dispatch(setIsBack(objects[0] === activeObject));
    dispatch(setIsFront(objects[objects.length - 1] === activeObject));
  }

  const renderLayout = () => {
    return (
      <Box sx={{ mt: 1 }}>
        <Typography variant="h6">Layout</Typography>

        {/* Position */}
        <Grid container spacing={2}>
          <Grid item xs={5}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <InputLabel>X</InputLabel>
              <CustomInput
                value={activeObjectLeft}
                onChange={(event) => dispatch(setLeft(event.target.value))}
                onBlur={() => changeObject(propertiesNames.position, { top: activeObjectTop, left: activeObjectLeft })}
                sx={{ width: '100px', backgroundColor: '#3c4045', '& input': { textAlign: 'right' } }}
              />
            </Box>
          </Grid>

          <Grid item xs={2} />

          <Grid item xs={5}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <InputLabel>Y</InputLabel>
              <CustomInput
                value={activeObjectTop}
                onChange={(event) => dispatch(setTop(event.target.value))}
                onBlur={() => changeObject(propertiesNames.position, { top: activeObjectTop, left: activeObjectLeft })}
                sx={{ width: '100px', textAlign: 'right', backgroundColor: '#3c4045', '& input': { textAlign: 'right' } }}
              />
            </Box>
          </Grid>
        </Grid>

        {/* Size */}
        <Grid container spacing={2}>
          <Grid item xs={5}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <InputLabel>Width</InputLabel>
              <CustomInput
                value={activeObjectWidth}
                onChange={(event) => dispatch(setWidth(parseInt(event.target.value)))}
                onBlur={() => changeObject(propertiesNames.size, { width: activeObjectWidth, height: activeObjectHeight })}
                sx={{ width: '100px', backgroundColor: '#3c4045', '& input': { textAlign: 'right' } }}
              />
            </Box>
          </Grid>

          <Grid item xs={2} />

          <Grid item xs={5}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <InputLabel>Height</InputLabel>
              <CustomInput
                value={activeObjectHeight}
                onChange={(event) => dispatch(setHeight(parseInt(event.target.value)))}
                onBlur={() => changeObject(propertiesNames.size, { width: activeObjectWidth, height: activeObjectHeight })}
                sx={{ width: '100px', textAlign: 'right', backgroundColor: '#3c4045', '& input': { textAlign: 'right' } }}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    );
  }

  /**
   * Change the selected element:
   * Key => Values
   * - position => { left: number, top: number }
   * - size => { width: number, height: number }
   * @param {string} key The property to change 
   * @param {object} values The values of property changed
   */
  const changeObject = (key, values) => {
    const { canvasRef, onSaveSlide } = props;
    
    if (key === propertiesNames.position) {
      const { top, left } = values;
      canvasRef.handler.setObject({ top: parseInt(top), left: parseInt(left) });
      setTimeout(() => onSaveSlide(), 100);
    }
    if (key === propertiesNames.size) {
      const { width, height } = values;
      canvasRef.handler.setActiveObjectScale(width, height);
      setTimeout(() => onSaveSlide(), 100);
    }
  }

  const renderAvatarPose = () => {
    return (
      <Box>
        <InputLabel sx={{ mt: '20px' }}>Pose</InputLabel>
        <SelectInput 
          items={avatarPoseValues}
          id="avatar-pose"
          name="avatar-pose"
          value={avatarPose}
          noEmptyValue
          onChange={(event) => handleChangeAvatarPose(event.target.value)}
        />
      </Box>
    );
  }

  // const renderFormat = () => {
  //   let title = 'Format';
  //   let type = null;
  //   if (activeObject) {
  //     switch (activeObject.type) {
  //       case 'textbox':
  //         title = 'Text format';
  //         break;
  //       case 'shape':
  //         title = 'Shape format';
  //         break;
  //       case 'avatar':
  //         title = 'Avatar format';
  //         type = 'avatar';
  //         break;
  //       default:
  //         break;
  //     }
  //   }
  //   return (
  //     <Box>
  //       <Typography variant="h5" sx={{ mb: 2 }}>
  //         {title}
  //       </Typography>

  //       <hr />
        
  //       {renderMoveButtons()}

  //       <hr />
  //       {type === 'avatar' && renderAvatarPose()}
  //       {renderLayout()}
  //     </Box>
  //   );
  // }

  /**
   * Align the avatar.
   * @param {string} position One of: 'left', 'right' or 'center
   */
  const alignAvatar = (position) => {
    const { canvasRef, onSaveSlide } = props;
    const objects = canvasRef.handler.getObjects();
    const avatar = objects.find((obj) => obj.subtype === 'avatar');

    if (position === avatarPositionValues.left) {
      avatar.centerV();
      avatar.setCoords();
      avatar.setPositionByOrigin(new fabric.Point(0, avatar.top), 'left', 'center');
      setAvatarPosition(avatarPositionValues.left);
    }
    if (position === avatarPositionValues.center) {
      avatar.center();
      avatar.setCoords();
      setAvatarPosition(avatarPositionValues.center);
    }
    if (position === avatarPositionValues.right) {
      const workareaWidth = canvasRef.handler.workarea.width;
      avatar.centerV();
      avatar.setCoords();
      avatar.setPositionByOrigin(new fabric.Point(workareaWidth, avatar.top), 'right', 'center');
      setAvatarPosition(avatarPositionValues.right);
    }
    avatar.positionButton = position;
    setTimeout(() => onSaveSlide(), 100);
  }

  return (
    <Grid container sx={{ height: '100%', justifyContent: 'end' }}>
      <Grid item xs={8.5} md={10} lg={9} xl={10} sx={{ backgroundColor: '#3c4045' }}>
        <TabPanel name="main" value={activeTab} index={0}>
          <TemplateDetail userTemplates={props.userTemplates} reloadSlides={props.reloadSlides} video={props.video} />
        </TabPanel>

        <TabPanel name="main" value={activeTab} index={1}>
          <Typography variant="h6" sx={{ mb: '10px' }}>Select avatar, size and alignment</Typography>
          <Box sx={{ height: '520px', maxHeight: '550px', overflowY: 'auto' }}>{props.avatars}</Box>

          <Box sx={{ width: '100%' }}>
            <Box sx={{ width: '100%', borderBottom: '1px solid #fff' }}>
              <Tabs 
                value={avatarTab} 
                variant="fullWidth" 
                scrollButtons="auto" 
                onChange={handleChangeAvatarTab} 
                aria-label="avatars-tabs"
              >
                <Tab label="Full body" />
                {/* <Tab label="Circle" />
                <Tab label="Voice only" /> */}
              </Tabs>
            </Box>
            <TabPanel name="avatar" value={avatarTab} index={0}>
              <Box sx={{ px: 2, py: 3, backgroundColor: '#262c34', width: '100%' }}>
                <Box sx={{ display: 'flex' }}>
                  <Button
                    variant={avatarPosition === avatarPositionValues.left ? 'contained' : 'text'}
                    fullWidth
                    sx={avatarPosition === avatarPositionValues.left ? null : { color: '#8c8d8d' }}
                    onClick={() => alignAvatar(avatarPositionValues.left)}
                  >
                    Left
                  </Button>
                  <Button
                    variant={avatarPosition === avatarPositionValues.center ? 'contained' : 'text'}
                    fullWidth
                    sx={avatarPosition === avatarPositionValues.center ? null : { color: '#8c8d8d' }}
                    onClick={() => alignAvatar(avatarPositionValues.center)}
                  >
                    Center
                  </Button>
                  <Button
                    variant={avatarPosition === avatarPositionValues.right ? 'contained' : 'text'}
                    fullWidth
                    sx={avatarPosition === avatarPositionValues.right ? null : { color: '#8c8d8d' }}
                    onClick={() => alignAvatar(avatarPositionValues.right)}
                  >
                    Right
                  </Button>
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
                    <PersonIcon fontSize="small" sx={{ color: '#fff' }} />
                    <Slider aria-label="Avatar size" value={avatarSize} onChange={handleChangeAvatarSize} sx={{ color: '#fff' }} />
                    <PersonIcon fontSize="large" sx={{ color: '#fff' }} />
                  </Stack>
                </Box>
              </Box>
            </TabPanel>
            <TabPanel name="avatar" value={avatarTab} index={1}>Circle</TabPanel>
            <TabPanel name="avatar" value={avatarTab} index={2}>
              <Box sx={{ p: 7, backgroundColor: '#262c34', color: '#fff', textAlign: 'center' }}>
                Avatar will not be shown on this slide.
              </Box>
            </TabPanel>
          </Box>
        </TabPanel>

        <TabPanel name="main" value={activeTab} index={2}>
          <Typography variant="h6" sx={{ mb: '10px' }}>Select background</Typography>
          <Box sx={{ width: '100%' }}>
            <Box sx={{ width: '100%', borderBottom: '1px solid #fff' }}>
              <Tabs value={backgroundTab} variant="scrollable" scrollButtons={false} onChange={handleChangeBackgroundTab} aria-label="backgrounds-tabs">
                <Tab label="Colors" />
                <Tab label="Images" />
                {/* <Tab label="Videos" /> */}
                <Tab label="Uploads" />
              </Tabs>
            </Box>
            <TabPanel name="background" value={backgroundTab} index={0}>{props.backgroundsColors}</TabPanel>
            <TabPanel name="background" value={backgroundTab} index={1}>{props.backgroundsImagesDefault}</TabPanel>
            {/* <TabPanel name="background" value={backgroundTab} index={2}>{props.backgroundsVideosDefault}</TabPanel> */}
            <TabPanel name="background" value={backgroundTab} index={2}>{props.backgroundsImagesUploaded}</TabPanel>
            {/* <TabPanel name="background" value={backgroundTab} index={3}>{props.backgroundsImagesUploaded}</TabPanel> */}
          </Box>
        </TabPanel>

        <TabPanel name="main" value={activeTab} index={3}>
          <Typography variant="h6" sx={{ mb: '10px' }}>Text</Typography>
          {props.texts}
        </TabPanel>

        <TabPanel name="main" value={activeTab} index={4}>
          <Typography variant="h6" sx={{ mb: '10px' }}>Select shape</Typography>
          {props.shapes}
        </TabPanel>

        <TabPanel name="main" value={activeTab} index={5}>
          <Typography variant="h6" sx={{ mb: '10px' }}>Select images</Typography>
          <Box sx={{ width: '100%' }}>
            <Box sx={{ width: '100%', borderBottom: '1px solid #fff' }}>
              <Tabs value={imageTab} variant="scrollable" scrollButtons={false} onChange={handleChangeImageTab} aria-label="images-tabs">
                <Tab label="Images" />
                <Tab label="Uploads" />
              </Tabs>
            </Box>
            <TabPanel name="image" value={imageTab} index={0}>{props.imagesDefault}</TabPanel>
            <TabPanel name="image" value={imageTab} index={1}>{props.imagesUploaded}</TabPanel>
          </Box>
        </TabPanel>

        {/* <TabPanel name="main" value={activeTab} index={6}>
          <Typography variant="h6">Select music</Typography>
        </TabPanel>

        <TabPanel name="main" value={activeTab} index={7}>
          {renderFormat()}
        </TabPanel> */}
      </Grid>

      <Grid item xs={3.5} md={2} lg={3} xl={2} sx={{ backgroundColor: '#30353a', height: '100%' }}>
        <Tabs
          orientation="vertical"
          indicatorColor="secondary"
          value={activeTab}
          onChange={handleChange}
          aria-label="tools tabs"
          sx={{ 
            mt: 2,
            '& .MuiTab-root': {
              backgroundColor: '#30353a'
            },
            '& .Mui-selected': {
              backgroundColor: '#3c4045',
              color: '#fff'
            },
            '& .MuiTabs-scroller': {
              width: '100%'
            },
            '& .MuiTabs-indicator': {      
              width: '0px'
            }
          }}
        >
          <Tab label="Template" {...a11yProps(0)} />
          <Tab label="Avatar" {...a11yProps(1)} />
          <Tab label="Background" {...a11yProps(2)} />
          <Tab label="Text" {...a11yProps(3)} />
          <Tab label="Shapes" {...a11yProps(4)} />
          <Tab label="Images" {...a11yProps(5)} />
          {/* <Tab label="Music" {...a11yProps(6)} /> */}
          {/* {activeObject && <Tab label="Format" {...a11yProps(7)} />} */}
        </Tabs>
      </Grid>
    </Grid>
  );
}

export default ToolsView;