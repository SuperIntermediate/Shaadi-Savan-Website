import express from 'express';
import path from 'path';
import { authenticateAdmin, requireAdminRole } from '../auth.js';
import { readLocalDB, writeLocalDB } from '../db.js';
import {
  uploadMiddleware,
  processVerifiedUpload,
  deleteMediaAsset,
} from '../middleware/upload.js';

const router = express.Router();

// Enforce authentication & admin authorization across ALL admin routes
router.use(authenticateAdmin);
router.use(requireAdminRole);

// Helper to sanitize route params
function getSafeId(param) {
  if (!param) return '';
  return String(param).replace(/[^a-zA-Z0-9_-]/g, '');
}

// 1. Dashboard Overview KPIs
router.get('/dashboard', (req, res) => {
  const db = readLocalDB() || {};
  const media = db.media || [];
  const stories = db.stories || [];
  const films = db.films || [];
  const enquiries = db.enquiries || [];

  const totalPhotos = media.filter((m) => m.mediaType === 'image').length;
  const totalVideos = media.filter((m) => m.mediaType === 'video').length + films.length;
  const publishedProjects = stories.filter((s) => s.isPublished !== false).length;
  const draftProjects = stories.filter((s) => s.isPublished === false).length;
  const newEnquiries = enquiries.filter((e) => e.status === 'New').length;

  res.json({
    success: true,
    data: {
      stats: {
        totalPhotos,
        totalVideos,
        publishedProjects,
        draftProjects,
        newEnquiries,
        totalEnquiries: enquiries.length,
      },
      recentEnquiries: enquiries.slice(0, 5),
      recentStories: stories.slice(0, 4),
      recentMedia: media.slice(0, 6),
      hero: db.hero || {},
    },
  });
});

// 2. Hardened File Upload Endpoint (Magic Bytes, Cloudinary / Local UUID, No SVG)
router.post('/upload', (req, res) => {
  uploadMiddleware.single('file')(req, res, async (err) => {
    if (err) {
      console.warn('[Upload Rejected]', err.message);
      return res.status(400).json({ error: err.message || 'File upload failed.' });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    try {
      const uploadResult = await processVerifiedUpload(req.file, req.body.title);

      const db = readLocalDB() || {};
      const newMediaItem = {
        id: 'med-' + Date.now(),
        title: req.body.title
          ? String(req.body.title).trim().slice(0, 150)
          : path.parse(req.file.originalname).name.slice(0, 150),
        mediaType: uploadResult.mediaType,
        mediaUrl: uploadResult.url,
        url: uploadResult.url,
        thumbnailUrl: uploadResult.url,
        category: req.body.category ? String(req.body.category).trim().slice(0, 60) : 'Weddings',
        altText: req.body.altText
          ? String(req.body.altText).trim().slice(0, 200)
          : req.file.originalname.slice(0, 200),
        size: (uploadResult.bytes / 1024).toFixed(1) + ' KB',
        isPublished: true,
        createdAt: new Date().toISOString(),
      };

      if (!db.media) db.media = [];
      db.media.unshift(newMediaItem);
      writeLocalDB(db);

      console.log(`[Upload Success] ${newMediaItem.title} (${newMediaItem.mediaType}) saved. Total media: ${db.media.length}`);

      res.status(201).json({
        success: true,
        url: uploadResult.url,
        data: newMediaItem,
      });
    } catch (uploadErr) {
      console.error('[Upload Processing Error]', uploadErr.message);
      res.status(400).json({ error: uploadErr.message || 'Upload processing failed.' });
    }
  });
});

// 3. Media Library CRUD
router.get('/media', (req, res) => {
  const db = readLocalDB() || {};
  res.json({ success: true, data: db.media || [] });
});

router.put('/media/:id', (req, res) => {
  const safeId = getSafeId(req.params.id);
  const db = readLocalDB() || {};
  const idx = (db.media || []).findIndex((m) => m.id === safeId);
  if (idx === -1) return res.status(404).json({ error: 'Media asset not found.' });

  // Whitelist update fields to prevent mass assignment
  const { title, category, altText, isPublished } = req.body || {};
  const current = db.media[idx];

  db.media[idx] = {
    ...current,
    title: title !== undefined ? String(title).trim().slice(0, 150) : current.title,
    category: category !== undefined ? String(category).trim().slice(0, 60) : current.category,
    altText: altText !== undefined ? String(altText).trim().slice(0, 200) : current.altText,
    isPublished: isPublished !== undefined ? Boolean(isPublished) : current.isPublished,
    updatedAt: new Date().toISOString(),
  };

  writeLocalDB(db);
  res.json({ success: true, data: db.media[idx] });
});

router.delete('/media/:id', async (req, res) => {
  const safeId = getSafeId(req.params.id);
  const db = readLocalDB() || {};
  const mediaItem = (db.media || []).find((m) => m.id === safeId);

  if (mediaItem) {
    // Delete underlying file on disk or Cloudinary
    await deleteMediaAsset(mediaItem.mediaUrl);
    db.media = (db.media || []).filter((m) => m.id !== safeId);
    writeLocalDB(db);
  }

  res.json({ success: true, message: 'Media removed.' });
});

// 4. Hero Management
router.get('/hero', (req, res) => {
  const db = readLocalDB() || {};
  res.json({ success: true, data: db.hero || {} });
});

router.put('/hero', (req, res) => {
  const db = readLocalDB() || {};
  const current = db.hero || {};
  const { headline, supportingText, videoUrl, posterUrl, aspectRatio, duration, framesCount, isPublished } =
    req.body || {};

  db.hero = {
    ...current,
    headline: headline !== undefined ? String(headline).slice(0, 300) : current.headline,
    supportingText:
      supportingText !== undefined ? String(supportingText).slice(0, 300) : current.supportingText,
    videoUrl: videoUrl !== undefined ? String(videoUrl).slice(0, 500) : current.videoUrl,
    posterUrl: posterUrl !== undefined ? String(posterUrl).slice(0, 500) : current.posterUrl,
    aspectRatio: aspectRatio !== undefined ? String(aspectRatio).slice(0, 20) : current.aspectRatio,
    duration: duration !== undefined ? String(duration).slice(0, 30) : current.duration,
    framesCount: framesCount !== undefined ? Number(framesCount) || 300 : current.framesCount,
    isPublished: isPublished !== undefined ? Boolean(isPublished) : current.isPublished,
    lastUpdated: new Date().toISOString(),
  };

  writeLocalDB(db);
  res.json({ success: true, data: db.hero });
});

// 5. Philosophy Management
router.get('/philosophy', (req, res) => {
  const db = readLocalDB() || {};
  res.json({ success: true, data: db.philosophy || {} });
});

router.put('/philosophy', (req, res) => {
  const db = readLocalDB() || {};
  const current = db.philosophy || {};
  const { headline, paragraphs, stats, photoUrl, caption, exif } = req.body || {};

  db.philosophy = {
    ...current,
    headline: headline !== undefined ? String(headline).slice(0, 500) : current.headline,
    paragraphs: Array.isArray(paragraphs)
      ? paragraphs.map((p) => String(p).slice(0, 2000))
      : current.paragraphs,
    stats: Array.isArray(stats)
      ? stats.map((s) => ({
          label: String(s.label || '').slice(0, 100),
          value: String(s.value || '').slice(0, 100),
        }))
      : current.stats,
    photoUrl: photoUrl !== undefined ? String(photoUrl).slice(0, 500) : current.photoUrl,
    caption: caption !== undefined ? String(caption).slice(0, 200) : current.caption,
    exif: exif !== undefined ? String(exif).slice(0, 100) : current.exif,
  };

  writeLocalDB(db);
  res.json({ success: true, data: db.philosophy });
});

// 6. Wedding Stories CRUD
router.get('/stories', (req, res) => {
  const db = readLocalDB() || {};
  res.json({ success: true, data: db.stories || [] });
});

router.post('/stories', (req, res) => {
  const db = readLocalDB() || {};
  const { title, coupleNames, location, weddingDate, category, coverImage, gallery, description, filmDuration, isPublished } =
    req.body || {};

  const cleanTitle = String(title || 'Untitled Wedding Story').trim().slice(0, 150);
  const slug = (req.body.slug || cleanTitle)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .slice(0, 120);

  const newStory = {
    id: 'story-' + Date.now(),
    slug,
    title: cleanTitle,
    coupleNames: String(coupleNames || 'Couple').trim().slice(0, 100),
    location: String(location || 'India').trim().slice(0, 100),
    weddingDate: String(weddingDate || '2026').trim().slice(0, 50),
    category: String(category || 'Royal Heritage').trim().slice(0, 60),
    coverImage: String(coverImage || '/assets/images/wedding_jaipur_couple_1794571322579.jpg').slice(0, 500),
    gallery: Array.isArray(gallery) ? gallery.slice(0, 50).map((g) => String(g).slice(0, 500)) : [],
    description: String(description || '').slice(0, 5000),
    filmDuration: String(filmDuration || '08:00').slice(0, 20),
    isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
    order: (db.stories || []).length + 1,
    createdAt: new Date().toISOString(),
  };

  if (!db.stories) db.stories = [];
  db.stories.unshift(newStory);
  writeLocalDB(db);
  res.status(201).json({ success: true, data: newStory });
});

router.put('/stories/:id', (req, res) => {
  const safeId = getSafeId(req.params.id);
  const db = readLocalDB() || {};
  const idx = (db.stories || []).findIndex((s) => s.id === safeId);
  if (idx === -1) return res.status(404).json({ error: 'Story not found.' });

  const current = db.stories[idx];
  const { title, coupleNames, location, weddingDate, category, coverImage, gallery, description, filmDuration, isPublished, order } =
    req.body || {};

  db.stories[idx] = {
    ...current,
    title: title !== undefined ? String(title).trim().slice(0, 150) : current.title,
    coupleNames: coupleNames !== undefined ? String(coupleNames).trim().slice(0, 100) : current.coupleNames,
    location: location !== undefined ? String(location).trim().slice(0, 100) : current.location,
    weddingDate: weddingDate !== undefined ? String(weddingDate).trim().slice(0, 50) : current.weddingDate,
    category: category !== undefined ? String(category).trim().slice(0, 60) : current.category,
    coverImage: coverImage !== undefined ? String(coverImage).slice(0, 500) : current.coverImage,
    gallery: Array.isArray(gallery) ? gallery.slice(0, 50).map((g) => String(g).slice(0, 500)) : current.gallery,
    description: description !== undefined ? String(description).slice(0, 5000) : current.description,
    filmDuration: filmDuration !== undefined ? String(filmDuration).slice(0, 20) : current.filmDuration,
    isPublished: isPublished !== undefined ? Boolean(isPublished) : current.isPublished,
    order: order !== undefined ? Number(order) || 0 : current.order,
    updatedAt: new Date().toISOString(),
  };

  writeLocalDB(db);
  res.json({ success: true, data: db.stories[idx] });
});

router.delete('/stories/:id', (req, res) => {
  const safeId = getSafeId(req.params.id);
  const db = readLocalDB() || {};
  db.stories = (db.stories || []).filter((s) => s.id !== safeId);
  writeLocalDB(db);
  res.json({ success: true, message: 'Story deleted.' });
});

// 7. Services CRUD
router.get('/services', (req, res) => {
  const db = readLocalDB() || {};
  res.json({ success: true, data: db.services || [] });
});

router.post('/services', (req, res) => {
  const db = readLocalDB() || {};
  const { title, tag, description, deliverables, image, isPublished } = req.body || {};

  const newService = {
    id: 'srv-' + Date.now(),
    title: String(title || 'New Service').trim().slice(0, 120),
    tag: String(tag || 'Specialized Offering').trim().slice(0, 80),
    description: String(description || '').slice(0, 3000),
    deliverables: String(deliverables || '').slice(0, 3000),
    image: String(image || '/assets/images/wedding_udaipur_palace_1794571321843.jpg').slice(0, 500),
    order: (db.services || []).length + 1,
    isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
  };

  if (!db.services) db.services = [];
  db.services.push(newService);
  writeLocalDB(db);
  res.status(201).json({ success: true, data: newService });
});

router.put('/services/:id', (req, res) => {
  const safeId = getSafeId(req.params.id);
  const db = readLocalDB() || {};
  const idx = (db.services || []).findIndex((s) => s.id === safeId);
  if (idx === -1) return res.status(404).json({ error: 'Service not found.' });

  const current = db.services[idx];
  const { title, tag, description, deliverables, image, order, isPublished } = req.body || {};

  db.services[idx] = {
    ...current,
    title: title !== undefined ? String(title).trim().slice(0, 120) : current.title,
    tag: tag !== undefined ? String(tag).trim().slice(0, 80) : current.tag,
    description: description !== undefined ? String(description).slice(0, 3000) : current.description,
    deliverables: deliverables !== undefined ? String(deliverables).slice(0, 3000) : current.deliverables,
    image: image !== undefined ? String(image).slice(0, 500) : current.image,
    order: order !== undefined ? Number(order) || 0 : current.order,
    isPublished: isPublished !== undefined ? Boolean(isPublished) : current.isPublished,
  };

  writeLocalDB(db);
  res.json({ success: true, data: db.services[idx] });
});

router.delete('/services/:id', (req, res) => {
  const safeId = getSafeId(req.params.id);
  const db = readLocalDB() || {};
  db.services = (db.services || []).filter((s) => s.id !== safeId);
  writeLocalDB(db);
  res.json({ success: true, message: 'Service removed.' });
});

// 8. Chapters CRUD
router.get('/chapters', (req, res) => {
  const db = readLocalDB() || {};
  res.json({ success: true, data: db.chapters || [] });
});

router.post('/chapters', (req, res) => {
  const db = readLocalDB() || {};
  const { title, ritual, timeOfDay, location, description, image, isPublished } = req.body || {};

  const newChapter = {
    id: 'ch-' + Date.now(),
    title: String(title || 'New Chapter').trim().slice(0, 120),
    ritual: String(ritual || 'Celebration Ritual').trim().slice(0, 100),
    timeOfDay: String(timeOfDay || '12:00 PM').trim().slice(0, 50),
    location: String(location || 'Palace Courtyard').trim().slice(0, 100),
    description: String(description || '').slice(0, 2000),
    image: String(image || '/assets/images/wedding_haldi_celebration_1794571322283.jpg').slice(0, 500),
    order: (db.chapters || []).length + 1,
    isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
  };

  if (!db.chapters) db.chapters = [];
  db.chapters.push(newChapter);
  writeLocalDB(db);
  res.status(201).json({ success: true, data: newChapter });
});

router.put('/chapters/:id', (req, res) => {
  const safeId = getSafeId(req.params.id);
  const db = readLocalDB() || {};
  const idx = (db.chapters || []).findIndex((c) => c.id === safeId);
  if (idx === -1) return res.status(404).json({ error: 'Chapter not found.' });

  const current = db.chapters[idx];
  const { title, ritual, timeOfDay, location, description, image, order, isPublished } = req.body || {};

  db.chapters[idx] = {
    ...current,
    title: title !== undefined ? String(title).trim().slice(0, 120) : current.title,
    ritual: ritual !== undefined ? String(ritual).trim().slice(0, 100) : current.ritual,
    timeOfDay: timeOfDay !== undefined ? String(timeOfDay).trim().slice(0, 50) : current.timeOfDay,
    location: location !== undefined ? String(location).trim().slice(0, 100) : current.location,
    description: description !== undefined ? String(description).slice(0, 2000) : current.description,
    image: image !== undefined ? String(image).slice(0, 500) : current.image,
    order: order !== undefined ? Number(order) || 0 : current.order,
    isPublished: isPublished !== undefined ? Boolean(isPublished) : current.isPublished,
  };

  writeLocalDB(db);
  res.json({ success: true, data: db.chapters[idx] });
});

router.delete('/chapters/:id', (req, res) => {
  const safeId = getSafeId(req.params.id);
  const db = readLocalDB() || {};
  db.chapters = (db.chapters || []).filter((c) => c.id !== safeId);
  writeLocalDB(db);
  res.json({ success: true, message: 'Chapter removed.' });
});

// 9. Cinematic Films CRUD
router.get('/films', (req, res) => {
  const db = readLocalDB() || {};
  res.json({ success: true, data: db.films || [] });
});

router.post('/films', (req, res) => {
  const db = readLocalDB() || {};
  const { title, couple, location, year, duration, posterImage, videoUrl, storyBlurb, isPublished } =
    req.body || {};

  const newFilm = {
    id: 'film-' + Date.now(),
    title: String(title || 'New Wedding Film').trim().slice(0, 150),
    couple: String(couple || 'Couple').trim().slice(0, 100),
    location: String(location || 'India').trim().slice(0, 100),
    year: String(year || '2026').trim().slice(0, 20),
    duration: String(duration || '08:00').trim().slice(0, 20),
    posterImage: String(posterImage || '/assets/images/film_cinema_still_1794655082919.jpg').slice(0, 500),
    videoUrl: String(videoUrl || '/wedding_video_frames_30fps/frame_000001.jpg').slice(0, 500),
    storyBlurb: String(storyBlurb || '').slice(0, 3000),
    isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
    order: (db.films || []).length + 1,
  };

  if (!db.films) db.films = [];
  db.films.push(newFilm);
  writeLocalDB(db);
  res.status(201).json({ success: true, data: newFilm });
});

router.put('/films/:id', (req, res) => {
  const safeId = getSafeId(req.params.id);
  const db = readLocalDB() || {};
  const idx = (db.films || []).findIndex((f) => f.id === safeId);
  if (idx === -1) return res.status(404).json({ error: 'Film not found.' });

  const current = db.films[idx];
  const { title, couple, location, year, duration, posterImage, videoUrl, storyBlurb, order, isPublished } =
    req.body || {};

  db.films[idx] = {
    ...current,
    title: title !== undefined ? String(title).trim().slice(0, 150) : current.title,
    couple: couple !== undefined ? String(couple).trim().slice(0, 100) : current.couple,
    location: location !== undefined ? String(location).trim().slice(0, 100) : current.location,
    year: year !== undefined ? String(year).trim().slice(0, 20) : current.year,
    duration: duration !== undefined ? String(duration).trim().slice(0, 20) : current.duration,
    posterImage: posterImage !== undefined ? String(posterImage).slice(0, 500) : current.posterImage,
    videoUrl: videoUrl !== undefined ? String(videoUrl).slice(0, 500) : current.videoUrl,
    storyBlurb: storyBlurb !== undefined ? String(storyBlurb).slice(0, 3000) : current.storyBlurb,
    order: order !== undefined ? Number(order) || 0 : current.order,
    isPublished: isPublished !== undefined ? Boolean(isPublished) : current.isPublished,
  };

  writeLocalDB(db);
  res.json({ success: true, data: db.films[idx] });
});

router.delete('/films/:id', (req, res) => {
  const safeId = getSafeId(req.params.id);
  const db = readLocalDB() || {};
  db.films = (db.films || []).filter((f) => f.id !== safeId);
  writeLocalDB(db);
  res.json({ success: true, message: 'Film removed.' });
});

// 10. Testimonials CRUD
router.get('/testimonials', (req, res) => {
  const db = readLocalDB() || {};
  res.json({ success: true, data: db.testimonials || [] });
});

router.post('/testimonials', (req, res) => {
  const db = readLocalDB() || {};
  const { couple, venue, coverage, quote, photo, rating, isPublished } = req.body || {};

  const cleanRating = Math.min(5, Math.max(1, Number(rating) || 5));

  const newTestimonial = {
    id: 'test-' + Date.now(),
    couple: String(couple || 'Couple Names').trim().slice(0, 100),
    venue: String(venue || 'Venue, City').trim().slice(0, 100),
    coverage: String(coverage || 'Wedding Coverage').trim().slice(0, 100),
    quote: String(quote || 'Heartfelt note...').slice(0, 2000),
    photo: String(photo || '/assets/images/wedding_jaipur_couple_1794571322579.jpg').slice(0, 500),
    rating: cleanRating,
    isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
    order: (db.testimonials || []).length + 1,
  };

  if (!db.testimonials) db.testimonials = [];
  db.testimonials.push(newTestimonial);
  writeLocalDB(db);
  res.status(201).json({ success: true, data: newTestimonial });
});

router.put('/testimonials/:id', (req, res) => {
  const safeId = getSafeId(req.params.id);
  const db = readLocalDB() || {};
  const idx = (db.testimonials || []).findIndex((t) => t.id === safeId);
  if (idx === -1) return res.status(404).json({ error: 'Testimonial not found.' });

  const current = db.testimonials[idx];
  const { couple, venue, coverage, quote, photo, rating, order, isPublished } = req.body || {};

  db.testimonials[idx] = {
    ...current,
    couple: couple !== undefined ? String(couple).trim().slice(0, 100) : current.couple,
    venue: venue !== undefined ? String(venue).trim().slice(0, 100) : current.venue,
    coverage: coverage !== undefined ? String(coverage).trim().slice(0, 100) : current.coverage,
    quote: quote !== undefined ? String(quote).slice(0, 2000) : current.quote,
    photo: photo !== undefined ? String(photo).slice(0, 500) : current.photo,
    rating: rating !== undefined ? Math.min(5, Math.max(1, Number(rating) || 5)) : current.rating,
    order: order !== undefined ? Number(order) || 0 : current.order,
    isPublished: isPublished !== undefined ? Boolean(isPublished) : current.isPublished,
  };

  writeLocalDB(db);
  res.json({ success: true, data: db.testimonials[idx] });
});

router.delete('/testimonials/:id', (req, res) => {
  const safeId = getSafeId(req.params.id);
  const db = readLocalDB() || {};
  db.testimonials = (db.testimonials || []).filter((t) => t.id !== safeId);
  writeLocalDB(db);
  res.json({ success: true, message: 'Testimonial removed.' });
});

// 11. Enquiries Management
router.get('/enquiries', (req, res) => {
  const db = readLocalDB() || {};
  res.json({ success: true, data: db.enquiries || [] });
});

router.put('/enquiries/:id', (req, res) => {
  const safeId = getSafeId(req.params.id);
  const db = readLocalDB() || {};
  const idx = (db.enquiries || []).findIndex((e) => e.id === safeId);
  if (idx === -1) return res.status(404).json({ error: 'Enquiry not found.' });

  const current = db.enquiries[idx];
  const { status, notes } = req.body || {};

  const allowedStatuses = ['New', 'Contacted', 'Consultation Booked', 'Commission Confirmed', 'Archived'];
  const cleanStatus = allowedStatuses.includes(status) ? status : current.status;

  db.enquiries[idx] = {
    ...current,
    status: cleanStatus,
    notes: notes !== undefined ? String(notes).slice(0, 3000) : current.notes,
    updatedAt: new Date().toISOString(),
  };

  writeLocalDB(db);
  res.json({ success: true, data: db.enquiries[idx] });
});

router.delete('/enquiries/:id', (req, res) => {
  const safeId = getSafeId(req.params.id);
  const db = readLocalDB() || {};
  db.enquiries = (db.enquiries || []).filter((e) => e.id !== safeId);
  writeLocalDB(db);
  res.json({ success: true, message: 'Enquiry removed.' });
});

// 12. Settings Management
router.get('/settings', (req, res) => {
  const db = readLocalDB() || {};
  res.json({ success: true, data: db.settings || {} });
});

router.put('/settings', (req, res) => {
  const db = readLocalDB() || {};
  const current = db.settings || {};
  const {
    brandName,
    tagline,
    logoUrl,
    contactEmail,
    phone,
    whatsapp,
    instagramUrl,
    youtubeUrl,
    locations,
    seoTitle,
    seoDescription,
    ogImageUrl,
    bookingHeadline,
    bookingDescription,
    calendarStatus,
  } = req.body || {};

  db.settings = {
    ...current,
    brandName: brandName !== undefined ? String(brandName).slice(0, 100) : current.brandName,
    tagline: tagline !== undefined ? String(tagline).slice(0, 200) : current.tagline,
    logoUrl: logoUrl !== undefined ? String(logoUrl).slice(0, 500) : current.logoUrl,
    contactEmail: contactEmail !== undefined ? String(contactEmail).slice(0, 120) : current.contactEmail,
    phone: phone !== undefined ? String(phone).slice(0, 40) : current.phone,
    whatsapp: whatsapp !== undefined ? String(whatsapp).slice(0, 40) : current.whatsapp,
    instagramUrl: instagramUrl !== undefined ? String(instagramUrl).slice(0, 300) : current.instagramUrl,
    youtubeUrl: youtubeUrl !== undefined ? String(youtubeUrl).slice(0, 300) : current.youtubeUrl,
    locations: locations !== undefined ? String(locations).slice(0, 200) : current.locations,
    seoTitle: seoTitle !== undefined ? String(seoTitle).slice(0, 150) : current.seoTitle,
    seoDescription: seoDescription !== undefined ? String(seoDescription).slice(0, 400) : current.seoDescription,
    ogImageUrl: ogImageUrl !== undefined ? String(ogImageUrl).slice(0, 500) : current.ogImageUrl,
    bookingHeadline: bookingHeadline !== undefined ? String(bookingHeadline).slice(0, 200) : current.bookingHeadline,
    bookingDescription: bookingDescription !== undefined ? String(bookingDescription).slice(0, 500) : current.bookingDescription,
    calendarStatus: calendarStatus !== undefined ? String(calendarStatus).slice(0, 200) : current.calendarStatus,
  };

  writeLocalDB(db);
  res.json({ success: true, data: db.settings });
});

export default router;
