import API from './api';

const s3Path = 's3MindsLab';

export const uploadFile = async (file, type) => {
  return await API.post(`${s3Path}/upload?type=${type}`, file);
}

export const deleteFile = async (file) => {
  return await API.delete(`${s3Path}/delete`, file);
}