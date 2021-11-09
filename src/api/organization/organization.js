import API from '../api';

const organizationPath = 'organization/';

export const postOrganization = async (organization) => {
  return await API.post(`${organizationPath}create`, organization);
}

export const getAllOrganizations = async () => {
  return await API.get(`${organizationPath}list`);
}

export const getOrganization = async (id) => {
  return await API.get(`${organizationPath}detail/${id}`);
}

export const updateOrganization = async (id) => {
  return await API.put(`${organizationPath}update/${id}`);
}

export const deleteOrganization = async (id) => {
  return await API.delete(`${organizationPath}delete/${id}`);
}