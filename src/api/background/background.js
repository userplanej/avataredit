import API from '../api';

const backgroundPath = 'background/';

export const postBackground = async (background) => {
  return await API.post(`${backgroundPath}create`, background);
}

export const getAllBackgrounds = async () => {
  return await API.get(`${backgroundPath}list`);
}

export const getAllUserBackgrounds = async (id) => {
  return await API.get(`${backgroundPath}list?user_id=${id}`);
}

export const getAllDefaultBackgrounds = async () => {
  return await API.get(`${backgroundPath}list?is_upload=false`);
}

export const getBackground = async (id) => {
  return await API.get(`${backgroundPath}detail/${id}`);
}

export const updateBackground = async (id, background) => {
  return await API.put(`${backgroundPath}update/${id}`, background);
}

export const deleteBackground = async (id) => {
  return await API.delete(`${backgroundPath}delete/${id}`);
}