const _ = require('lodash');

const _audiencePayload = ['_id', 'email', 'disable'];
const _editorPayload = ['_id', 'email', 'pollStorageId', 'disable'];

module.exports = {

  validateAudiencePayload(payload) {
    return payload && payload.user && payload.userID
      && _.every(_audiencePayload, p => _.has(payload.user, p));
  },

  validateEditorPayload(payload) {
    return payload && payload.user && payload.userID && payload.storageID
      && _.every(_editorPayload, p => _.has(payload.user, p));
  }

};
