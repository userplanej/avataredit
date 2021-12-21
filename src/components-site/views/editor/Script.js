import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ReactHowler from 'react-howler';
import { useDropzone } from 'react-dropzone';

import { Button, Grid, Tab, Tabs, Typography, Dialog, DialogTitle, DialogContent, CircularProgress, Chip } from '@mui/material';
import { Box } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

import MultilineInput from '../../inputs/MultilineInput';

import { getImageClip, updateImageClip } from '../../../api/image/clip';
import { requestTts } from '../../../api/mindslab';

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
  const dropzoneOptions = {
    noClick: true,
    noKeyboard: true,
    accept: 'audio/wav',
    maxFiles: 1,
    onDropAccepted: (file) => {
      setVoiceFile(file[0]);
    }
  }
  
  const { acceptedFiles, fileRejections, getRootProps, getInputProps, open } = useDropzone(dropzoneOptions);
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
  const [selectedVoice, setSelectedVoice] = useState(voices[0]);
  // Related to playing script sound
  const [playSound, setPlaySound] = useState(false);
  const [hasScriptChanged, setHasScriptChanged] = useState(true);
  const [soundSrc, setSoundSrc] = useState(null);
  const [isSoundLoading, setIsSoundLoading] = useState(false);
  const [isSoundPlaying, setIsSoundPlaying] = useState(false);
  // Voice file
  const [voiceFile, setVoiceFile] = useState(null);

  useEffect(() => {
    const script = activeSlide && activeSlide.text_script !== null ? activeSlide.text_script : '';
    setTextScript(script);
    updateNbCharLeft(script);
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
    setHasScriptChanged(true);
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

        props.onSaveSlide();
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

    if (!hasScriptChanged) {
      setPlaySound(true);
      setIsSoundPlaying(true);
      return;
    }

    setIsSoundLoading(true);

    requestTts(textScript, 'kor_female1').then(async (res) => {
      var reader = new FileReader();
      reader.readAsDataURL(res.data);
      reader.onloadend = function () {
        var b64 = reader.result.replace(/^data:.+;base64,/, '');
        var src = "data:audio/mp3;base64," + b64;
        setSoundSrc(src);
        setPlaySound(true);
      }
      setHasScriptChanged(false);
    });
  }

  const handleSoundLoaded = () => {
    setIsSoundLoading(false);
    setIsSoundPlaying(true);
  }

  const handleSoundEnded = () => {
    setIsSoundPlaying(false);
    setPlaySound(false);
  }

  // const uploadVoice = (event) => {
  //   event.preventDefault();
  //   let files = event.target.files;
  //   if (files) {
  //     const filePath = event.target.value;
  //     if (files && files.length > 0) {
  //       const file = files[0];
  //       if (!['audio/wav'].includes(file.type)) {
  //         showAlert('You can only upload wav files.', 'error');
  //         return;
  //       }
  //       setVoiceFile(file);
  //       const fileName = filePath.replace(/^.*?([^\\\/]*)$/, '$1');
  //       setVoiceFileName(fileName);
  //     }
  //   } else {
  //     files = event.dataTransfer.files;
  //     console.log(files)
  //   }
  //   // TODO: Store the file in server when generating video and keep the dir in slide
  // }

  const handleRemoveVoiceFile = () => {
    setVoiceFile(null);
  }

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '90%' }}>
        <Tabs value={activeTab} onChange={handleChangeTab} aria-label="basic tabs example" variant="fullWidth">
          <Tab label="Type your script" id="simple-tab-1" />
          <Tab label="Upload your voice" id="simple-tab-2" />
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
          <Grid item xs={8} sm={9} md={8} lg={8} xl={9}>
            {/* <Box 
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
                {selectedVoice && selectedVoice.label}
              </Box> */}
          </Grid>

          <Grid item xs={3} sm={3} md={4} lg={4} xl={3}>
            <Button variant="contained" sx={{ width: '100%'}} onClick={isSoundPlaying || isSoundLoading ? null : handlePlayScript}>
              {!isSoundPlaying && !isSoundLoading && 'Play script'}
              {!isSoundPlaying && isSoundLoading && <CircularProgress size={20} />}
              {!isSoundLoading && isSoundPlaying && <PauseIcon />}
            </Button>
          </Grid>
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
            { ...getRootProps({ className: 'dropzone' }) }
          >
              <Typography variant="h6" color="#fff">Drag and drop your own voice file</Typography>
              You can only upload one file and WAV format

              <Box sx={{ mt: 2, mb: 1, alignItems: 'center' }}>
                {acceptedFiles.length > 0 && voiceFile &&
                  <Box sx={{ display: 'flex', alignItems: 'center', wordBreak: 'break-all' }}>
                    <Chip label={voiceFile.path} onDelete={handleRemoveVoiceFile} sx={{ color: '#fff', backgroundColor: '#df678c' }} />
                    {/* <Typography color="#fff">{voiceFile.path}</Typography>
                    <CloseIcon fontSize="small" sx={{ cursor: 'pointer', color: "#df678c" }} onClick={handleRemoveVoiceFile} /> */}
                  </Box>
                }
                {fileRejections.length > 0  && <Typography color="red">{fileRejections[0].errors.map(e => e.message)}</Typography>}
              </Box>
              <input id="upload-voice" { ...getInputProps() } />
              <Button fullWidth variant="contained" color="secondary" sx={{ maxWidth: '100%' }} onClick={open}>Browse file</Button>
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
          {/* <Typography variant="subtitle1">Recommended voices</Typography> */}
            
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

          {/* <Typography variant="subtitle1">Other voices</Typography> */}
        </DialogContent>
      </Dialog>

      {soundSrc !== null && <ReactHowler
        src={soundSrc}
        playing={playSound}
        volume={0.6}
        onLoad={handleSoundLoaded}
        onEnd={handleSoundEnded}
      />}
    </Box>
  );
}
 
export default Script;