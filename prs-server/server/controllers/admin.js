const jwt = require('jsonwebtoken');
const editorService = require('../services/editor.service');
const audienceService = require('../services/audience.service');
const common = require('../utils/common');
const config = require('../config');

const cookieNameJWT = config.jwt.cookie.admin;

const login = (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Invalid parameters' });
  }
  if (username === config.admin.username && password === config.admin.password) {
    const token = jwt.sign({ username }, config.jwt.secret, { expiresIn: '7d' }); // expires after 7 days
    req.session.payload = {
      isAdmin: true,
      username
    };
    res.cookie(cookieNameJWT, token, {
      maxAge: 1000 * 60 * 60 * 24 * 7, // expires after 7 days
      httpOnly: true,
      path: '/'
    });
    return res.status(200).send({ message: 'Success' });

  } else {
    return res.status(400).json({
      message: 'Incorrect'
    });
  }
};

const verifyAdminSession = (req, res, next) => {
  if (!req.session.payload || !req.session.payload.isAdmin === true) {
    return res.status(401).send({ msg: 'Not auth' });
  }
  const { username } = req.session.payload;

  const cookieToken = req.cookies[cookieNameJWT];
  jwt.verify(cookieToken, config.jwt.secret, async (err, decoded) => {
    if (err) return res.status(401).send(err);

    try {
      if (decoded.username == username) {
        return next();
      }
      return res.status(401).send({ msg: 'Not auth' });
    } catch (error) {
      return res.status(401).send({ msg: error.message });
    }
  });
};

const logout = (req, res) => {
  req.session.destroy((err) => {
    res.clearCookie(cookieNameJWT);
    res.status(200).send({ message: 'Success' });
  });
};

const createEditor = async function (req, res, next) {
  const { email } = req.body;
  if (common.isNull(email)) {
    return res.status(400).json({ message: 'Email is not valid' });
  }
  editorService.createEditor({ email }).then((user) => {
    res.status(200).send({ user });
  }).catch((err) => {
    console.log(err);
    res.status(500).send(err);
  });
};

const getAllEditor = async (req, res) => {
  editorService.getAllEditors().then((data) => {
    res.status(200).send(data);
  }).catch((err) => {
    console.log(err);
    res.status(500).send(err);
  });
};

const getAllAudience = async (req, res) => {
  audienceService.getAllAudiences().then((data) => {
    res.status(200).send(data);
  }).catch((err) => {
    console.log(err);
    res.status(500).send(err);
  });
};

const getBanAudience = (req, res) => {
  audienceService.getDisabledAudiences().then((data) => {
    res.status(200).send(data);
  }).catch((err) => {
    console.log(err);
    res.status(500).send(err);
  });
};

const getActiveAudience = (req, res) => {
  audienceService.getActiveAudiences().then((data) => {
    res.status(200).send(data);
  }).catch((err) => {
    console.log(err);
    res.status(500).send(err);
  });
};

const enableAudience = (req, res) => {
  const { userId } = req.params;
  audienceService.enableDisableAudience({ userId, isDisabled: false })
    .then(() => {
      res.status(200).send({ message: 'Success' });
    }).catch((err) => {
      console.log(err);
      res.status(400).send({ error: err.message });
    });
};

const disableAudience = (req, res) => {
  const { userId } = req.params;
  audienceService.enableDisableAudience({ userId, isDisabled: true })
    .then(() => {
      res.status(200).send({ message: 'Success' });
    }).catch((err) => {
      console.log(err);
      res.status(400).send({ error: err.message });
    });
};

const deleteAudience = (req, res) => {
  const { userId } = req.params;
  audienceService.deleteAudience({ userId })
    .then(() => {
      res.status(200).send({ message: 'Success' });
    }).catch((err) => {
      console.log(err);
      res.status(400).send({ error: err.message });
    });
};

const createAudience = async function (req, res, next) {
  const { email } = req.body;
  if (common.isNull(email)) {
    return res.status(400).json({ message: 'Email is not valid' });
  }
  audienceService.createAudience({ email, googleId: email })
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};

module.exports = {
  login,
  verifyAdminSession,
  createEditor,
  getAllEditor,
  logout,
  getAllAudience,
  getBanAudience,
  getActiveAudience,
  enableAudience,
  disableAudience,
  deleteAudience,
  createAudience
};
