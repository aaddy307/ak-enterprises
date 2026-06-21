import mongoose from 'mongoose';

const socialMediaSchema = new mongoose.Schema({
  platform: {
    type: String,
    required: true,
    trim: true,
  },
  url: {
    type: String,
    required: true,
    trim: true,
  },
  icon: {
    type: String,
    default: 'Link',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

socialMediaSchema.index({ platform: 1 });
socialMediaSchema.index({ isActive: 1 });

const SocialMedia = mongoose.models.SocialMedia || mongoose.model('SocialMedia', socialMediaSchema);

export default SocialMedia;
