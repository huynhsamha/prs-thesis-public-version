const common = require('../utils/common');
const audService = require('../services/audience.service');
const ethService = require('../services/eth.service');

const updateAndSendEther = async (req, res, next) => {
  const { payload } = req.session;
  const { userID, storageID } = payload;
  const { address, pkFileId } = req.body;
  if (common.isNull(address)) {
    return res.status(400).json({ error: 'Invalid paramters' });
  }
  try {
    console.log(`Update: ${address} - ${userID}`);
    await audService.updateETHAddress({ userId: userID, address, pkFileId });
    // update session info
    req.session.payload.user.address = address;
    req.session.payload.user.pkFileId = pkFileId;
    await ethService.sendEtherInBackground({ address });

    res.status(200).send('Success');

  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

module.exports = {
  updateAndSendEther
};

