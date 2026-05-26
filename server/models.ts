import mongoose from 'mongoose';

// Admin User
const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
export const Admin = mongoose.model('Admin', adminSchema);

// Scholarship
const scholarshipSchema = new mongoose.Schema({
  title: { type: String, required: true },
  country: { type: String, required: true },
  level: { type: String, required: true }, // UG, Master, PhD
  region: { type: String },
  university: { type: String, required: true },
  description: { type: String, required: true },
  deadline: { type: Date },
  applyLink: { type: String },
  image: { type: String }, // Can be URL or Base64
  imageAltText: { type: String },
  isUpcoming: { type: Boolean, default: false },
  clicks: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});
export const Scholarship = mongoose.model('Scholarship', scholarshipSchema);

// Blog
const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String },
  imageAltText: { type: String },
  createdAt: { type: Date, default: Date.now },
});
export const Blog = mongoose.model('Blog', blogSchema);

// Country
const countrySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  image: { type: String },
});
export const Country = mongoose.model('Country', countrySchema);

// Ads
const adSchema = new mongoose.Schema({
  type: { type: String, required: true, enum: ['image', 'script', 'html', 'google_ads'] },
  placement: { type: String, required: true, enum: ['home', 'sidebar', 'footer', 'between_content', 'over_navbar', 'header'] },
  content: { type: String, required: true }, // Image URL or Script text/HTML
  active: { type: Boolean, default: true },
});
export const Ad = mongoose.model('Ad', adSchema);

// Carousel
const carouselSchema = new mongoose.Schema({
  title: { type: String },
  image: { type: String, required: true },
  imageAltText: { type: String },
  description: { type: String },
  link: { type: String },
  order: { type: Number, default: 0 },
});
export const Carousel = mongoose.model('Carousel', carouselSchema);

// Contact Message
const contactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
export const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);

// Setting
const settingSchema = new mongoose.Schema({
  siteName: { type: String, default: 'GlobalOpportunity' },
  logo: { type: String },
  email: { type: String },
  phone: { type: String },
  address: { type: String },
  socialLinks: {
    linkedin: { type: String, default: '' },
    github: { type: String, default: '' },
    instagram: { type: String, default: '' },
    youtube: { type: String, default: '' },
    facebook: { type: String, default: '' },
    portfolio: { type: String, default: '' },
    whatsapp: { type: String, default: '' }
  },
  seo: {
    title: { type: String, default: 'GlobalOpportunity - Scholarships Worldwide' },
    description: { type: String, default: 'Find fully funded scholarships and study opportunities worldwide.' },
    keywords: { type: String, default: 'scholarships, study abroad, international students' }
  },
  helpPage: {
    title: { type: String, default: 'How We Can Help You' },
    description: { type: String, default: 'We can prepare your documents here and apply for this scholarship for an affordable price.' }
  },
  systemEmail: { type: String, default: 'techhub905@gmail.com' }
});
export const Setting = mongoose.model('Setting', settingSchema);

// Subscriber
const subscriberSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});
export const Subscriber = mongoose.model('Subscriber', subscriberSchema);

// Video
const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  youtubeLink: { type: String, required: true },
  description: { type: String },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});
export const Video = mongoose.model('Video', videoSchema);

// Service
const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  iconName: { type: String, default: 'FileText' },
  colorClass: { type: String, default: 'bg-blue-50 border-blue-100' },
  iconColorClass: { type: String, default: 'text-blue-600' },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});
export const Service = mongoose.model('Service', serviceSchema);
