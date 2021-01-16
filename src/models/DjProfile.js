import mongoose from 'mongoose';

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

export default mongoose.model('DjProfile', djProfile);
