const {
  pages: {
    CONFIG_LIVE_PAGE,
    MANAGE_VIDEOS_PAGE,
  },
} = require('../utils/pages');
const SiteConfig = require('../models/SiteConfig');
const YouTubeVideo = require('../models/YouTubeVideo');
const { sendResponse } = require('../utils/general');

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
    req, res, 200, CONFIG_LIVE_PAGE, [['configPage', 'live']],
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
      ['configPage', 'site-content'],
      ['videos', videos],
    ]);
  } catch (err) {
    console.error(err);
  }
  req.flash('error', 'Could not fetch the videos from the database');
  return sendResponse(req, res, 400, MANAGE_VIDEOS_PAGE);
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
