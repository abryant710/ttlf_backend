import mongoose from 'mongoose';

const { Schema } = mongoose;

const chatMessage = new Schema({
  message: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
});

export default mongoose.model('ChatMessage', chatMessage);
