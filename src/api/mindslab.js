import axios from "axios";

const url = 'http://serengeti.maum.ai/api.app/app/v2/handle/catalog/instance/lifecycle/executes';

const getHeaders = () => {
  return {
    AccessKey: 'SerengetiAdministrationAccessKey',
    SecretKey: 'SerengetiAdministrationSecretKey',
    LoginId: 'maum-orchestra-com'
  };
}

export const requestVideo = async (file, script) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('lifecycleName', 'Studio_Main_Action_Lifecycle');
  formData.append('catalogInstanceName', 'Studio_Main_Action_Catalog1');
  formData.append('target', 'SoftwareCatalogInstance');
  formData.append('async', false);

  let payload = {
    "text": script,
    "width": "1280",
    "height": "720",
    "speaker": "0",
    "action": "greeting",
    "model": "daon",
    "transparent": "false",
    "resolution": "HD",
    "apiId": "ryu",
    "apiKey": "d0cad9547b9c4a65a5cdfe50072b1588"
  };

  formData.append('payload', JSON.stringify(payload));

  const headers = getHeaders();

  return await axios({
    method: 'post',
    url: url, 
    data: formData,
    headers: headers,
    responseType: 'blob'
  });
}

export const requestTts = async (script, voiceName) => {
  const formData = new FormData();
  formData.append('lifecycleName', 'TTS-only-Lifecycle');
  formData.append('catalogInstanceName', 'TTS-only-Catalog');
  formData.append('target', 'SoftwareCatalogInstance');
  formData.append('async', false);

  let payload = {
    'text': script,
    'voiceName': voiceName,
    'apiId': 'ryu',
    'apiKey': 'd0cad9547b9c4a65a5cdfe50072b1588'
  };

  formData.append('payload', JSON.stringify(payload));

  const headers = getHeaders();

  return await axios({
    method: 'post',
    url: url, 
    data: formData,
    headers: headers,
    responseType: 'blob'
  });
}