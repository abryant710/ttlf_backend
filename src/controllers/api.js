const SiteConfig = require('../models/SiteConfig');
const YouTubeVideo = require('../models/YouTubeVideo');
const SoundcloudTrack = require('../models/SoundcloudTrack');
const DjProfile = require('../models/DjProfile');
const Schedule = require('../models/Schedule');
const { sortSchedules } = require('../utils/general');

module.exports.getWebsiteConfig = async (_req, res) => {
  try {
    const collections = {};
    const siteConfig = await SiteConfig.findOne({});
    const {
      upcomingEvent,
      eventFlyerLocation,
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
    const scheds = await Schedule.find({});
    collections.youTubeVideos = videos.map(({ url, title }) => ({ url, title }));
    collections.soundcloudTracks = tracks.map(({ url, title }) => ({ url, title }));
    collections.djProfiles = profiles.map(({ name, nickname, bio }) => ({ name, nickname, bio }));
    collections.schedules = sortSchedules(profiles, scheds).map(
      ({ date, time, name }) => ({ date, time, dj: name }),
    );
    const dj = await DjProfile.findOne({ _id: currentLiveDj });
    return res.status(200).json({
      ...collections,
      upcomingEvent,
      eventFlyerLocation,
      liveNow,
      currentLiveDj: dj.nickname || dj.name,
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
