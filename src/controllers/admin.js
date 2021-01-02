const {
  pages: {
    CONFIG_LIVE_PAGE,
    MANAGE_VIDEOS_PAGE,
    CREATE_VIDEO_PAGE,
  },
} = require('../utils/pages');
const SiteConfig = require('../models/SiteConfig');
const YouTubeVideo = require('../models/YouTubeVideo');
const { sendResponse } = require('../utils/general');

const LIVE_PAGE_ATTR = ['configPage', 'live'];
const CONTENT_PAGE_ATTR = ['configPage', 'site-content'];

module.exports.getConfig = async (req, res) => {
  // videos.forEach(async ({ title, url }) => {
  //   const youTubeVideo = new YouTubeVideo({
  //     title, url,
  //   });
  //   await youTubeVideo.save();
  // });
  // const youTubeVideos = await YouTubeVideo.find({});
  // const newSiteConfig = new SiteConfig({
  //   youTubeVideos: youTubeVideos.map((vid) => vid._id),
  //   youTubeVideoPrefix,
  // });
  // await newSiteConfig.save();
  const siteConfig = await SiteConfig.find({});
  console.log(siteConfig);
  return sendResponse(
    req, res, 200, CONFIG_LIVE_PAGE, [LIVE_PAGE_ATTR],
  );
};

module.exports.getYouTubeVideos = async (req, res) => {
  try {
    const siteConfig = await SiteConfig.findOne({});
    const { youTubeVideoPrefix } = siteConfig;
    const youTubeVideos = await YouTubeVideo.find({});
    const videos = youTubeVideos.map(({ title, url }) => ({
      title, url: `${youTubeVideoPrefix}${url}`,
    }));
    return sendResponse(req, res, 200, MANAGE_VIDEOS_PAGE, [
      CONTENT_PAGE_ATTR,
      ['videos', videos],
    ]);
  } catch (err) {
    console.error(err);
  }
  req.flash('error', 'Could not fetch the videos from the database');
  return sendResponse(req, res, 400, MANAGE_VIDEOS_PAGE);
};

module.exports.getCreateVideo = async (req, res) => {
  try {
    const siteConfig = await SiteConfig.findOne({});
    const { youTubeVideoPrefix } = siteConfig;
    return sendResponse(req, res, 200, CREATE_VIDEO_PAGE, [
      CONTENT_PAGE_ATTR,
      ['urlPrefix', youTubeVideoPrefix],
      ['formAttributes', {}],
    ]);
  } catch (err) {
    console.error(err);
  }
  req.flash('error', 'Error loading page');
  return sendResponse(req, res, 400, CREATE_VIDEO_PAGE, [
    CONTENT_PAGE_ATTR,
    ['formAttributes', {}],
  ]);
};

module.exports.postCreateVideo = async (req, res) => {
  const {
    title, url,
  } = req.body;
  let urlPrefix = '';
  try {
    const siteConfig = await SiteConfig.findOne({});
    const { youTubeVideoPrefix } = siteConfig;
    urlPrefix = youTubeVideoPrefix;
  } catch (err) {
    console.error(err);
    req.flash('error', `Could not create the video ${title}`);
    return sendResponse(req, res, 400, CREATE_VIDEO_PAGE, [
      CONTENT_PAGE_ATTR,
      ['urlPrefix', urlPrefix],
      ['formAttributes', {}],
    ]);
  }
  try {
    if (!title || !url) {
      req.flash('error', 'Please complete the form');
      return sendResponse(req, res, 400, CREATE_VIDEO_PAGE, [
        CONTENT_PAGE_ATTR,
        ['urlPrefix', urlPrefix],
        ['formAttributes', {}],
      ]);
    }
    const video = await YouTubeVideo.findOne({ url });
    if (video) {
      req.flash('error', `${urlPrefix}${video.url} already exists in the database`);
    } else {
      const newVideo = new YouTubeVideo({
        title,
        url,
      });
      await newVideo.save();
      req.flash('success', `New video ${urlPrefix}${url} created.`);
      return sendResponse(req, res, 201, CREATE_VIDEO_PAGE, [
        CONTENT_PAGE_ATTR,
        ['urlPrefix', urlPrefix],
        ['formAttributes', {}],
      ]);
    }
  } catch (err) {
    console.error(err);
  }
  req.flash('error', `Could not create the video ${title}`);
  return sendResponse(req, res, 400, CREATE_VIDEO_PAGE, [
    CONTENT_PAGE_ATTR,
    ['urlPrefix', urlPrefix],
    ['formAttributes', {}],
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
      return res.redirect('/config/manage-videos');
    }
  } catch (err) {
    console.error(err);
  }
  req.flash('error', `Could not delete the video ${url}`);
  return res.redirect('/config/manage-videos');
};
