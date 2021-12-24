import axios from 'axios';

const API = axios.create({
  baseURL: 'http://18.189.13.6:6000/'
});

const path = 'joinvideo';

export const joinVideo = async (filepaths) => {
  return await API.post(`${path}`, filepaths);
}