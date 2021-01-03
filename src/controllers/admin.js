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
  const prefixIdentifier = mediaType === 'video' ? 'youTubeVideoPrefix' : 'soundcloudTrackPrefix';
  const DataModel = mediaType === 'video' ? YouTubeVideo : SoundcloudTrack;
  return { prefixIdentifier, DataModel };
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
  const { prefixIdentifier, DataModel } = getMediaTypeParams(mediaType);
  try {
    const siteConfig = await SiteConfig.findOne({});
    const { [prefixIdentifier]: urlPrefix } = siteConfig;
    const fetchedItems = await DataModel.find({});
    const items = fetchedItems.map(({ title, url }) => ({
      title, url: `${urlPrefix}${url}`,
    }));
    return sendResponse(req, res, 200, MANAGE_MEDIA_PAGE, [
      CONTENT_PAGE_ATTR,
      ['mediaType', mediaType],
      ['items', items],
    ]);
  } catch (err) {
    console.error(err);
  }
  req.flash('error', `Could not fetch the ${mediaType}s from the database`);
  return sendResponse(req, res, 400, MANAGE_MEDIA_PAGE, [
    CONTENT_PAGE_ATTR,
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

module.exports.deleteVideo = async (req, res) => {
  const { url } = req.body;
  try {
    const siteConfig = await SiteConfig.findOne({});
    const { youTubeVideoPrefix } = siteConfig;
    const truncatedUrl = url.replace(youTubeVideoPrefix, '');
    const video = await YouTubeVideo.findOne({ url: truncatedUrl });
    if (video) {
      await video.deleteOne({ url: truncatedUrl });
      req.flash('success', `Deleted YouTube video ${url}`);
      return res.redirect('/config/manage-media?mediaType=video');
    }
  } catch (err) {
    console.error(err);
  }
  req.flash('error', `Could not delete the video ${url}`);
  return res.redirect('/config/manage-media?mediaType=video');
};
