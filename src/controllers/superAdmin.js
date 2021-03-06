/* eslint-disable no-underscore-dangle */
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import pages from '../utils/pages.js';
import sendMail from '../utils/mailer.js';
import { getOrigin, sendResponse } from '../utils/general.js';
import SiteConfig from '../models/SiteConfig.js';
import DjProfile from '../models/DjProfile.js';
import YouTubeVideo from '../models/YouTubeVideo.js';
import SoundcloudTrack from '../models/SoundcloudTrack.js';
import Schedule from '../models/Schedule.js';

import {
  initDjProfiles,
  initYouTubeRandomise,
  initYouTubeUrlPrefix,
  initYouTubeVideos,
  initSoundcloudRandomise,
  initSoundcloudUrlPrefix,
  initSoundcloudTracks,
} from '../utils/initialConfig.js';

const PROTECTED_ADMINS = ['alexbryant710@gmail.com'];
const CONFIG_PAGE_ATTR = ['configPage', 'admin-users'];

const {
  CREATE_ADMIN_PAGE,
  MANAGE_ADMINS_PAGE,
} = pages;

export const initialiseData = async (_req, res) => {
  try {
    await SiteConfig.find({}).deleteMany({});
    await DjProfile.find({}).deleteMany({});
    await YouTubeVideo.find({}).deleteMany({});
    await SoundcloudTrack.find({}).deleteMany({});
    await Schedule.find({}).deleteMany({});
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
      upcomingEvent: '2021-01-01',
      eventFlyerLocation: '/images/flyer/flyer.jpg',
      liveNow: false,
      currentLiveDj: djProfiles[0]._id,
      youTubeVideosRandomised: initYouTubeRandomise,
      youTubeVideoPrefix: initYouTubeUrlPrefix,
      soundcloudTracksRandomised: initSoundcloudRandomise,
      soundcloudTrackPrefix: initSoundcloudUrlPrefix,
    });
    await newSiteConfig.save();
  } catch (err) {
    console.error(err);
  }
  return res.redirect('/config/live');
};

export const getManageAdmins = async (req, res, next) => {
  try {
    let adminUsers = await User.find({});
    adminUsers = adminUsers.map(({
      email, firstName, lastName, _id,
    }) => ({
      email, firstName, lastName, _id,
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

export const getCreateAdmin = (req, res) => sendResponse(req, res, 200, CREATE_ADMIN_PAGE, [
  CONFIG_PAGE_ATTR,
  ['formAttributes', {}],
]);

export const postCreateAdmin = async (req, res) => {
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

export const deleteAdmin = async (req, res) => {
  const { itemId: _id } = req.params;
  try {
    const user = await User.findOne({ _id });
    if (user) {
      await user.deleteOne({ _id });
      return res.status(200).json({
        status: 'Success',
        message: `Deleted user ${user.email}`,
      });
    }
  } catch (err) {
    console.error(err);
  }
  return res.status(500).json({
    status: 'Error',
    message: 'Failed to delete the specified user',
  });
};
