import API from '../api';

const shapePath = 'shape/';

export const postShape = async (shape) => {
  return await API.post(`${shapePath}create`, shape);
}

export const getAllShapes = async () => {
  return await API.get(`${shapePath}list`);
}

export const getShape = async (id) => {
  return await API.get(`${shapePath}detail/${id}`);
}

export const updateShape = async (id) => {
  return await API.put(`${shapePath}update/${id}`);
}

export const deleteShape = async (id) => {
  return await API.delete(`${shapePath}delete/${id}`);
}