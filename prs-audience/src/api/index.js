import axios from 'axios';
import { apiPath, rootApiUrl } from '../config';
import * as config from '../config';
import CookieJS from 'js-cookie';
import { getCallbackUrl } from '../utils/storage';

if (config.isDev == false) {
  axios.defaults.withCredentials = true;
}

export const baseUrl = apiPath;

// ========================================
// Route: /api/audience/auth
// ========================================

export const loginByGoogle = async () => {
  const cb = getCallbackUrl();
  const query = (cb != null && cb != '') ? ('cb=' + cb) : ''
  window.location.href = rootApiUrl + '/api/audience/auth/google?' + query;
};

// ========================================
// Route: /api/audience
// ========================================

export const isAuthenticated = async () => {
  return axios.get(baseUrl + '/api/audience/verify');
};

export const getMyProfile = async () => {
  return axios.get(baseUrl + '/api/audience/me').then(res => res.data);
};

export const linkETH = ({ address, pkFileId }) => {
  return axios
    .post(baseUrl + '/api/audience/eth/update', {
      address,
      pkFileId
    })
    .then(res => res.data);
};

export const logout = async () => {
  // localStorage.clear();
  CookieJS.remove('PROFILE');
  CookieJS.remove('ENCRYPTED_INFO');
  return axios.get(baseUrl + '/api/audience/logout');
};

// ========================================
// Route: /api/audience/session
// ========================================

export const getSessionByCode = async code => {
  return axios
    .get(baseUrl + '/api/audience/session/code/' + code)
    .then(res => res.data);
};

// password: unrequired
export const getPollOfSession = async ({ sessionId, pollId, password }) => {
  return axios
    .post(
      baseUrl + '/api/audience/session/get/' + sessionId + '/poll/' + pollId,
      { password }
    )
    .then(res => res.data);
};

export const getHistorySessions = async () => {
  return axios
    .get(baseUrl + '/api/audience/session/history')
    .then(res => res.data);
};

export const getUpcommingPublicSession = async () => {
  return axios
    .get(baseUrl + '/api/audience/session/open/upcoming')
    .then(res => res.data);
};

export const getActivePublicSession = async () => {
  return axios
    .get(baseUrl + '/api/audience/session/open/active')
    .then(res => res.data);
};

// ========================================
// Route: /api/feedback
// ========================================

// export const guestCreateFeedback = async ({ sessionId, answers }) => {
//   return axios
//     .post(baseUrl + '/api/feedback/create/guest/session/' + sessionId, {
//       answers
//     })
//     .then(res => res.data);
// };

export const getAudienceFeedbackOfSession = async ({ sessionId }) => {
  return axios
    .get(baseUrl + '/api/feedback/a/get/session/' + sessionId)
    .then(res => res.data);
};

export const audienceCreateFeedback = async ({
  sessionId,
  answers,
  password,
  storeOnBlockchain
}) => {
  return axios
    .post(baseUrl + '/api/feedback/a/create/session/' + sessionId, {
      answers,
      password, // unrequired
      storeOnBlockchain
    })
    .then(res => res.data);
};

export const linkFeedbackTxHash = ({ txHash, blockId, txId }) => {
  return axios
    .post(baseUrl + '/api/feedback/a/transaction/' + txId, {
      hashId: txHash,
      blockId: 'Updating'
    })
    .then(res => res.data);
};

export const downloadFile = url => {
  return axios.get(url).then(res => res.data);
};
