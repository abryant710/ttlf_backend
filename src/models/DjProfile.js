const mongoose = require('mongoose');

const { Schema } = mongoose;

const djProfile = new Schema({
  name: {
    type: String,
    required: true,
  },
  nickname: {
    type: String,
    required: false,
  },
  bio: {
    type: [String],
    required: true,
  },
});

module.exports = mongoose.model('DjProfile', djProfile);
