import API from './api';

const path = 'uploadFiles';

export const uploadFile = async (file, type) => {
  return await API.post(`${path}/upload?type=${type}`, file);
}

export const deleteFile = async (file) => {
  return await API.post(`${path}/delete`, file);
}