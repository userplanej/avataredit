import API from '../api';

const ttsPath = 'texttospeech/';

export const postTts = async (tts) => {
  return await API.post(`${ttsPath}create`, tts);
}