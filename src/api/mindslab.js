import axios from "axios";

const url = 'http://serengeti2.maum.ai/api.app/app/v2/handle/catalog/instance/lifecycle/executes';

const getHeaders = () => {
  return {
    AccessKey: 'SerengetiAdministrationAccessKey',
    SecretKey: 'SerengetiAdministrationSecretKey',
    LoginId: 'maum-orchestra-com'
  };
}

export const requestVideo = async (props) => {
  const {
    /**
     * Background png file
     */
    file,
    /**
     * Script text
     */
    script,
    /**
     * Avatar action
     */
    action,
    /**
     * Model type
     */
    model
  } = props;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('lifecycleName', 'Studio-Main-Action-Lifecycle');
  formData.append('catalogInstanceName', 'Studio-Main-Action-Catalog');
  formData.append('target', 'SoftwareCatalogInstance');
  formData.append('async', false);

  let payload = {
    "text": script,
    "width": "1280",
    "height": "720",
    "speaker_id": "0",
    "action": action,
    "modelType": model,
    "apiId": "hoho105e032bc05d138",
    "apiKey": "563e1097eeb64c5897990c43d391203d"
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