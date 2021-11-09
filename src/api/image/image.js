import API from '../api';

const imagePath = 'imagelist/';

export const postImage = async (image) => {
  return await API.post(`${imagePath}create`, image);
}

export const getAllImages = async () => {
  return await API.get(`${imagePath}list`);
}

export const getImage = async (id) => {
  return await API.get(`${imagePath}detail/${id}`);
}

export const updateImage = async (id) => {
  return await API.put(`${imagePath}update/${id}`);
}

export const deleteImage = async (id) => {
  return await API.delete(`${imagePath}delete/${id}`);
}