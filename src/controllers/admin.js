const {
  pages: {
    CONFIG_LIVE_PAGE,
    MANAGE_MEDIA_PAGE,
    CREATE_MEDIA_PAGE,
    UPDATE_MEDIA_PAGE,
    MANAGE_BIOS_PAGE,
    CREATE_BIO_PAGE,
  },
} = require('../utils/pages');
const SiteConfig = require('../models/SiteConfig');
const YouTubeVideo = require('../models/YouTubeVideo');
const SoundcloudTrack = require('../models/SoundcloudTrack');
const DjProfile = require('../models/DjProfile');
const { sendResponse } = require('../utils/general');

const LIVE_PAGE_ATTR = ['configPage', 'live'];
const CONTENT_PAGE_ATTR = ['configPage', 'site-content'];

const getMediaTypeParams = (mediaType) => {
  const mediaRandomised = mediaType === 'video' ? 'youTubeVideosRandomised' : 'soundcloudTracksRandomised';
  const prefixIdentifier = mediaType === 'video' ? 'youTubeVideoPrefix' : 'soundcloudTrackPrefix';
  const DataModel = mediaType === 'video' ? YouTubeVideo : SoundcloudTrack;
  return { mediaRandomised, prefixIdentifier, DataModel };
};

const getDjBios = async () => {
  const fetchedItems = await DjProfile.find({});
  return fetchedItems.map(({
    name, nickname, bio, _id,
  }) => ({
    name, nickname, bio, _id,
  }));
};

module.exports.getConfig = async (req, res, next) => {
  try {
    const siteConfig = await SiteConfig.findOne({});
    const bios = await getDjBios();
    const { liveNow, currentLiveDj } = siteConfig;
    const dj = await DjProfile.findOne({ _id: currentLiveDj });
    return sendResponse(req, res, 200, CONFIG_LIVE_PAGE, [
      LIVE_PAGE_ATTR,
      ['liveNow', liveNow],
      ['currentLiveDj', dj.name],
      ['bios', bios],
    ]);
  } catch (err) {
    const error = new Error(err);
    return next(error);
  }
};

module.exports.getManageBios = async (req, res, next) => {
  const { chosenProfile } = req.query;
  try {
    const bios = await getDjBios();
    return sendResponse(req, res, 200, MANAGE_BIOS_PAGE, [
      CONTENT_PAGE_ATTR,
      ['chosenProfile', chosenProfile],
      ['bios', bios],
    ]);
  } catch (err) {
    const error = new Error(err);
    return next(error);
  }
};

module.exports.getManageMedia = async (req, res, next) => {
  const { mediaType } = req.query;
  const { mediaRandomised, prefixIdentifier, DataModel } = getMediaTypeParams(mediaType);
  try {
    const siteConfig = await SiteConfig.findOne({});
    const {
      [prefixIdentifier]: urlPrefix,
      [mediaRandomised]: randomised,
    } = siteConfig;
    const fetchedItems = await DataModel.find({});
    const items = fetchedItems.map(({ title, url, _id }) => ({
      title, url: `${urlPrefix}${url}`, _id,
    }));
    return sendResponse(req, res, 200, MANAGE_MEDIA_PAGE, [
      CONTENT_PAGE_ATTR,
      ['mediaRandomised', randomised],
      ['mediaType', mediaType],
      ['items', items],
    ]);
  } catch (err) {
    const error = new Error(err);
    return next(error);
  }
};

module.exports.getUpdateMedia = async (req, res, next) => {
  const { url: fullUrl, mediaType } = req.query;
  const { prefixIdentifier, DataModel } = getMediaTypeParams(mediaType);
  try {
    const siteConfig = await SiteConfig.findOne({});
    const { [prefixIdentifier]: urlPrefix } = siteConfig;
    const mediaItem = await DataModel.findOne({ url: fullUrl.replace(urlPrefix, '') });
    if (mediaItem) {
      const { url, title } = mediaItem;
      return sendResponse(req, res, 200, UPDATE_MEDIA_PAGE, [
        CONTENT_PAGE_ATTR,
        ['formAttributes', {
          url, title, urlPrefix, mediaType,
        }],
      ]);
    }
    const error = new Error('Media item not found in the database');
    return next(error);
  } catch (err) {
    const error = new Error(err);
    return next(error);
  }
};

module.exports.postUpdateBio = async (req, res, next) => {
  const {
    name, nickname, bio, chosenProfile, prevName,
  } = req.body;
  if (!name || !bio) {
    const bios = await getDjBios();
    req.flash('error', 'Please complete the form');
    return sendResponse(req, res, 422, MANAGE_BIOS_PAGE, [
      CONTENT_PAGE_ATTR,
      ['chosenProfile', chosenProfile],
      ['bios', bios],
    ]);
  }
  try {
    const item = await DjProfile.findOne({ name: prevName });
    if (item) {
      const bioArr = bio.split('\r\n').filter((para) => para);
      await item.updateOne({
        name, nickname, bio: bioArr,
      });
      const bios = await getDjBios();
      req.flash('success', `Updated DJ profile ${name}.`);
      return sendResponse(req, res, 201, MANAGE_BIOS_PAGE, [
        CONTENT_PAGE_ATTR,
        ['chosenProfile', chosenProfile],
        ['bios', bios],
      ]);
    }
    const error = new Error('DJ profile not found in the database');
    return next(error);
  } catch (err) {
    const error = new Error(err);
    return next(error);
  }
};

module.exports.getCreateBio = async (req, res, next) => {
  try {
    return sendResponse(req, res, 200, CREATE_BIO_PAGE, [
      CONTENT_PAGE_ATTR,
    ]);
  } catch (err) {
    const error = new Error(err);
    return next(error);
  }
};

module.exports.postCreateBio = async (req, res, next) => {
  const {
    name, nickname, bio,
  } = req.body;
  if (!name || !bio) {
    req.flash('error', 'Please complete the form');
    return sendResponse(req, res, 422, CREATE_BIO_PAGE, [
      CONTENT_PAGE_ATTR,
    ]);
  }
  try {
    const item = await DjProfile.findOne({ name });
    if (item) {
      req.flash('error', `${name} already exists in the database`);
      return sendResponse(req, res, 422, CREATE_BIO_PAGE, [
        CONTENT_PAGE_ATTR,
      ]);
    }
    const bioArr = bio.split('\r\n').filter((para) => para);
    const newItem = new DjProfile({ name, nickname, bio: bioArr });
    await newItem.save();
    req.flash('success', `New DJ profile ${name} created.`);
    return sendResponse(req, res, 201, CREATE_BIO_PAGE, [
      CONTENT_PAGE_ATTR,
    ]);
  } catch (err) {
    const error = new Error(err);
    return next(error);
  }
};

module.exports.postUpdateMedia = async (req, res, next) => {
  const {
    title, originalTitle, url, originalUrl, urlPrefix, mediaType,
  } = req.body;
  const { DataModel } = getMediaTypeParams(mediaType);
  if (!title || !url) {
    req.flash('error', 'Please complete the form');
    return sendResponse(req, res, 422, UPDATE_MEDIA_PAGE, [
      CONTENT_PAGE_ATTR,
      ['formAttributes', {
        title: originalTitle, url: originalUrl, urlPrefix, mediaType,
      }],
    ]);
  }
  try {
    const item = await DataModel.findOne({ url: originalUrl });
    if (item) {
      await item.updateOne({
        title, url,
      });
      req.flash('success', `Updated ${mediaType} ${urlPrefix}${url}.`);
      return sendResponse(req, res, 201, UPDATE_MEDIA_PAGE, [
        CONTENT_PAGE_ATTR,
        ['formAttributes', {
          title, url, urlPrefix, mediaType,
        }],
      ]);
    }
    const error = new Error('Media item not found in the database');
    return next(error);
  } catch (err) {
    const error = new Error(err);
    return next(error);
  }
};

module.exports.getCreateMedia = async (req, res, next) => {
  const { mediaType } = req.query;
  const { prefixIdentifier } = getMediaTypeParams(mediaType);
  try {
    const siteConfig = await SiteConfig.findOne({});
    const { [prefixIdentifier]: urlPrefix } = siteConfig;
    return sendResponse(req, res, 200, CREATE_MEDIA_PAGE, [
      CONTENT_PAGE_ATTR,
      ['formAttributes', { urlPrefix, mediaType }],
    ]);
  } catch (err) {
    const error = new Error(err);
    return next(error);
  }
};

module.exports.postCreateMedia = async (req, res, next) => {
  const {
    title, url, urlPrefix, mediaType,
  } = req.body;
  const { DataModel } = getMediaTypeParams(mediaType);
  if (!title || !url) {
    req.flash('error', 'Please complete the form');
    return sendResponse(req, res, 422, CREATE_MEDIA_PAGE, [
      CONTENT_PAGE_ATTR,
      ['formAttributes', { urlPrefix, mediaType }],
    ]);
  }
  try {
    const item = await DataModel.findOne({ url });
    if (item) {
      req.flash('error', `${urlPrefix}${item.url} already exists in the database`);
      return sendResponse(req, res, 422, CREATE_MEDIA_PAGE, [
        CONTENT_PAGE_ATTR,
        ['formAttributes', { urlPrefix, mediaType }],
      ]);
    }
    const newItem = new DataModel({ title, url });
    await newItem.save();
    req.flash('success', `New ${mediaType} ${urlPrefix}${url} created.`);
    return sendResponse(req, res, 201, CREATE_MEDIA_PAGE, [
      CONTENT_PAGE_ATTR,
      ['formAttributes', { urlPrefix, mediaType }],
    ]);
  } catch (err) {
    const error = new Error(err);
    return next(error);
  }
};

module.exports.deleteBio = async (req, res, next) => {
  const { itemId: _id } = req.params;
  try {
    const dj = await DjProfile.findOne({ _id });
    if (dj) {
      await dj.deleteOne({ _id });
      req.flash('success', `Deleted DJ ${dj.name}`);
      return res.status(200).json({
        status: 'Success',
        message: `Deleted DJ ${dj.name}`,
        reload: true,
      });
    }
    const error = new Error('DJ profile not found in the database');
    return next(error);
  } catch (err) {
    console.log(err);
  }
  return res.status(500).json({
    status: 'Error',
    message: 'Failed to delete the DJ',
  });
};

module.exports.deleteMedia = async (req, res) => {
  const { itemId: _id } = req.params;
  const mediaType = req.originalUrl.includes('track') ? 'track' : 'video';
  const { DataModel } = getMediaTypeParams(mediaType);
  try {
    const item = await DataModel.findOne({ _id });
    if (item) {
      await item.deleteOne({ _id });
      return res.status(200).json({
        status: 'Success',
        message: `Deleted ${mediaType} with url ${item.url}`,
      });
    }
  } catch (err) {
    console.error(err);
  }
  return res.status(500).json({
    status: 'Error',
    message: `Failed to delete the ${mediaType}`,
  });
};

module.exports.postRandomiseMedia = async (req, res, next) => {
  const { mediaType } = req.body;
  const { mediaRandomised } = getMediaTypeParams(mediaType);
  try {
    const siteConfig = await SiteConfig.findOne({});
    const { [mediaRandomised]: randomised } = siteConfig;
    await siteConfig.updateOne({ [mediaRandomised]: !randomised });
    req.flash('success', `${mediaType} randomisation set to ${!randomised}`);
    return res.redirect(`/config/manage-media?mediaType=${mediaType}`);
  } catch (err) {
    const error = new Error(err);
    return next(error);
  }
};

module.exports.postLiveNow = async (_req, res, next) => {
  try {
    const siteConfig = await SiteConfig.findOne({});
    const { liveNow } = siteConfig;
    await siteConfig.updateOne({ liveNow: !liveNow });
    return res.redirect('/config/live');
  } catch (err) {
    const error = new Error(err);
    return next(error);
  }
};

module.exports.postUpdateLiveDj = async (req, res, next) => {
  const { name } = req.body;
  try {
    const siteConfig = await SiteConfig.findOne({});
    const liveDj = await DjProfile.findOne({ name });
    // eslint-disable-next-line no-underscore-dangle
    await siteConfig.updateOne({ currentLiveDj: liveDj._id });
    return res.redirect('/config/live');
  } catch (err) {
    const error = new Error(err);
    return next(error);
  }
};
