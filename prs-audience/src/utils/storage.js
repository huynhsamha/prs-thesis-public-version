import * as api from '../api';
import crypto from 'crypto-js';
import CookieJS from 'js-cookie';

const getEncryptKey = ({ email }) => {
  return crypto.MD5(`h8eT4$@${email}^&*dK01`).toString();
};

const decryptInfo = ({ encryptedInfo, email }) => {
  const encryptKey = getEncryptKey({ email });
  const bytes = crypto.AES.decrypt(encryptedInfo, encryptKey);
  const jsonString = bytes.toString(crypto.enc.Utf8);
  return JSON.parse(jsonString);
};

const encryptInfo = ({ info, email }) => {
  const encryptKey = getEncryptKey({ email });
  // console.log(encryptKey);
  const bytes = crypto.AES.encrypt(JSON.stringify(info), encryptKey);
  const data = bytes.toString();
  // console.log(data);
  return data;
};

// encryptInfo({
//   info: { pk: 'this is private key' },
//   email: 'huynhha12798@gmail.com'
// });

// const info = decryptInfo({
//   encryptedInfo:
//     'U2FsdGVkX1/kSdOCs/2N2fJBI+aTyJAkSPtbFex6sF5Rk+QhAaaCK+eC7X2wTn2P',
//   email: 'huynhha12798@gmail.com'
// });
// console.log(info);

export const getEtherPrivatekey = () =>
  new Promise((resolve, reject) => {
    getMyProfile()
      .then(profile => profile.email)
      .then(email => {
        // const encryptedInfo = localStorage.getItem('ENCRYPTED_INFO');
        const encryptedInfo = CookieJS.get('ENCRYPTED_INFO');
        if (encryptedInfo) {
          const info = decryptInfo({ encryptedInfo, email });
          resolve(info.pk);
        } else {
          reject(new Error('Not found'));
        }
      })
      .catch(err => reject(err));
  });

export const storeEtherPrivateKey = ({ privateKey }) =>
  new Promise((resolve, reject) => {
    getMyProfile()
      .then(profile => profile.email)
      .then(email => {
        // const encryptedInfo = localStorage.getItem('ENCRYPTED_INFO');
        const encryptedInfo = CookieJS.get('ENCRYPTED_INFO');
        let info = {};
        if (encryptedInfo) {
          info = decryptInfo({ encryptedInfo, email });
        }
        info.pk = privateKey;
        const newEncryptedInfo = encryptInfo({ info, email });
        // localStorage.setItem('ENCRYPTED_INFO', newEncryptedInfo);
        CookieJS.set('ENCRYPTED_INFO', newEncryptedInfo, {
          expires: new Date(Date.now() + 60 * 60 * 1000)
        });
        resolve('Success');
      })
      .catch(err => reject(err));
  });

export const getMyProfile = () =>
  new Promise((resolve, reject) => {
    // const profile = localStorage.getItem('PROFILE');
    const profile = CookieJS.get('PROFILE');
    if (profile) return resolve(JSON.parse(profile));
    api
      .getMyProfile()
      .then(profile => {
        // localStorage.setItem('PROFILE', JSON.stringify(profile));
        CookieJS.set('PROFILE', JSON.stringify(profile), {
          expires: new Date(Date.now() + 6 * 60 * 60 * 1000)
        });
        resolve(profile);
      })
      .catch(err => reject(err));
  });

export const forceGetProfile = () =>
  new Promise((resolve, reject) => {
    api
      .getMyProfile()
      .then(profile => {
        // localStorage.setItem('PROFILE', JSON.stringify(profile));
        CookieJS.set('PROFILE', JSON.stringify(profile), {
          expires: new Date(Date.now() + 6 * 60 * 60 * 1000)
        });
        resolve(profile);
      })
      .catch(err => reject(err));
  });

// setTimeout(() => {
//   console.log('Get');
//   getEtherPrivatekey()
//     .then(pk => {
//       console.log(pk);
//     })
//     .catch(err => {
//       console.log(err);

//       storeEtherPrivateKey({ privateKey: 'This is private key' })
//         .then(() => {
//           console.log('Stored');
//           setTimeout(() => {
//             console.log('Re-get');
//             getEtherPrivatekey()
//               .then(pk => {
//                 console.log(pk);
//               })
//               .catch(err => {
//                 console.log(err);
//               }, 500);
//           });
//         })
//         .catch(err => {
//           console.log(err);
//         });
//     });
// }, 1000);


export const setCallbackUrl = (cb) => {
  CookieJS.set('CB_URL', cb, {
    expires: new Date(Date.now() + 15 * 60 * 1000)
  });
}

export const getCallbackUrl = () => {
  return CookieJS.get('CB_URL');
}

export const removeCallbackUrl = (cb) => {
  CookieJS.remove('CB_URL')
}
