import API from '../api';

const videoPath = 'videolist/';

export const postVideo = async (video) => {
  return await API.post(`${videoPath}create`, video);
}

export const getAllVideos = async () => {
  return await API.get(`${videoPath}list`);
}

export const getVideo = async (id) => {
  return await API.get(`${videoPath}detail/${id}`);
}

export const updateVideo = async (id) => {
  return await API.put(`${videoPath}update/${id}`);
}

export const deleteVideo = async (id) => {
  return await API.delete(`${videoPath}delete/${id}`);
}