const mongoose = require('mongoose');

const { Schema } = mongoose;

const schedule = new Schema({
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  dj: {
    type: Schema.Types.ObjectId,
    required: false,
  },
});

module.exports = mongoose.model('Schedule', schedule);
