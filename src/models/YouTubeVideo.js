import mongoose from 'mongoose';

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

export default mongoose.model('YouTubeVideo', youTubeVideoSchema);
