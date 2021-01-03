const mongoose = require('mongoose');

const { Schema } = mongoose;

const siteConfigSchema = new Schema({
  youTubeVideoPrefix: {
    type: String,
    required: true,
  },
  youTubeVideos: {
    type: [Schema.Types.ObjectId],
    required: true,
  },
  soundcloudTrackPrefix: {
    type: String,
    required: true,
  },
  soundcloudTracks: {
    type: [Schema.Types.ObjectId],
    required: true,
  },
});

module.exports = mongoose.model('SiteConfig', siteConfigSchema);
