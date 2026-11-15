import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { authenticateAdmin } from '../auth.js';
import { readLocalDB, writeLocalDB } from '../db.js';
import { secureUpload } from '../middleware/upload.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Apply auth to all admin routes
router.use(authenticateAdmin);

// Dashboard Overview KPIs
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

// File Upload endpoint (Protected with secureUpload)
router.post('/upload', (req, res) => {
  secureUpload.single('file')(req, res, (err) => {
    if (err) {
      console.error('[Upload Error]', err);
      return res.status(400).json({ error: err.message || 'File upload failed.' });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    const isVideo =
      /mp4|webm|mov|quicktime|m4v|mkv/i.test(path.extname(req.file.originalname).toLowerCase()) ||
      (req.file.mimetype && req.file.mimetype.startsWith('video/'));

    const db = readLocalDB() || {};
    const newMediaItem = {
      id: 'med-' + Date.now(),
      title: req.body.title || path.basename(req.file.originalname, path.extname(req.file.originalname)),
      mediaType: isVideo ? 'video' : 'image',
      mediaUrl: fileUrl,
      url: fileUrl,
      thumbnailUrl: fileUrl,
      category: req.body.category || 'Weddings',
      altText: req.body.altText || req.file.originalname,
      size: (req.file.size / 1024).toFixed(1) + ' KB',
      isPublished: true,
      createdAt: new Date().toISOString(),
    };

    if (!db.media) db.media = [];
    db.media.unshift(newMediaItem);
    writeLocalDB(db);

    console.log(`[Upload Success] ${newMediaItem.title} (${newMediaItem.mediaType}) saved. Total media: ${db.media.length}`);

    res.status(201).json({
      success: true,
      url: fileUrl,
      data: newMediaItem,
    });
  });
});

// Media Library
router.get('/media', (req, res) => {
  const db = readLocalDB() || {};
  res.json({ success: true, data: db.media || [] });
});

router.put('/media/:id', (req, res) => {
  const db = readLocalDB() || {};
  const idx = (db.media || []).findIndex((m) => m.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Media not found' });

  db.media[idx] = { ...db.media[idx], ...req.body, updatedAt: new Date().toISOString() };
  writeLocalDB(db);
  res.json({ success: true, data: db.media[idx] });
});

router.delete('/media/:id', (req, res) => {
  const db = readLocalDB() || {};
  db.media = (db.media || []).filter((m) => m.id !== req.params.id);
  writeLocalDB(db);
  res.json({ success: true, message: 'Media removed.' });
});

// Hero Management
router.get('/hero', (req, res) => {
  const db = readLocalDB() || {};
  res.json({ success: true, data: db.hero || {} });
});

router.put('/hero', (req, res) => {
  const db = readLocalDB() || {};
  db.hero = {
    ...db.hero,
    ...req.body,
    lastUpdated: new Date().toISOString(),
  };
  writeLocalDB(db);
  res.json({ success: true, data: db.hero });
});

// Philosophy Management
router.get('/philosophy', (req, res) => {
  const db = readLocalDB() || {};
  res.json({ success: true, data: db.philosophy || {} });
});

router.put('/philosophy', (req, res) => {
  const db = readLocalDB() || {};
  db.philosophy = { ...db.philosophy, ...req.body };
  writeLocalDB(db);
  res.json({ success: true, data: db.philosophy });
});

// Wedding Stories CRUD
router.get('/stories', (req, res) => {
  const db = readLocalDB() || {};
  res.json({ success: true, data: db.stories || [] });
});

router.post('/stories', (req, res) => {
  const db = readLocalDB() || {};
  const newStory = {
    id: 'story-' + Date.now(),
    slug: req.body.slug || (req.body.title || 'wedding').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    title: req.body.title || 'Untitled Wedding Story',
    coupleNames: req.body.coupleNames || 'Couple',
    location: req.body.location || 'India',
    weddingDate: req.body.weddingDate || '2026',
    category: req.body.category || 'Royal Heritage',
    coverImage: req.body.coverImage || '/assets/images/wedding_jaipur_couple_1794571322579.jpg',
    gallery: Array.isArray(req.body.gallery) ? req.body.gallery : [],
    description: req.body.description || '',
    filmDuration: req.body.filmDuration || '08:00',
    isPublished: req.body.isPublished !== undefined ? req.body.isPublished : true,
    order: (db.stories || []).length + 1,
    createdAt: new Date().toISOString(),
  };

  if (!db.stories) db.stories = [];
  db.stories.unshift(newStory);
  writeLocalDB(db);
  res.status(201).json({ success: true, data: newStory });
});

router.put('/stories/:id', (req, res) => {
  const db = readLocalDB() || {};
  const idx = (db.stories || []).findIndex((s) => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Story not found' });

  db.stories[idx] = { ...db.stories[idx], ...req.body, updatedAt: new Date().toISOString() };
  writeLocalDB(db);
  res.json({ success: true, data: db.stories[idx] });
});

router.delete('/stories/:id', (req, res) => {
  const db = readLocalDB() || {};
  db.stories = (db.stories || []).filter((s) => s.id !== req.params.id);
  writeLocalDB(db);
  res.json({ success: true, message: 'Story deleted' });
});

// Services CRUD
router.get('/services', (req, res) => {
  const db = readLocalDB() || {};
  res.json({ success: true, data: db.services || [] });
});

router.post('/services', (req, res) => {
  const db = readLocalDB() || {};
  const newService = {
    id: 'srv-' + Date.now(),
    title: req.body.title || 'New Service',
    tag: req.body.tag || 'Specialized Offering',
    description: req.body.description || '',
    deliverables: req.body.deliverables || '',
    image: req.body.image || '/assets/images/wedding_udaipur_palace_1794571321843.jpg',
    order: (db.services || []).length + 1,
    isPublished: req.body.isPublished !== undefined ? req.body.isPublished : true,
  };
  if (!db.services) db.services = [];
  db.services.push(newService);
  writeLocalDB(db);
  res.status(201).json({ success: true, data: newService });
});

router.put('/services/:id', (req, res) => {
  const db = readLocalDB() || {};
  const idx = (db.services || []).findIndex((s) => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Service not found' });

  db.services[idx] = { ...db.services[idx], ...req.body };
  writeLocalDB(db);
  res.json({ success: true, data: db.services[idx] });
});

router.delete('/services/:id', (req, res) => {
  const db = readLocalDB() || {};
  db.services = (db.services || []).filter((s) => s.id !== req.params.id);
  writeLocalDB(db);
  res.json({ success: true, message: 'Service removed' });
});

// Chapters CRUD
router.get('/chapters', (req, res) => {
  const db = readLocalDB() || {};
  res.json({ success: true, data: db.chapters || [] });
});

router.post('/chapters', (req, res) => {
  const db = readLocalDB() || {};
  const newChapter = {
    id: 'ch-' + Date.now(),
    title: req.body.title || 'New Chapter',
    ritual: req.body.ritual || 'Celebration Ritual',
    timeOfDay: req.body.timeOfDay || '12:00 PM',
    location: req.body.location || 'Palace Courtyard',
    description: req.body.description || '',
    image: req.body.image || '/assets/images/wedding_haldi_celebration_1794571322283.jpg',
    order: (db.chapters || []).length + 1,
    isPublished: req.body.isPublished !== undefined ? req.body.isPublished : true,
  };
  if (!db.chapters) db.chapters = [];
  db.chapters.push(newChapter);
  writeLocalDB(db);
  res.status(201).json({ success: true, data: newChapter });
});

router.put('/chapters/:id', (req, res) => {
  const db = readLocalDB() || {};
  const idx = (db.chapters || []).findIndex((c) => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Chapter not found' });

  db.chapters[idx] = { ...db.chapters[idx], ...req.body };
  writeLocalDB(db);
  res.json({ success: true, data: db.chapters[idx] });
});

router.delete('/chapters/:id', (req, res) => {
  const db = readLocalDB() || {};
  db.chapters = (db.chapters || []).filter((c) => c.id !== req.params.id);
  writeLocalDB(db);
  res.json({ success: true, message: 'Chapter removed' });
});

// Cinematic Films CRUD
router.get('/films', (req, res) => {
  const db = readLocalDB() || {};
  res.json({ success: true, data: db.films || [] });
});

router.post('/films', (req, res) => {
  const db = readLocalDB() || {};
  const newFilm = {
    id: 'film-' + Date.now(),
    title: req.body.title || 'New Wedding Film',
    couple: req.body.couple || 'Couple',
    location: req.body.location || 'India',
    year: req.body.year || '2026',
    duration: req.body.duration || '08:00',
    posterImage: req.body.posterImage || '/assets/images/film_cinema_still_1794655082919.jpg',
    videoUrl: req.body.videoUrl || '/wedding_video_frames_30fps/frame_000001.jpg',
    storyBlurb: req.body.storyBlurb || '',
    isPublished: req.body.isPublished !== undefined ? req.body.isPublished : true,
    order: (db.films || []).length + 1,
  };
  if (!db.films) db.films = [];
  db.films.push(newFilm);
  writeLocalDB(db);
  res.status(201).json({ success: true, data: newFilm });
});

router.put('/films/:id', (req, res) => {
  const db = readLocalDB() || {};
  const idx = (db.films || []).findIndex((f) => f.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Film not found' });

  db.films[idx] = { ...db.films[idx], ...req.body };
  writeLocalDB(db);
  res.json({ success: true, data: db.films[idx] });
});

router.delete('/films/:id', (req, res) => {
  const db = readLocalDB() || {};
  db.films = (db.films || []).filter((f) => f.id !== req.params.id);
  writeLocalDB(db);
  res.json({ success: true, message: 'Film removed' });
});

// Testimonials CRUD
router.get('/testimonials', (req, res) => {
  const db = readLocalDB() || {};
  res.json({ success: true, data: db.testimonials || [] });
});

router.post('/testimonials', (req, res) => {
  const db = readLocalDB() || {};
  const newTestimonial = {
    id: 'test-' + Date.now(),
    couple: req.body.couple || 'Couple Names',
    venue: req.body.venue || 'Venue, City',
    coverage: req.body.coverage || 'Wedding Coverage',
    quote: req.body.quote || 'Heartfelt note...',
    photo: req.body.photo || '/assets/images/wedding_jaipur_couple_1794571322579.jpg',
    rating: req.body.rating !== undefined ? Number(req.body.rating) : 5,
    isPublished: req.body.isPublished !== undefined ? req.body.isPublished : true,
    order: (db.testimonials || []).length + 1,
  };
  if (!db.testimonials) db.testimonials = [];
  db.testimonials.push(newTestimonial);
  writeLocalDB(db);
  res.status(201).json({ success: true, data: newTestimonial });
});

router.put('/testimonials/:id', (req, res) => {
  const db = readLocalDB() || {};
  const idx = (db.testimonials || []).findIndex((t) => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Testimonial not found' });

  db.testimonials[idx] = { ...db.testimonials[idx], ...req.body };
  writeLocalDB(db);
  res.json({ success: true, data: db.testimonials[idx] });
});

router.delete('/testimonials/:id', (req, res) => {
  const db = readLocalDB() || {};
  db.testimonials = (db.testimonials || []).filter((t) => t.id !== req.params.id);
  writeLocalDB(db);
  res.json({ success: true, message: 'Testimonial removed' });
});

// Enquiries Management
router.get('/enquiries', (req, res) => {
  const db = readLocalDB() || {};
  res.json({ success: true, data: db.enquiries || [] });
});

router.put('/enquiries/:id', (req, res) => {
  const db = readLocalDB() || {};
  const idx = (db.enquiries || []).findIndex((e) => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Enquiry not found' });

  db.enquiries[idx] = { ...db.enquiries[idx], ...req.body };
  writeLocalDB(db);
  res.json({ success: true, data: db.enquiries[idx] });
});

router.delete('/enquiries/:id', (req, res) => {
  const db = readLocalDB() || {};
  db.enquiries = (db.enquiries || []).filter((e) => e.id !== req.params.id);
  writeLocalDB(db);
  res.json({ success: true, message: 'Enquiry removed' });
});

// Settings
router.get('/settings', (req, res) => {
  const db = readLocalDB() || {};
  res.json({ success: true, data: db.settings || {} });
});

router.put('/settings', (req, res) => {
  const db = readLocalDB() || {};
  db.settings = { ...db.settings, ...req.body };
  writeLocalDB(db);
  res.json({ success: true, data: db.settings });
});

export default router;
