/* eslint-disable no-underscore-dangle */
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const {
  pages: {
    CREATE_ADMIN_PAGE,
    MANAGE_ADMINS_PAGE,
  },
} = require('../utils/pages');
const { sendMail } = require('../utils/mailer');
const { getOrigin, sendResponse } = require('../utils/general');
const SiteConfig = require('../models/SiteConfig');
const DjProfile = require('../models/DjProfile');
const YouTubeVideo = require('../models/YouTubeVideo');
const SoundcloudTrack = require('../models/SoundcloudTrack');

const PROTECTED_ADMINS = ['alexbryant710@gmail.com'];
const CONFIG_PAGE_ATTR = ['configPage', 'admin-users'];

const {
  initDjProfiles,
  initYouTubeRandomise,
  initYouTubeUrlPrefix,
  initYouTubeVideos,
  initSoundcloudRandomise,
  initSoundcloudUrlPrefix,
  initSoundcloudTracks,
} = require('../utils/initialConfig');

module.exports.initialiseData = async (_req, res) => {
  try {
    await SiteConfig.find({}).deleteMany({});
    await DjProfile.find({}).deleteMany({});
    await YouTubeVideo.find({}).deleteMany({});
    await SoundcloudTrack.find({}).deleteMany({});
    const youTubeVideos = initYouTubeVideos.map(({ title, url }) => new YouTubeVideo({
      title, url,
    }));
    const soundcloudTracks = initSoundcloudTracks.map(({ title, url }) => new SoundcloudTrack({
      title, url,
    }));
    const djProfiles = initDjProfiles.map(({ bio, nickname, name }) => new DjProfile({
      bio, nickname, name,
    }));
    const youTubePromises = youTubeVideos.map((vid) => vid.save());
    const soundcloudPromises = soundcloudTracks.map((track) => track.save());
    const djProfilePromises = djProfiles.map((profile) => profile.save());
    await Promise.all([...youTubePromises, ...soundcloudPromises, ...djProfilePromises]);
    const newSiteConfig = new SiteConfig({
      djProfiles: djProfiles.map((profile) => profile._id),
      upcomingEvent: false,
      liveNow: false,
      currentLiveDj: djProfiles[0]._id,
      youTubeVideos: youTubeVideos.map((vid) => vid._id),
      youTubeVideosRandomised: initYouTubeRandomise,
      youTubeVideoPrefix: initYouTubeUrlPrefix,
      soundcloudTracks: soundcloudTracks.map((track) => track._id),
      soundcloudTracksRandomised: initSoundcloudRandomise,
      soundcloudTrackPrefix: initSoundcloudUrlPrefix,
    });
    await newSiteConfig.save();
  } catch (err) {
    console.error(err);
  }
  return res.redirect('/config/live');
};

module.exports.getManageAdmins = async (req, res, next) => {
  try {
    let adminUsers = await User.find({});
    adminUsers = adminUsers.map(({ email, firstName, lastName }) => ({
      email, firstName, lastName,
    })).filter(({ email }) => !PROTECTED_ADMINS.includes(email));
    return sendResponse(req, res, 200, MANAGE_ADMINS_PAGE, [
      CONFIG_PAGE_ATTR,
      ['adminUsers', adminUsers],
    ]);
  } catch (err) {
    const error = new Error(err);
    return next(error);
  }
};

module.exports.getCreateAdmin = (req, res) => sendResponse(req, res, 200, CREATE_ADMIN_PAGE, [
  CONFIG_PAGE_ATTR,
  ['formAttributes', {}],
]);

module.exports.postCreateAdmin = async (req, res) => {
  const {
    firstName, lastName, email, password1, password2,
  } = req.body;
  if (!firstName || !lastName || !email || !password1 || !password2) {
    req.flash('error', 'Please complete the form');
    return sendResponse(req, res, 422, CREATE_ADMIN_PAGE, [
      CONFIG_PAGE_ATTR,
      ['formAttributes', { firstName, lastName, email }],
    ]);
  }
  if (password1 !== password2) {
    req.flash('error', 'The passwords do not match');
    return sendResponse(req, res, 422, CREATE_ADMIN_PAGE, [
      CONFIG_PAGE_ATTR,
      ['formAttributes', { firstName, lastName, email }],
    ]);
  }
  if (password1.length < 12) {
    req.flash('error', 'The password must be at least 12 characters long');
    return sendResponse(req, res, 422, CREATE_ADMIN_PAGE, [
      CONFIG_PAGE_ATTR,
      ['formAttributes', { firstName, lastName, email }],
    ]);
  }
  try {
    const user = await User.findOne({ email });
    if (user) {
      req.flash('error', `${email} already exists in the database`);
    } else {
      const hashedPassword = await bcrypt.hash(password1, 12);
      const newUser = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        isAdmin: true,
        isSuperAdmin: false,
      });
      await newUser.save();
      sendMail({
        email,
        subject: 'You have been added as a TTLF admin',
        template: 'newAdmin',
        attrs: {
          origin: getOrigin(req),
        },
      });
      req.flash('success', `New admin user ${email} created.`);
      return sendResponse(req, res, 201, CREATE_ADMIN_PAGE, [
        CONFIG_PAGE_ATTR,
        ['formAttributes', {}],
      ]);
    }
  } catch (err) {
    console.error(err);
  }
  req.flash('error', `Could not create the admin user ${email}`);
  return sendResponse(req, res, 500, CREATE_ADMIN_PAGE, [
    CONFIG_PAGE_ATTR,
    ['formAttributes', { firstName, lastName, email }],
  ]);
};

module.exports.deleteAdmin = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      await user.deleteOne({ email });
      req.flash('success', `Deleted admin user ${email}`);
      return res.redirect('/config/manage-admins');
    }
  } catch (err) {
    console.error(err);
  }
  req.flash('error', `Could not delete the admin user ${email}`);
  return res.redirect('/config/manage-admins');
};
