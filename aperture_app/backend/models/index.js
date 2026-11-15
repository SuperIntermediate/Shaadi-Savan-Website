import mongoose, { Schema, model } from 'mongoose';

// 1. Unified Site Store Schema (Stores full application state and settings)
const SiteStoreSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: 'main_store',
    },
    data: {
      type: Schema.Types.Mixed,
      required: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// 2. Public Client Enquiry Schema (Independent collection for Atlas CRM views)
const EnquirySchema = new Schema(
  {
    clientName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    weddingDate: { type: String, trim: true },
    location: { type: String, trim: true },
    weddingType: { type: String, trim: true },
    service: { type: String, trim: true },
    message: { type: String, trim: true },
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
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    coupleNames: { type: String, required: true, trim: true },
    location: { type: String, trim: true },
    weddingDate: { type: String, trim: true },
    category: { type: String, trim: true },
    coverImage: { type: String, required: true },
    gallery: [{ type: String }],
    description: { type: String },
    filmDuration: { type: String },
    isPublished: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// 4. Testimonial Schema
const TestimonialSchema = new Schema(
  {
    couple: { type: String, required: true, trim: true },
    venue: { type: String, trim: true },
    coverage: { type: String, trim: true },
    quote: { type: String, required: true },
    photo: { type: String },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    isPublished: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const SiteStore = mongoose.models.SiteStore || model('SiteStore', SiteStoreSchema);
export const Enquiry = mongoose.models.Enquiry || model('Enquiry', EnquirySchema);
export const Story = mongoose.models.Story || model('Story', StorySchema);
export const Testimonial = mongoose.models.Testimonial || model('Testimonial', TestimonialSchema);
