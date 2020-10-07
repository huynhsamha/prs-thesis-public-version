const _ = require('lodash');

const { editorDB, pollStorageDB } = require('../../mongodb/operation');

const getAllEditors = async function (cb) {
  return editorDB.queryDB();
};

const getDisabledEditors = async function (cb) {
  return editorDB.queryDB({ disable: true });
};

const getActiveEditors = async function (cb) {
  return editorDB.queryDB({ disable: false });
};

const findOneEditor = async function (query) {
  return editorDB.queryDBOne(query);
};

const updateEditorGoogleProfile = async function ({ email, displayName, avatar, googleId }) {
  return editorDB.updateOne({ email }, { displayName, avatar, googleId });
};

const createEditor = async function (account) {
  const storageID = await pollStorageDB.newStorage();
  if (storageID) {
    account.pollStorageId = storageID;
  } else {
    return null;
  }
  return editorDB.addDB(account);
};

const enableDisableEditor = async function ({ userId, isDisabled }) {
  return editorDB.updateDB(userId, { disable: isDisabled });
};

const deleteEditor = async function ({ userId }) {
  return editorDB.removeDB(userId);
};

module.exports = {
  getActiveEditors,
  getAllEditors,
  getDisabledEditors,
  findOneEditor,
  updateEditorGoogleProfile,
  createEditor,
  enableDisableEditor,
  deleteEditor
};
