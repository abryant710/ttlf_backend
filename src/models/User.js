import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: true,
  },
  isSuperAdmin: {
    type: Boolean,
    required: true,
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

export default mongoose.model('User', userSchema);
