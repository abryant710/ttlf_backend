import SiteConfig from '../models/SiteConfig.js';
import YouTubeVideo from '../models/YouTubeVideo.js';
import SoundcloudTrack from '../models/SoundcloudTrack.js';
import DjProfile from '../models/DjProfile.js';
import Schedule from '../models/Schedule.js';
import { sortSchedules } from '../utils/general.js';
import io from '../../socket.js';

export const getWebsiteConfig = async (_req, res) => {
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

export const getLatestChat = async (_req, res) => {
  try {
    return res.status(200).json({
      status: 'success',
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: 'error',
    });
  }
};

export const postNewMessage = async (req, res) => {
  console.log(req.body);
  try {
    // io.getIO().emit('messages', {
    //   action: 'create',
    //   message,
    // })
    return res.status(200).json({
      status: 'success',
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: 'error',
    });
  }
};
