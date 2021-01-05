const mongoose = require('mongoose');

const { Schema } = mongoose;

const soundcloudTrackSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('SoundcloudTrack', soundcloudTrackSchema);
