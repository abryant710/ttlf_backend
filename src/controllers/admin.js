const {
  pages: {
    CONFIG_LIVE_PAGE,
    CONFIG_VIDEOS_PAGE,
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
    req, res, 200, CONFIG_LIVE_PAGE, null, [['configPage', 'live']],
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
    return sendResponse(req, res, 200, CONFIG_VIDEOS_PAGE, null, [
      ['configPage', 'videos'],
      ['videos', videos],
    ]);
  } catch (err) {
    console.error(err);
  }
  req.flash('error', 'Could not fetch the videos from the database');
  return sendResponse(req, res, 400, CONFIG_VIDEOS_PAGE, 'error');
};
