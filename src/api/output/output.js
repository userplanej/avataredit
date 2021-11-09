import API from '../api';

const outputPath = 'output/';

export const postOutput = async (output) => {
  return await API.post(`${outputPath}create`, output);
}

export const getAllOutputs = async () => {
  return await API.get(`${outputPath}list`);
}

export const getOutput = async (id) => {
  return await API.get(`${outputPath}detail/${id}`);
}

export const updateOutput = async (id) => {
  return await API.put(`${outputPath}update/${id}`);
}

export const deleteOutput = async (id) => {
  return await API.delete(`${outputPath}delete/${id}`);
}