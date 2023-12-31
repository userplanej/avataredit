import API from '../api';

const userPath = 'userMindsLab/';

export const postUser = async (user) => {
  return await API.post(`${userPath}create`, user);
}

export const getAllUsers = async () => {
  return await API.get(`${userPath}list`);
}

export const getUser = async (id) => {
  return await API.get(`${userPath}detail/${id}`);
}

export const updateUser = async (id, user) => {
  return await API.put(`${userPath}update/${id}`, user);
}

export const deleteUser = async (id) => {
  return await API.delete(`${userPath}delete/${id}`);
}

export const signInUser = async (user) => {
  return await API.post(`${userPath}signIn`, user);
}

export const sendCode = async (data) => await API.post(`${userPath}sendcode`, data);

export const checkCode = async (data) => await API.post(`${userPath}checkcode`, data);

export const defineNewPassword = async (data) => await API.post(`${userPath}newpassword`, data);