import API from '../api';

const imagePackagePath = 'imagepackage/';

export const postImagePackage = async (imagePackage) => {
  return await API.post(`${imagePackagePath}create`, imagePackage);
}

export const getAllImagePackage = async (id, isTemplate, isRecent) => {
  return await API.get(`${imagePackagePath}list?is_template=${isTemplate}${id ? `&user_id=${id}` : ''}${isRecent ? '&recent=true' : ''}`);
}

export const getImagePackage = async (id) => {
  return await API.get(`${imagePackagePath}detail/${id}`);
}

export const updateImagePackage = async (id, imagePackage) => {
  return await API.put(`${imagePackagePath}update/${id}`, imagePackage);
}

export const deleteImagePackage = async (id) => {
  return await API.delete(`${imagePackagePath}delete/${id}`);
}