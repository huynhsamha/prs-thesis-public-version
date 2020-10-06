import axios from 'axios';
import qs from 'qs';
import Cookies from 'js-cookie';
import { apiPath } from '../config';

axios.defaults.withCredentials = true;

export const baseUrl = apiPath;

// ========================================
// Route: /api/admin
// ========================================

export const isAuthenticated = async () => {
  return axios.get(baseUrl + '/api/admin/auth/verify');
};

export const logout = async () => {
  return axios.get(baseUrl + '/api/admin/logout');
};

export const login = async ({ username, password }) => {
  const data = { username, password };
  return axios.post(baseUrl + '/api/admin/login', data).then(res => res.data);
};

// ========================================
// Route: /api/admin/editor
// ========================================

export const getAllEditor = async () => {
  return axios.get(baseUrl + '/api/admin/editor').then(res => res.data);
};

export const createEditor = async ({ email }) => {
  const data = { email };
  return axios.post(baseUrl + '/api/admin/editor', data).then(res => res.data);
};

// ========================================
// Route: /api/admin/audience
// ========================================

export const getAllAudience = async () => {
  return axios.get(baseUrl + '/api/admin/audience').then(res => res.data);
};

export const getActiveAudience = async () => {
  return axios
    .get(baseUrl + '/api/admin/audience/active')
    .then(res => res.data);
};

export const getBanAudience = async () => {
  return axios
    .get(baseUrl + '/api/admin/audience/disable')
    .then(res => res.data);
};

export const disableAudience = async ({ userId }) => {
  return axios
    .post(baseUrl + '/api/admin/audience/' + userId + '/disable')
    .then(res => res.data);
};

export const enableAudience = async ({ userId }) => {
  return axios
    .post(baseUrl + '/api/admin/audience/' + userId + '/enable')
    .then(res => res.data);
};

export const deleteAudience = async ({ userId }) => {
  return axios
    .post(baseUrl + '/api/admin/audience/' + userId + '/delete')
    .then(res => res.data);
};

export const createAudience = async ({ email }) => {
  const data = { email };
  return axios
    .post(baseUrl + '/api/admin/audience', data)
    .then(res => res.data);
};
