const {
  pages: {
    CONFIG_LIVE_PAGE,
    MANAGE_MEDIA_PAGE,
    CREATE_MEDIA_PAGE,
    UPDATE_MEDIA_PAGE,
  },
} = require('../utils/pages');
const SiteConfig = require('../models/SiteConfig');
const YouTubeVideo = require('../models/YouTubeVideo');
const SoundcloudTrack = require('../models/SoundcloudTrack');
const { sendResponse } = require('../utils/general');

const LIVE_PAGE_ATTR = ['configPage', 'live'];
const CONTENT_PAGE_ATTR = ['configPage', 'site-content'];

const getMediaTypeParams = (mediaType) => {
  const mediaRandomised = mediaType === 'video' ? 'youTubeVideosRandomised' : 'soundcloudTracksRandomised';
  const prefixIdentifier = mediaType === 'video' ? 'youTubeVideoPrefix' : 'soundcloudTrackPrefix';
  const DataModel = mediaType === 'video' ? YouTubeVideo : SoundcloudTrack;
  return { mediaRandomised, prefixIdentifier, DataModel };
};

module.exports.getConfig = async (req, res) => {
  const siteConfig = await SiteConfig.findOne({});
  console.info(siteConfig);
  return sendResponse(
    req, res, 200, CONFIG_LIVE_PAGE, [LIVE_PAGE_ATTR],
  );
};

module.exports.getManageMedia = async (req, res) => {
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
    console.error(err);
  }
  req.flash('error', `Could not fetch the ${mediaType}s from the database`);
  return sendResponse(req, res, 400, MANAGE_MEDIA_PAGE, [
    CONTENT_PAGE_ATTR,
    ['mediaRandomised', false],
    ['mediaType', mediaType],
    ['items', []],
  ]);
};

module.exports.getUpdateMedia = async (req, res) => {
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
  } catch (err) {
    console.error(err);
  }
  req.flash('error', 'Error loading page');
  return sendResponse(req, res, 400, UPDATE_MEDIA_PAGE, [
    CONTENT_PAGE_ATTR,
    ['formAttributes', { urlPrefix: '', mediaType }],
  ]);
};

module.exports.postUpdateMedia = async (req, res) => {
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
  } catch (err) {
    console.error(err);
  }
  req.flash('error', `Could not update the ${mediaType} ${urlPrefix}${url}`);
  return sendResponse(req, res, 400, UPDATE_MEDIA_PAGE, [
    CONTENT_PAGE_ATTR,
    ['formAttributes', {
      title: originalTitle, url: originalUrl, urlPrefix, mediaType,
    }],
  ]);
};

module.exports.getCreateMedia = async (req, res) => {
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
    console.error(err);
  }
  req.flash('error', 'Error loading page');
  return sendResponse(req, res, 400, CREATE_MEDIA_PAGE, [
    CONTENT_PAGE_ATTR,
    ['formAttributes', { urlPrefix: '', mediaType }],
  ]);
};

module.exports.postCreateMedia = async (req, res) => {
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
    } else {
      const newItem = new DataModel({ title, url });
      await newItem.save();
      req.flash('success', `New ${mediaType} ${urlPrefix}${url} created.`);
      return sendResponse(req, res, 201, CREATE_MEDIA_PAGE, [
        CONTENT_PAGE_ATTR,
        ['formAttributes', { urlPrefix, mediaType }],
      ]);
    }
  } catch (err) {
    console.error(err);
    req.flash('error', `Could not create the ${mediaType} ${urlPrefix}${url}`);
  }
  return sendResponse(req, res, 400, CREATE_MEDIA_PAGE, [
    CONTENT_PAGE_ATTR,
    ['formAttributes', { urlPrefix, mediaType }],
  ]);
};

module.exports.deleteMedia = async (req, res) => {
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
  } catch (err) {
    console.error(err);
  }
  req.flash('error', `Could not delete the ${mediaType} ${url}`);
  return res.redirect(`/config/manage-media?mediaType=${mediaType}`);
};

module.exports.postRandomiseMedia = async (req, res) => {
  const { mediaType } = req.body;
  const { mediaRandomised } = getMediaTypeParams(mediaType);
  try {
    const siteConfig = await SiteConfig.findOne({});
    const { [mediaRandomised]: randomised } = siteConfig;
    await siteConfig.updateOne({ [mediaRandomised]: !randomised });
    req.flash('success', `${mediaType} randomisation set to ${!randomised}`);
    return res.redirect(`/config/manage-media?mediaType=${mediaType}`);
  } catch (err) {
    console.error(err);
  }
  req.flash('error', `${mediaType} randomisation could not be updated`);
  return res.redirect(`/config/manage-media?mediaType=${mediaType}`);
};
