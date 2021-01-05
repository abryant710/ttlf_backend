const SiteConfig = require('../models/SiteConfig');
const YouTubeVideo = require('../models/YouTubeVideo');
const SoundcloudTrack = require('../models/SoundcloudTrack');
const DjProfile = require('../models/DjProfile');

module.exports.getWebsiteConfig = async (_req, res) => {
  try {
    const collections = {};
    const siteConfig = await SiteConfig.findOne({});
    const {
      upcomingEvent,
      liveNow,
      currentLiveDj,
      youTubeVideosRandomised,
      youTubeVideoPrefix,
      soundcloudTracksRandomised,
      soundcloudTrackPrefix,
    } = siteConfig;
    const videos = await YouTubeVideo.find({});
    const tracks = await SoundcloudTrack.find({});
    const profiles = await DjProfile.find({});
    collections.youTubeVideos = siteConfig.youTubeVideos.map((youTubeVid) => {
      const { url, title } = videos.find(({ _id }) => youTubeVid.equals(_id));
      return { url, title };
    });
    collections.soundcloudTracks = siteConfig.soundcloudTracks.map((soundcloudTrack) => {
      const { url, title } = tracks.find(({ _id }) => soundcloudTrack.equals(_id));
      return { url, title };
    });
    collections.djProfiles = siteConfig.djProfiles.map((profileId) => {
      const { name, nickname, bio } = profiles.find(({ _id }) => profileId.equals(_id));
      return { name, nickname, bio };
    });
    return res.status(200).json({
      ...collections,
      upcomingEvent,
      liveNow,
      currentLiveDj,
      youTubeVideosRandomised,
      youTubeVideoPrefix,
      soundcloudTracksRandomised,
      soundcloudTrackPrefix,
      status: 'success',
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: 'error',
    });
  }
};
