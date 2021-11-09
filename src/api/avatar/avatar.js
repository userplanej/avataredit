import API from '../api';

const avatarPath = 'avatartemplate/';

export const postAvatar = async (avatar) => {
  return await API.post(`${avatarPath}create`, avatar);
}

export const getAllAvatars = async () => {
  return await API.get(`${avatarPath}list`);
}

export const getAvatar = async (id) => {
  return await API.get(`${avatarPath}detail/${id}`);
}

export const updateAvatar = async (id) => {
  return await API.put(`${avatarPath}update/${id}`);
}

export const deleteAvatar = async (id) => {
  return await API.delete(`${avatarPath}delete/${id}`);
}