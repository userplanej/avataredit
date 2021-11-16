import API from '../api';

const imageClipPath = 'imageclip/';

export const postImageClip = async (imageClip) => {
  return await API.post(`${imageClipPath}create`, imageClip);
}

export const getAllImageClip = async () => {
  return await API.get(`${imageClipPath}list`);
}

export const getImageClip = async (id) => {
  return await API.get(`${imageClipPath}detail/${id}`);
}

export const updateImageClip = async (id, clip) => {
  return await API.put(`${imageClipPath}update/${id}`, clip);
}

export const deleteImageClip = async (id) => {
  return await API.delete(`${imageClipPath}delete/${id}`);
}