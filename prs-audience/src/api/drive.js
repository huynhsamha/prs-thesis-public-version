import moment from 'moment';

export const gapi = window.gapi;

export const DirName = 'PRS-Ethereum-Account';

// Client ID and API key from the Developer Console
export const CLIENT_ID =
  '775711866365-20skch5ac4mss4hpplhp13ngpr2giq9p.apps.googleusercontent.com';
export const API_KEY = 'AIzaSyBozVoJks3jF7EwpoLdGXmzMC_dHhgK51I';

// Array of API discovery doc URLs for APIs used by the quickstart
export const DISCOVERY_DOCS = [
  'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'
];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
// export const SCOPES = 'https://www.googleapis.com/auth/drive.metadata.readonly';
export const SCOPES = [
  'https://www.googleapis.com/auth/drive.metadata.readonly',
  'https://www.googleapis.com/auth/drive.file'
  // 'https://www.googleapis.com/auth/drive.appdata'
].join(' ');

/**
 *  On load, called to load the auth2 library and API client library.
 */
export const load = _initClient => {
  console.log('load');
  gapi.load('client:auth2', _initClient);
};

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
export const initClient = async () =>
  new Promise((resolve, reject) => {
    console.log('initClient');
    gapi.client
      .init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
      })
      .then(
        function() {
          console.log('initClient.done');
          resolve();
        },
        function(error) {
          console.log('initClient.error');
          reject(error);
        }
      );
  });

export const listenSignInStatus = handler => {
  return gapi.auth2.getAuthInstance().isSignedIn.listen(handler);
};

export const isSignIn = () => {
  return gapi.auth2.getAuthInstance().isSignedIn.get();
};

/**
 *  Sign in the user upon button click.
 */
export function doSignIn(event) {
  gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
export function doSignOut(event) {
  gapi.auth2.getAuthInstance().signOut();
}

/**
 * Print files.
 */
// export const listFiles = async () =>
//   new Promise((resolve, reject) => {
//     gapi.client.drive.files
//       .list({
//         pageSize: 10,
//         fields: 'nextPageToken, files(id, name)'
//       })
//       .then(function(response) {
//         const files = response.result.files;
//         resolve(files || []);
//       });
//   });

// export const createFolder = async () =>
//   new Promise((resolve, reject) => {
//     console.log('createFolder');
//     var fileMetadata = {
//       name: DirName,
//       mimeType: 'application/vnd.google-apps.folder'
//     };
//     gapi.client.drive.files
//       .create({
//         resource: fileMetadata,
//         fields: 'id'
//       })
//       .then(response => {
//         if (response.status == 200) {
//           console.log(response);
//           resolve({ folderId: response.result.id });
//         }
//       })
//       .catch(err => reject(err));
//   });

export const createFile = async data =>
  new Promise((resolve, reject) => {
    console.log('createFile');
    const filename =
      DirName + '-' + moment().format('DD-MM-YYYY_HH:mm:ss') + '.json';
    console.log(filename);

    const boundary = '-------314159265358979323846';
    const delimiter = '\r\n--' + boundary + '\r\n';
    const close_delim = '\r\n--' + boundary + '--';

    const contentType = 'application/json';

    var metadata = {
      name: filename,
      mimeType: contentType
    };

    var multipartRequestBody =
      delimiter +
      'Content-Type: application/json\r\n\r\n' +
      JSON.stringify(metadata) +
      delimiter +
      'Content-Type: ' +
      contentType +
      '\r\n\r\n' +
      data +
      close_delim;

    var request = gapi.client.request({
      path: '/upload/drive/v3/files',
      method: 'POST',
      params: { uploadType: 'multipart' },
      headers: {
        'Content-Type': 'multipart/related; boundary="' + boundary + '"'
      },
      body: multipartRequestBody
    });

    request
      .execute(file => {
        console.log(file);
        const { name, id } = file;
        if (!name || !id) reject('Error');
        else resolve({ filename: name, fileId: id });
      })
  });

// export const getFileURL = async fileId =>
//   new Promise((resolve, reject) => {
//     gapi.client.drive.files
//       .get({
//         fileId,
//         fields: 'webContentLink'
//       })
//       .then(function(response) {
//         console.log(response);
//         if (response.status == 200) {
//           resolve(response.result.webContentLink);
//         } else {
//           reject('Not Found');
//         }
//       })
//       .catch(err => reject(err));
//   });

export const downloadFile = async fileId =>
  new Promise((resolve, reject) => {
    gapi.client.drive.files
      .get({
        fileId,
        alt: 'media'
      })
      .then(function(response) {
        // console.log(response);
        if (response.status == 200) {
          resolve(response.result);
        } else {
          reject('Not Found');
        }
      })
      .catch(err => reject(err));
  });
