const {
  pages: {
    CONFIG_LIVE_PAGE,
    MANAGE_MEDIA_PAGE,
    CREATE_MEDIA_PAGE,
    UPDATE_MEDIA_PAGE,
    MANAGE_BIOS_PAGE,
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

module.exports.getConfig = async (req, res, next) => {
  try {
    const siteConfig = await SiteConfig.findOne({});
    console.info(siteConfig);
    return sendResponse(
      req, res, 200, CONFIG_LIVE_PAGE, [LIVE_PAGE_ATTR],
    );
  } catch (err) {
    const error = new Error(err);
    return next(error);
  }
};

module.exports.getManageBios = async (req, res, next) => {
  try {
    const fetchedItems = await DjProfile.find({});
    const items = fetchedItems.map(({ name, nickname, bio }) => ({
      name, nickname, bio,
    }));
    return sendResponse(req, res, 200, MANAGE_BIOS_PAGE, [
      CONTENT_PAGE_ATTR,
      ['bios', items],
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
    const items = fetchedItems.map(({ title, url }) => ({
      title, url: `${urlPrefix}${url}`,
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

module.exports.postUpdateMedia = async (req, res, next) => {
  const {
    title, originalTitle, url, originalUrl, urlPrefix, mediaType,
  } = req.body;
  const { DataModel } = getMediaTypeParams(mediaType);
  if (!title || !url) {
    req.flash('error', 'Please complete the form');
    return sendResponse(req, res, 400, UPDATE_MEDIA_PAGE, [
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
    return sendResponse(req, res, 400, CREATE_MEDIA_PAGE, [
      CONTENT_PAGE_ATTR,
      ['formAttributes', { urlPrefix, mediaType }],
    ]);
  }
  try {
    const item = await DataModel.findOne({ url });
    if (item) {
      req.flash('error', `${urlPrefix}${item.url} already exists in the database`);
      return sendResponse(req, res, 400, CREATE_MEDIA_PAGE, [
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

module.exports.deleteMedia = async (req, res, next) => {
  const { url, mediaType } = req.body;
  const { prefixIdentifier, DataModel } = getMediaTypeParams(mediaType);
  try {
    const siteConfig = await SiteConfig.findOne({});
    const { [prefixIdentifier]: urlPrefix } = siteConfig;
    const truncatedUrl = url.replace(urlPrefix, '');
    const item = await DataModel.findOne({ url: truncatedUrl });
    if (item) {
      await item.deleteOne({ url: truncatedUrl });
      req.flash('success', `Deleted ${mediaType} ${url}`);
      return res.redirect(`/config/manage-media?mediaType=${mediaType}`);
    }
    const error = new Error('Media item not found in the database');
    return next(error);
  } catch (err) {
    const error = new Error(err);
    return next(error);
  }
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
