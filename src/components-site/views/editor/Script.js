import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

import { Button, Grid, Tab, Tabs, Typography, Dialog, DialogTitle, DialogContent } from '@mui/material';
import { Box } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

import MultilineInput from '../../inputs/MultilineInput';

import { getImageClip, updateImageClip } from '../../../api/image/clip';

import { setActiveSlide, setIsSaving } from '../../../redux/video/videoSlice';

import { showAlert } from '../../../utils/AlertUtils';

const defaultNbCharLeft = 3500;

const voices = [
  {
    id: 1,
    value: 'English',
    label: 'English (US) - Professional'
  },
  {
    id: 2,
    value: 'English',
    label: 'English (US) - Natural'
  },
  {
    id: 3,
    value: 'English',
    label: 'English (US) - Expressive'
  },
  {
    id: 4,
    value: 'English',
    label: 'English (GB) - Narration'
  },
  {
    id: 5,
    value: 'Spanish',
    label: 'Spanish (SP) - Expressive'
  },
];

const Script = (props) => {
  const dispatch = useDispatch();
  const activeSlide = useSelector(state => state.video.activeSlide);
  const activeSlideId = useSelector(state => state.video.activeSlideId);

  // Store active tab index
  const [activeTab, setActiveTab] = useState(0);
  // Store text value of script
  const [textScript, setTextScript] = useState('');
  // Store remaining number of characters for script text
  const [nbCharLeft, setNbCharLeft] = useState(defaultNbCharLeft);
  // Boolean to show voices dialog
  const [openVoiceDialog, setOpenVoiceDialog] = useState(false);
  // Store current selected voice
  const [selectedVoice, setSelectedVoice] = useState(null);

  useEffect(() => {
    const script = activeSlide && activeSlide.text_script !== null ? activeSlide.text_script : '';
    setTextScript(script);
    updateNbCharLeft(script);
    
    // NOTE: Temporary (due to hiding functionalities)
    props.setTextScript(script);
  }, [activeSlide]);

  // Action triggered when changing tab
  const handleChangeTab = (event, value) => {
		setActiveTab(value);
	}

  const handleOpenVoice = () => {
    setOpenVoiceDialog(true);
  }

  const handleCloseVoiceDialog = () => {
    setOpenVoiceDialog(false);
  }

  // Action triggered when changing script text
  const handleChangeTextScript = (event) => {
    const value = event.target.value;
    setTextScript(value);
    updateNbCharLeft(value);

    // NOTE: Temporary (due to hiding functionalities)
    props.setTextScript(value);
  }

  const updateNbCharLeft = (script) => {
    const newNbCharLeft = defaultNbCharLeft - script.length;
    setNbCharLeft(newNbCharLeft);
  }

  const handleSaveTextScript = async (event) => {
    if (activeSlide.text_script === textScript) {
      return;
    }

    dispatch(setIsSaving(true));

    const script = event.target.value;
    
    const dataToSend = {
      text_script: script
    }

    await updateImageClip(activeSlideId, dataToSend).then(async () => {
      await getImageClip(activeSlideId).then((res) => {
        const clip = res.data.body;
        dispatch(setActiveSlide(clip));

        dispatch(setIsSaving(false));
      });
    });
  }

  // Action triggered when selecting a voice
  const handleChangeVoice = (voice) => {
    setSelectedVoice(voice);
    handleCloseVoiceDialog();
  }

  const handlePlayScript = async () => {
    if (textScript === null || textScript === '') {
      showAlert('The slide has no script. Please type a script.', 'error')
      return;
    }

    const formData = new FormData();
    formData.append('lifecycleName', 'TTS-only-Lifecycle');
    formData.append('catalogInstanceName', 'TTS-only-Catalog');
    formData.append('target', 'SoftwareCatalogInstance');
    formData.append('async', false);

    let payload = {
      'text': textScript,
      'voiceName': 'kor_female1',
      'apiId': 'ryu',
      'apiKey': 'd0cad9547b9c4a65a5cdfe50072b1588'
    };

    formData.append('payload', JSON.stringify(payload));

    const url = 'http://serengeti.maum.ai/api.app/app/v2/handle/catalog/instance/lifecycle/executes';
    const headers = {
      AccessKey: 'SerengetiAdministrationAccessKey',
      SecretKey: 'SerengetiAdministrationSecretKey',
      LoginId: 'maum-orchestra-com'
    }

    await axios({
      method: 'post',
      url: url, 
      data: formData,
      headers: headers
    }).then(async (res) => {
      const blob = new Blob([res.data], { type: 'audio/mp3' });
      // const file = new File(blob, "test.wav", { type: "audio/wav" });
      const url = URL.createObjectURL(blob);
      console.log(url)
      const audio = new Audio(url)
      audio.load()
      await audio.play();

      // var a = document.createElement("a");
      // a.href = url;
      // a.download = "test.wav";
      // a.click();
    });
  }

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '90%' }}>
        <Tabs value={activeTab} onChange={handleChangeTab} aria-label="basic tabs example" variant="fullWidth">
          <Tab label="Type your script" id="simple-tab-1" />
          {/* <Tab label="Upload your voice" id="simple-tab-2" /> */}
        </Tabs>
      </Box>
      
      <div
        role="tabpanel"
        hidden={activeTab !== 0}
        id={`vertical-tabpanel-${0}`}
        aria-labelledby={`vertical-tab-${0}`}
        style={{ width: '90%', backgroundColor: '#3c4045' }}
      >
        <Box sx={{ px: 2, pt: 2, width: '100%' }}>
          <MultilineInput
            minRows={8}
            maxRows={15}
            maxLength={3500}
            value={textScript}
            onChange={handleChangeTextScript}
            onBlur={handleSaveTextScript}
            sx={{ 
              pb: 3, 
              color: '#000',
              backgroundColor: '#fff', 
              ':focus-within': {
                backgroundColor: '#fff',
                border: '2px solid #e8dff4'
              },
              ':hover': {
                backgroundColor: '#fff'
              },
              'textarea': {
                resize: 'vertical'
              }
            }}
          />

          <Grid container sx={{ position: 'relative', px: 1, top: '-28px', justifyContent: 'space-between' }}>
            <Grid item>
              <Typography variant="caption" color="#9a9a9a" sx={{ cursor: 'pointer' }}>Issues with pronunciation or pauses? Click here.</Typography>
            </Grid>
            <Grid item>
              <Typography variant="caption" color="#9a9a9a">{nbCharLeft} characters left</Typography>
            </Grid>
          </Grid>
        </Box>

        <Grid container sx={{ px: 2, pb: 2, display: 'flex', alignItems: 'center' }}>
          {/* <Grid item xs={8} sm={9} md={8} lg={8} xl={9}>
            <Box 
              onClick={handleOpenVoice}
              sx={{ 
                textAlign: 'center', 
                py: 1, 
                height: '48px',
                color: '#fff', 
                borderRadius: '4px', 
                border: 'solid 2px #feffff', 
                backgroundColor: '#202427', 
                width: '95%',
                cursor: 'pointer'
              }}>
                {selectedVoice && selectedVoice.value}
              </Box>
          </Grid> */}

          {/* <Grid item xs={3} sm={3} md={4} lg={4} xl={3}>
            <Button variant="contained" sx={{ width: '100%'}} onClick={handlePlayScript}>
              Play script
            </Button>
          </Grid> */}
        </Grid>
      </div>

      <div
        role="tabpanel"
        hidden={activeTab !== 1}
        id={`vertical-tabpanel-${1}`}
        aria-labelledby={`vertical-tab-${1}`}
        style={{ width: '90%', backgroundColor: '#3c4045' }}
      >
        <Box sx={{ p: 3, width: '100%', color: '#fff' }}>
          <b>To get the greatest results, make sure your audio is clean and free of background noise, music, and other distractions.</b>
          The duration of the audio is limited to 5 minutes. Please select the language of the audio recording before submitting.
        </Box>

        <Box sx={{ p: 3 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              color: '#9a9a9a',
              padding: '34px 17px 16px 15px',
              borderRadius: '6px',
              backgroundColor: '#202427',              
            }}
          >
              <Typography variant="h6" color="#fff">Drag and drop your own voice file</Typography>
              You can upload in mp3, mp4, m4a, FLAC, and WAV formats

              <Button fullWidth variant="contained" color="secondary" sx={{ mt: 6, maxWidth: '100%' }}>Browse file</Button>
          </Box>
        </Box>
      </div>

      <Dialog
        maxWidth="md"
        fullWidth
        open={openVoiceDialog}
        aria-labelledby="voices-dialog-title"
        aria-describedby="voices-dialog-description"
      >
        <DialogTitle id="voices-dialog-title" sx={{ textAlign: 'right' }}>
          <CloseIcon fontSize="large" onClick={handleCloseVoiceDialog} sx={{ cursor: 'pointer' }} />
        </DialogTitle>

        <DialogContent>
          <Typography variant="h5">Select voice</Typography>
          <Typography variant="subtitle1">Recommended voices</Typography>
            
          <Box sx={{ mt: 1 }}>
            {voices.map(voice => {
              return (
                <Grid
                  container
                  columns={13}
                  key={voice.id} 
                  onClick={() => handleChangeVoice(voice)}
                  sx={{
                    padding: '10px', 
                    cursor: 'pointer', 
                    ':hover': { backgroundColor: '#e8e9e9' },
                    backgroundColor: selectedVoice && selectedVoice.id === voice.id ? '#3c4045' : null,
                    color: selectedVoice && selectedVoice.id === voice.id ? '#fff' : null
                  }}
                >
                  <Grid item xs={2} sm={1} sx={{ display: 'flex', alignItems: 'center'}}>
                    {selectedVoice && selectedVoice.id === voice.id && <PlayArrowIcon />}
                  </Grid>
                  
                  <Grid item xs={11} sm={12}>
                    <Typography variant="h6" sx={{ color: selectedVoice && selectedVoice.id === voice.id ? '#fff' : null }}>
                      {voice.label}
                    </Typography>
                  </Grid>
                </Grid>
              )
            })}
          </Box>

          <Typography variant="subtitle1">Other voices</Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
 
export default Script;