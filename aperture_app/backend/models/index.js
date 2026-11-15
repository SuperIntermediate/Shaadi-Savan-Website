import mongoose, { Schema, model } from 'mongoose';

// 1. Admin Schema
const AdminSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 120,
    },
    password: {
      type: String,
      required: true,
      select: false, // Never return password hash in queries
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    role: {
      type: String,
      default: 'Agency Owner',
      enum: ['Agency Owner', 'admin', 'administrator'],
    },
    tokenVersion: {
      type: Number,
      default: 1,
    },
    passwordChangedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// 2. Public Enquiry Schema
const EnquirySchema = new Schema(
  {
    clientName: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 120 },
    phone: { type: String, trim: true, maxlength: 30 },
    weddingDate: { type: String, trim: true, maxlength: 60 },
    location: { type: String, trim: true, maxlength: 120 },
    weddingType: { type: String, trim: true, maxlength: 100 },
    service: { type: String, trim: true, maxlength: 100 },
    message: { type: String, trim: true, maxlength: 3000 },
    status: {
      type: String,
      default: 'New',
      enum: ['New', 'Contacted', 'Consultation Booked', 'Commission Confirmed', 'Archived'],
    },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// 3. Featured Wedding Story Schema
const StorySchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true, maxlength: 120 },
    title: { type: String, required: true, trim: true, maxlength: 150 },
    coupleNames: { type: String, required: true, trim: true, maxlength: 100 },
    location: { type: String, trim: true, maxlength: 100 },
    weddingDate: { type: String, trim: true, maxlength: 50 },
    category: { type: String, trim: true, maxlength: 60 },
    coverImage: { type: String, required: true },
    gallery: [{ type: String }],
    description: { type: String, maxlength: 5000 },
    filmDuration: { type: String, maxlength: 20 },
    isPublished: { type: Boolean, default: true, index: true },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true }
);

// 4. Cinematic Film Schema
const FilmSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 150 },
    couple: { type: String, required: true, trim: true, maxlength: 100 },
    location: { type: String, trim: true, maxlength: 100 },
    year: { type: String, maxlength: 10 },
    duration: { type: String, maxlength: 20 },
    posterImage: { type: String, required: true },
    videoUrl: { type: String, required: true },
    storyBlurb: { type: String, maxlength: 2000 },
    isPublished: { type: Boolean, default: true, index: true },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true }
);

// 5. Media Asset Schema
const MediaSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 150 },
    mediaType: { type: String, required: true, enum: ['image', 'video'] },
    mediaUrl: { type: String, required: true },
    url: { type: String, required: true },
    thumbnailUrl: { type: String },
    category: { type: String, default: 'Weddings', maxlength: 60 },
    altText: { type: String, maxlength: 200 },
    size: { type: String, maxlength: 30 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// 6. Testimonial Schema
const TestimonialSchema = new Schema(
  {
    couple: { type: String, required: true, trim: true, maxlength: 100 },
    venue: { type: String, trim: true, maxlength: 100 },
    coverage: { type: String, trim: true, maxlength: 100 },
    quote: { type: String, required: true, maxlength: 2000 },
    photo: { type: String },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    isPublished: { type: Boolean, default: true, index: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Models Export
export const AdminModel = model('Admin', AdminSchema);
export const EnquiryModel = model('Enquiry', EnquirySchema);
export const StoryModel = model('Story', StorySchema);
export const FilmModel = model('Film', FilmSchema);
export const MediaModel = model('Media', MediaSchema);
export const TestimonialModel = model('Testimonial', TestimonialSchema);
