import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  description: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

locationSchema.index({ name: 1 });

const Location = mongoose.models.Location || mongoose.model('Location', locationSchema);

export default Location;
