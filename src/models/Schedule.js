import mongoose from 'mongoose';

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

export default mongoose.model('Schedule', schedule);
