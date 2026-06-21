import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  phone: [{
    type: String,
    trim: true,
  }],
  email: [{
    type: String,
    trim: true,
    lowercase: true,
  }],
  address: {
    type: String,
    default: '',
  },
  workingHours: {
    type: String,
    default: '',
  },
  mapUrl: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema);

export default Contact;
