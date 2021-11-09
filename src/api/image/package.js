import API from '../api';

const imagePackagePath = 'imagepackage/';

export const postImagePackage = async (imagePackage) => {
  return await API.post(`${imagePackagePath}create`, imagePackage);
}

export const getAllImagePackage = async () => {
  return await API.get(`${imagePackagePath}list`);
}

export const getImagePackage = async (id) => {
  return await API.get(`${imagePackagePath}detail/${id}`);
}

export const updateImagePackage = async (id) => {
  return await API.put(`${imagePackagePath}update/${id}`);
}

export const deleteImagePackage = async (id) => {
  return await API.delete(`${imagePackagePath}delete/${id}`);
}