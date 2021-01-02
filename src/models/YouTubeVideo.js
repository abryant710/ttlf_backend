const mongoose = require('mongoose');

const { Schema } = mongoose;

const youTubeVideoSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('YouTubeVideo', youTubeVideoSchema);
