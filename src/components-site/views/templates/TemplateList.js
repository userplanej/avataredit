import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import PanoramaIcon from '@mui/icons-material/Panorama';

import { setShowBackdrop } from '../../../redux/backdrop/backdropSlice';

import { getAllImagePackage } from '../../../api/image/package';

import { pathnameEnum } from '../../constants/Pathname';

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

  const [defaultTemplateList, setDefaultTemplateList] = useState([]);
  const [myTemplateList, setMyTemplateList] = useState([]);
  const [templateTab, setTemplateTab] = useState(0);

  useEffect(() => {
    loadTemplates();
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
    return myTemplateList.map((template) => {
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
    });
  }

  const displayTemplateItem = (template, firstSlide, isDraft) => {
    return (
      <Box sx={templateBoxStyle}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          onClick={() => handleClickTemplate(template.package_id, isDraft)}
        >
          <Box 
            sx={{ 
              backgroundColor: '#fff',
              width: '100%',
              height: isHome ? '180px' : '230px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundImage: firstSlide && firstSlide.html5_dir !== null ? `url(${firstSlide.html5_dir})` : '',
              backgroundPosition: 'center', /* Center the image */
              backgroundSize: 'cover'
            }}
          >
            {(firstSlide && (firstSlide.html5_dir === null || firstSlide.html5_dir === '')) && <PanoramaIcon fontSize="large" />}
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
            {displayTemplateList()}
          </Box>
        }

        {!isHome &&
          <Grid container sx={{ display: 'flex' }}>
            {displayTemplateList()}
          </Grid>
        }
    {/* </TabPanel> */}
    </Box>
  );
}
 
export default TemplateList;