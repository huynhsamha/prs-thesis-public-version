const _ = require('lodash');

const { audienceDB } = require('../../mongodb/operation');

const getAllAudiences = async function (cb) {
  return audienceDB.queryDB();
};

const getDisabledAudiences = async function (cb) {
  return audienceDB.queryDB({ disable: true });
};

const getActiveAudiences = async function (cb) {
  return audienceDB.queryDB({ disable: false });
};

const findOneAudience = async function (query) {
  return audienceDB.queryDBOne(query);
};

const updateAudienceGoogleProfile = async function ({ email, displayName, avatar, googleId }) {
  return audienceDB.updateOne({ email }, { displayName, avatar, googleId });
};

const createAudience = async function (account) {
  return audienceDB.addDB(account);
};

const enableDisableAudience = async function ({ userId, isDisabled }) {
  return audienceDB.updateDB(userId, { disable: isDisabled });
};

const deleteAudience = async function ({ userId }) {
  return audienceDB.removeDB(userId);
};

const updateETHAddress = async function ({ userId, address, pkFileId }) {
  return audienceDB.updateDB(userId, { address, pkFileId });
};

module.exports = {
  getAllAudiences,
  getDisabledAudiences,
  getActiveAudiences,
  findOneAudience,
  updateAudienceGoogleProfile,
  createAudience,
  enableDisableAudience,
  deleteAudience,
  updateETHAddress
};
