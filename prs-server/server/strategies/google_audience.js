const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const config = require('../config');
const audienceService = require('../services/audience.service');

const StrategyName = 'google_audience';

const { clientId, clientSecret, callbackUrl } = config.oauth2.google.audience;

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

      const user = await handleCallbackAudience({ googleId, displayName, avatar, email });

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

async function handleCallbackAudience({ googleId, displayName, avatar, email }) {
  let user = await audienceService.findOneAudience({ email });
  // check new user
  if (!user) {
    let disable = false;
    const t = email.split('@');
    if (t.length != 2) disable = true;
    else {
      const host = t[1];
      if (config.enableAudienceWhitelist && config.whitelistAudiences.includes(host) == false) {
        disable = true;
      }
    }
    user = await audienceService.createAudience({
      email,
      displayName,
      googleId,
      avatar,
      disable
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
    await audienceService.updateAudienceGoogleProfile({ email, displayName, avatar, googleId });
  }
  return user;
}

const handleSuccessLogin = (req, res) => {
  const { user } = req;
  req.session.payload = {
    user,
    userID: user._id
  };
  const url = req.session.callbackUrl || config.audienceUrl;
  delete req.session.callbackUrl;
  res.status(200).redirect(url);
};

const storeRedirectUrl = (req, res, next) => {
  const { cb } = req.query;
  // console.log(cb);
  if (cb) {
    req.session.callbackUrl = cb;
  }
  next();
};

module.exports = {
  init,
  handleSuccessLogin,
  storeRedirectUrl,
  StrategyName
};
