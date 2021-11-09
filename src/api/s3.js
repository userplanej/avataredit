import API from './api';

const s3Path = 's3-images/mindslab';

export const uploadFile = async (file) => {
  return await API.post(s3Path, file);
}

export const deleteFile = async (file) => {
  return await API.post(`${s3Path}/delete`, file);
}