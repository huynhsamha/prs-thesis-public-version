import * as api from '../api';

export const getMyProfile = () =>
  new Promise((resolve, reject) => {
    const profile = localStorage.getItem('PROFILE');
    if (profile) return resolve(JSON.parse(profile));
    api
      .getMyProfile()
      .then(profile => {
        localStorage.setItem('PROFILE', JSON.stringify(profile));
        resolve(profile);
      })
      .catch(err => reject(err));
  });
