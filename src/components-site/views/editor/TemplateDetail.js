import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';

import { Grid, Box, Typography } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

import { uploadFile } from '../../../api/s3';
import { postImageClip } from '../../../api/image/clip';

import { setActiveSlide, setActiveSlideId, setIsSaving, setIsLoadSlide } from '../../../redux/video/videoSlice';

const TemplateDetail = (props) => {
  const { userTemplates, reloadSlides, video } = props;
  const dispatch = useDispatch();

  const [templateSelected, setTemplateSelected] = useState(null);
  const [isList, setIsList] = useState(true);

  const handleClickTemplate = (template) => {
    setTemplateSelected(template);
    setIsList(false);
  }

  const handleClickSlide = async (slide) => {
    dispatch(setIsSaving(true));

    const packageId = video.package_id;

    let newLocation = null;
    // Duplicate slide thumbnail
    const slideImage = slide.html5_dir;
    await axios.get(slideImage, { responseType: 'blob' }).then(async (res) => {
      const blob = res.data;
      const filename = `video-${packageId}-slide-${new Date().getTime()}`;
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
    delete imageClip.clip_id;
    delete imageClip.create_date;
    delete imageClip.update_date;

    await postImageClip(imageClip).then(async (res) => {
      const clip = res.data.body;
      const clipId = res.data.body.clip_id;
      dispatch(setActiveSlide(clip));
      dispatch(setActiveSlideId(clipId));
      await reloadSlides().then(() => dispatch(setIsLoadSlide(true)));
      dispatch(setIsSaving(false));
    });
  }

  const handleBackToList = () => {
    setTemplateSelected(null);
    setIsList(true);
  }

  return (
    <Box>
      {isList && 
        <Typography variant="h6" sx={{ mb: 1 }}>Select template</Typography>
      }

      {!isList && templateSelected &&
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, cursor: 'pointer' }} onClick={handleBackToList}>
          <ArrowBackIosNewIcon fontSize="small" sx={{ color: "#fff", mr: 1 }} />
          <Typography variant="h6">{templateSelected.package_name}</Typography>
        </Box>
      }
      
      <Grid container spacing={2}>
        {isList && userTemplates && userTemplates.length > 0 &&
          userTemplates.map((template) => {
            const firstSlide = template.image_clips[0];
            return (
              <Grid item sm={6} md={3} lg={6} sx={{ cursor: 'pointer' }} onClick={() => handleClickTemplate(template)}>
                <img alt={template.package_name} src={firstSlide.html5_dir} style={{ minHeight: '150px', width: '100%', borderRadius: '6px' }} />
                <Typography variant="body1" color="#fff" sx={{ mt: 1, wordBreak: 'break-all' }}>{template.package_name}</Typography>
              </Grid>
            );
          }
        )}

        {!isList && templateSelected && templateSelected.image_clips && templateSelected.image_clips.length > 0 &&
          templateSelected.image_clips.map((slide) => {
            return (
              <Grid item sm={6} md={3} lg={6} sx={{ cursor: 'pointer' }} onClick={() => handleClickSlide(slide)}>
                <img src={slide.html5_dir} style={{ minHeight: '150px', width: '100%', borderRadius: '6px' }} />
              </Grid>
            )
          })
        }
      </Grid>
    </Box>
  );
}
 
export default TemplateDetail;