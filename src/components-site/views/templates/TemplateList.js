import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import { Menu, MenuItem } from '@mui/material';
import PanoramaIcon from '@mui/icons-material/Panorama';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import ConfirmDialog from '../../dialog/ConfirmDialog';

import { setShowBackdrop } from '../../../redux/backdrop/backdropSlice';

import { deleteImagePackage, getAllImagePackage, postImagePackage, updateImagePackage } from '../../../api/image/package';
import { uploadFile } from '../../../api/s3';
import { postImageClip } from '../../../api/image/clip';
import { deleteOutput } from '../../../api/output/output';

import { pathnameEnum } from '../../constants/Pathname';

const ITEM_HEIGHT = 48;

const templateBoxStyle = {
  mt: 3,
  p: 2,
  width: '90%',
  borderRadius: '6px',
  ':hover': {
    backgroundColor: '#3c4045'
  }
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
        <Box>
          {children}
        </Box>
      )}
    </div>
  );
}

const TemplateList = (props) => {
  const { isHome } = props;

  const dispatch = useDispatch();
  const history = useHistory();
  const showBackdrop = useSelector(state => state.backdrop.showBackdrop);

  const [defaultTemplateList, setDefaultTemplateList] = useState([]);
  const [myTemplateList, setMyTemplateList] = useState([]);
  const [templateTab, setTemplateTab] = useState(0);
  const [templateSelected, setTemplateSelected] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const options = [
    {
      name: 'Create video',
      action: (event) => handleCreateVideo(event),
      isDraft: false
    },
    {
      name: 'Duplicate',
      action: (event) => handleDuplicateTemplate(event),
      isDraft: false
    },
    {
      name: 'Delete',
      action: (event) => {
        handleOpenConfirmDialog(event);
        handleCloseMenu(event);
      },
      isDraft: true
    }
  ];

  useEffect(() => {
    loadTemplates();
    setTemplateSelected(null);
  }, []);

  const loadTemplates = async () => {
    dispatch(setShowBackdrop(true));

    const user = JSON.parse(sessionStorage.getItem('user'));

    await getAllImagePackage(null, true).then(res => {
      const templates = res.data.body.rows;
      const templatesSorted = templates.sort((a, b) => (a.create_date < b.create_date) ? 1 : -1);
      const defaultTemplates = templatesSorted.filter((template) => template.user_id === null);
      const myTemplates = templatesSorted.filter((template) => template.user_id === user.user_id);
      setDefaultTemplateList(defaultTemplates);
      setMyTemplateList(myTemplates);
      // setVideosListToDisplay(videosSorted);
      dispatch(setShowBackdrop(false));
    });
  }

  const handleOpenConfirmDialog = () => setOpenConfirmDialog(true);

  const handleCloseConfirmDialog = () => setOpenConfirmDialog(false);

  const handleClickMenu = (event, template) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setTemplateSelected(template);
  };

  const handleCloseMenu = (event) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  const handleCreateVideo = async (event) => {
    handleCloseMenu(event);

    dispatch(setShowBackdrop(true));

    let packageId = null;
    let clipId = null;

    // Create package
    const user = JSON.parse(sessionStorage.getItem('user'));
    const imagePackage = {
      user_id: user.user_id,
      package_name: 'New video',
      is_draft: true,
      is_template: false
    }
    await postImagePackage(imagePackage).then((res) => {
      packageId = res.data.body.package_id;
    });

    // Create slides
    const slidePromise = new Promise((resolve) => {
      const slides = templateSelected.image_clips;
      slides.forEach(async (slide, index) => {
        let newLocation = null;

        // Duplicate slide thumbnail
        const slideImage = slide.html5_dir;
        await axios.get(slideImage, { responseType: 'blob' }).then(async (res) => {
          const blob = res.data;
          const filename = `video-${packageId}-slide-${index}`;
          const file = new File([blob], filename, { type: "image/png" });

          const formData = new FormData();
          formData.append('files', file);
          await uploadFile(formData, 'slide-thumbnail').then((res) => {
            newLocation = res.data.body[0].file_dir;
          });
        });

        const imageClip = {
          ...slide,
          package_id: packageId,
          html5_dir: newLocation
        }
        await postImageClip(imageClip).then((res) => {
          if (index === 0) {
            clipId = res.data.body.clip_id;
          }
        });

        if (index === (slides.length - 1)) {
          resolve();
        }
      });
    });

    // Update image package current clip_id
    slidePromise.then(async () => {
      await updateImagePackage(packageId, { clip_id: clipId }).then(() => {
        dispatch(setShowBackdrop(false));
        history.push(`${pathnameEnum.editorTemplate}/${packageId}`);
      });
    });
  }

  const handleDuplicateTemplate = async (event) => {
    handleCloseMenu(event);

    dispatch(setShowBackdrop(true));

    // Duplicate template
    const user = JSON.parse(sessionStorage.getItem('user'));
    let packageId = null;
    const newVideo = {
      package_name: 'New template',
      is_draft: true,
      is_template: true,
      user_id: user.user_id
    }
    await postImagePackage(newVideo).then((res) => {
      packageId = res.data.body.package_id;
    });

    // Duplicate slides
    let firstClipId = null;
    const slidePromise = new Promise((resolve) => {
      const slides = templateSelected.image_clips;
      slides.forEach(async (slide, index) => {
        let newLocation = null;

        // Duplicate slide thumbnail
        const slideImage = slide.html5_dir;
        await axios.get(slideImage, { responseType: 'blob' }).then(async (res) => {
          const blob = res.data;
          const filename = `video-${packageId}-slide-${index}`;
          const file = new File([blob], filename, { type: "image/png" });

          const formData = new FormData();
          formData.append('files', file);
          await uploadFile(formData, 'slide-thumbnail').then((res) => {
            newLocation = res.data.body[0].file_dir;
          });
        });

        const newSlide = {
          ...slide,
          package_id: packageId,
          html5_dir: newLocation
        }
        delete imageClip.clip_id;
        delete imageClip.create_date;
        delete imageClip.update_date;

        await postImageClip(newSlide).then((res) => {
          if (index === 0) {
            firstClipId = res.data.body.clip_id;
          }
        });

        if (index === (slides.length - 1)) {
          resolve();
        }
      });
    });

    // Update video current clip_id
    slidePromise.then(async () => {
      await updateImagePackage(packageId, { clip_id: firstClipId }).then(() => {
        history.push(`${pathnameEnum.editorTemplate}/${packageId}`);
        dispatch(setShowBackdrop(false));
      });
    });
  }

  const handleDeleteTemplate = async () => {
    if (templateSelected.is_draft) {
      await deleteImagePackage(templateSelected.package_id).then(() => {
        loadTemplates();
        handleCloseConfirmDialog();
      });
    } else {
      await deleteOutput(templateSelected.output.output_id);
      await deleteImagePackage(templateSelected.package_id).then(() => {
        loadTemplates();
        handleCloseConfirmDialog();
      });
    }
  }

  const handleChangeTemplateTab = (event, newValue) => {
    setTemplateTab(newValue);
  }

  const handleClickTemplate = (id, isDraft) => {
    const path = isDraft ? pathnameEnum.editorTemplate : pathnameEnum.templates;
    history.push(path + `/${id}`);
  }
  
  const getShortName = (name) => {
    if (!name || name === '') {
      return '';
    }
    if (name.length < 25) {
      return name;
    }
    const shortName = name.substring(0, 25);
    return shortName.concat('...');
  }

  const displayTemplateList = () => {
    return myTemplateList && myTemplateList.length > 0 ?
      (
        myTemplateList.map((template) => {
          const firstSlide = template.image_clips[0];
          const isDraft = template.is_draft;
          return isHome ?
            (
              <Box key={template.package_id} sx={{ display: 'flex' }}>
                {displayTemplateItem(template, firstSlide, isDraft)}
              </Box>
            ) : (
              <Grid item key={template.package_id} xs={12} md={5} lg={4} xl={3} sx={{ display: 'flex', justifyContent: 'center' }}>
                {displayTemplateItem(template, firstSlide, isDraft)}
              </Grid>
            )
        })
      ) : (
        <Typography variant="h6">You have no templates, please create a new one.</Typography>
      );
  }

  const displayTemplateItem = (template, firstSlide, isDraft) => {
    const templateId = template.package_id;
    return (
      <Box sx={templateBoxStyle}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            cursor: 'pointer',
            ':hover .template-menu': {
              display: 'block'
            }
          }}
          onClick={() => handleClickTemplate(templateId, isDraft)}
        >
          <Box 
            sx={{ 
              backgroundColor: '#fff',
              width: '100%',
              height: isHome ? '180px' : '230px',
              borderRadius: '6px',
              display: 'grid',
              justifyContent: 'right',
              backgroundImage: firstSlide && firstSlide.html5_dir !== null ? `url(${firstSlide.html5_dir})` : '',
              backgroundPosition: 'center', /* Center the image */
              backgroundSize: 'cover'
            }}
          >
            <MoreVertIcon
              id={`template-menu-btn-${templateId}`}
              className="template-menu"
              onClick={(event) => handleClickMenu(event, template)}
              sx={{
                mt: 1,
                mr: 1,
                display: 'none',
                float: 'right',
                cursor: 'pointer'
              }}
            />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="body1" color="#fff">{getShortName(template.package_name)}</Typography>
          {isDraft &&
            <Box
              sx={{
                textAlign: 'center',
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#9a9a9a',
                width: '65px',
                height: '25px',
                borderRadius: '4px',
                border: 'solid 2px #babbbb',
                ml: 2
              }}
            >
              Draft
            </Box>
          }
        </Box>
      </Box>
    );
  }

  const displayOptions = () => {
    if (!templateSelected) {
      return;
    }
    const optionsList = templateSelected.is_draft ? options.filter((option) => templateSelected.is_draft === option.isDraft) : options;
    return optionsList.map((option) => (
      <MenuItem
        key={option.name}
        onClick={(event) => option.action(event)}
        sx={{ ':hover': { backgroundColor: '#f5f0fa' } }}
      >
        {option.name}
      </MenuItem>
    ));
  }

  return (
    <Box>
      {isHome &&
        <Typography variant="h5" color="#fff">Templates</Typography>
      }

      {/* <Tabs 
          value={templateTab}
          variant="scrollable"
          scrollButtons={false}
          onChange={handleChangeTemplateTab} 
          aria-label="templates-tabs"
        >
          <Tab label="Featured Templates" />
          <Tab label="My Templates" />
        </Tabs> */}

      {/* <TabPanel name="main" value={templateTab} index={0}>
        
      </TabPanel>

      <TabPanel name="main" value={templateTab} index={1}> */}
        {isHome &&
          <Box sx={{ display: 'flex' }}>
            {!showBackdrop && displayTemplateList()}
          </Box>
        }

        {!isHome &&
          <Grid container sx={{ display: 'flex' }}>
            {!showBackdrop && displayTemplateList()}
          </Grid>
        }
    {/* </TabPanel> */}

      <Menu
        id="template-menu"
        MenuListProps={{
          'aria-labelledby': 'template-menu-btn',
        }}
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleCloseMenu}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '15ch',
          },
        }}
      >
        {displayOptions()}
      </Menu>

      <ConfirmDialog
        open={openConfirmDialog}
        close={handleCloseConfirmDialog}
        title="Delete template"
        text="Are you sure you want to delete this template?"
        onConfirm={handleDeleteTemplate}
      />
    </Box>
  );
}
 
export default TemplateList;