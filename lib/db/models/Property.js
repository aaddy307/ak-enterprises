import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  images: [{
    type: String,
  }],
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  features: [{
    type: String,
  }],
  area: {
    type: String,
    trim: true,
  },
  bedrooms: {
    type: Number,
    default: 0,
  },
  bathrooms: {
    type: Number,
    default: 0,
  },
  parking: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

propertySchema.index({ title: 'text', description: 'text', location: 'text' });
propertySchema.index({ category: 1 });
propertySchema.index({ status: 1 });
propertySchema.index({ isFeatured: 1 });
propertySchema.index({ createdAt: -1 });

const Property = mongoose.models.Property || mongoose.model('Property', propertySchema);

export default Property;
