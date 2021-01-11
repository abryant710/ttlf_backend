const mongoose = require('mongoose');

const { Schema } = mongoose;

const siteConfigSchema = new Schema({
  upcomingEvent: {
    type: String,
    required: true,
  },
  eventFlyerLocation: {
    type: String,
    required: true,
  },
  liveNow: {
    type: Boolean,
    required: true,
  },
  currentLiveDj: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  youTubeVideoPrefix: {
    type: String,
    required: true,
  },
  youTubeVideosRandomised: {
    type: Boolean,
    required: true,
  },
  soundcloudTrackPrefix: {
    type: String,
    required: true,
  },
  soundcloudTracksRandomised: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model('SiteConfig', siteConfigSchema);
