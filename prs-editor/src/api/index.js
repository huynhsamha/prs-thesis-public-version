import axios from 'axios';
import { apiPath, rootApiUrl } from '../config';

import * as config from '../config';

if (config.isDev == false) {
  axios.defaults.withCredentials = true;
}

export const baseUrl = apiPath;

// ========================================
// Route: /api/editor/auth
// ========================================

export const loginByGoogle = async () => {
  window.location.href = rootApiUrl + '/api/editor/auth/google';
};

// ========================================
// Route: /api/editor
// ========================================

export const isAuthenticated = async () => {
  return axios.get(baseUrl + '/api/editor/verify');
};

export const getMyProfile = async () => {
  return axios.get(baseUrl + '/api/editor/me').then(res => res.data);
};

export const logout = async () => {
  return axios.get(baseUrl + '/api/editor/logout');
};

export const login = async ({ username, password }) => {
  const data = { username, password };
  return axios
    .post(baseUrl + '/api/editor/login', data)
    .then(res => res.data)
    .then(data => {
      const { userInfo } = data;
      storeUserInfo(userInfo);
      return data;
    });
};

function storeUserInfo(userInfo) {
  localStorage.setItem('userInfo', JSON.stringify(userInfo));
}

export const getUserInfo = async () => {
  return JSON.parse(localStorage.getItem('userInfo'));
};

// ========================================
// Route: /api/poll
// ========================================

export const createPoll = async data => {
  return axios
    .post(baseUrl + '/api/poll/mypoll/create', data)
    .then(res => res.data);
};

export const updatePoll = async data => {
  return axios
    .post(baseUrl + '/api/poll/mypoll/update', data)
    .then(res => res.data);
};

export const getMyPoll = async () => {
  return axios.get(baseUrl + '/api/poll/mypoll/').then(res => res.data);
};

export const getMyPollTypeSurvey = async () => {
  return axios.get(baseUrl + '/api/poll/mypoll/survey/').then(res => res.data);
};

export const getMyPollTypeQuiz = async () => {
  return axios.get(baseUrl + '/api/poll/mypoll/quiz/').then(res => res.data);
};

export const getOnePoll = async pollId => {
  return axios
    .get(baseUrl + '/api/poll/mypoll/get/' + pollId)
    .then(res => res.data);
};

// ========================================
// Route: /api/session
// ========================================

export const createSession = async data => {
  return axios
    .post(baseUrl + '/api/session/create', data)
    .then(res => res.data);
};

export const updateSession = async data => {
  return axios.post(baseUrl + '/api/session/edit', data).then(res => res.data);
};

export const getAllSessions = async () => {
  return axios.get(baseUrl + '/api/session/listAll').then(res => res.data);
};

export const getActiveSessions = async () => {
  return axios.get(baseUrl + '/api/session/listActive').then(res => res.data);
};

export const getFutureSessions = async () => {
  return axios.get(baseUrl + '/api/session/listWaiting').then(res => res.data);
};

export const getCompleteSessions = async () => {
  return axios.get(baseUrl + '/api/session/listComplete').then(res => res.data);
};

export const getOneSession = async id => {
  return axios.get(baseUrl + '/api/session/get/' + id).then(res => res.data);
};

export const getSessionByCode = async code => {
  return axios.get(baseUrl + '/api/session/code/' + code).then(res => res.data);
};

// ========================================
// Route: /api/feedback
// ========================================

export const getFeedbackOfSession = async sessionId => {
  return axios
    .get(baseUrl + '/api/feedback/o/session/' + sessionId)
    .then(res => res.data);
};

export const getFeedbackOfSessionWithUserInfo = async sessionId => {
  return axios
    .get(baseUrl + '/api/feedback/o/session/' + sessionId + '/userinfo')
    .then(res => res.data);
};
