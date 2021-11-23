import API from '../api';

const imagePath = 'imagelist/';

export const postImage = async (image) => {
  return await API.post(`${imagePath}create`, image);
}

export const getAllUserImages = async (id) => {
  return await API.get(`${imagePath}list?user_id=${id}`);
}

export const getAllDefaultImages = async () => {
  return await API.get(`${imagePath}list?is_upload=false`);
}

export const getImage = async (id) => {
  return await API.get(`${imagePath}detail/${id}`);
}

export const updateImage = async (id, image) => {
  return await API.put(`${imagePath}update/${id}`, image);
}

export const deleteImage = async (id) => {
  return await API.delete(`${imagePath}delete/${id}`);
}