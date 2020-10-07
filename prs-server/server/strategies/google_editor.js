const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const config = require('../config');
const editorService = require('../services/editor.service');

const StrategyName = 'google_editor';

const { clientId, clientSecret, callbackUrl } = config.oauth2.google.editor;

function init() {

  passport.use(StrategyName, new GoogleStrategy(
    {
      clientID: clientId,
      clientSecret,
      callbackURL: callbackUrl
    },

    (async (accessToken, refreshToken, profile, cb) => {

      const googleId = profile.id,
        displayName = profile.displayName,
        avatar = profile.photos[0].value,
        email = profile.emails[0].value;

      const user = await handleCallbackEditor({ googleId, displayName, avatar, email });

      return cb(null, user);
    })
  ));

  // Used to stuff a piece of information into a cookie
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  // Used to decode the received cookie and persist session
  passport.deserializeUser((user, done) => {
    done(null, user);
  });

}

async function handleCallbackEditor({ googleId, displayName, avatar, email }) {
  let user = await editorService.findOneEditor({ email });
  if (!user) {
    if (config.whitelistEditors.includes(email) == false) {
      return null;
    }
    user = await editorService.createEditor({
      email,
      displayName,
      googleId,
      avatar
    });
    return user;
  }
  // update user profile
  let updated = false;
  if (user.displayName != displayName) {
    user.displayName = displayName;
    updated = true;
  }
  if (user.avatar != avatar) {
    user.avatar = avatar;
    updated = true;
  }
  if (user.googleId != googleId) {
    user.googleId = googleId;
    updated = true;
  }
  if (updated) {
    await editorService.updateEditorGoogleProfile({ email, displayName, avatar, googleId });
  }
  return user;
}

const handleSuccessLogin = (req, res) => {
  const { user } = req;
  req.session.payload = {
    user,
    userID: user._id,
    storageID: user.pollStorageId
  };
  res.status(200).redirect(config.editorUrl);
};

module.exports = {
  init,
  handleSuccessLogin,
  StrategyName
};
