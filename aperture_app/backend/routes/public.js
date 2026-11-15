import express from 'express';
import { readLocalDB, writeLocalDB } from '../db.js';
import { enquiryRateLimiter, isValidEmail, sanitizeString } from '../middleware/security.js';

const router = express.Router();

// Settings
router.get('/settings', (req, res) => {
  const db = readLocalDB();
  res.json({ success: true, data: db ? db.settings : {} });
});

// Hero
router.get('/hero', (req, res) => {
  const db = readLocalDB();
  res.json({ success: true, data: db ? db.hero : {} });
});

// Philosophy
router.get('/philosophy', (req, res) => {
  const db = readLocalDB();
  res.json({ success: true, data: db ? db.philosophy : {} });
});

// Stories (Published only)
router.get('/stories', (req, res) => {
  const db = readLocalDB();
  const stories = (db?.stories || [])
    .filter((s) => s.isPublished !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));
  res.json({ success: true, data: stories });
});

router.get('/stories/:slug', (req, res) => {
  const db = readLocalDB();
  const story = (db?.stories || []).find(
    (s) => (s.slug === req.params.slug || s.id === req.params.slug) && s.isPublished !== false
  );
  if (!story) {
    return res.status(404).json({ error: 'Wedding story not found.' });
  }
  res.json({ success: true, data: story });
});

// Services (Visible only)
router.get('/services', (req, res) => {
  const db = readLocalDB();
  const services = (db?.services || [])
    .filter((s) => s.isPublished !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));
  res.json({ success: true, data: services });
});

// Chapters (Published only)
router.get('/chapters', (req, res) => {
  const db = readLocalDB();
  const chapters = (db?.chapters || [])
    .filter((c) => c.isPublished !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));
  res.json({ success: true, data: chapters });
});

// Films (Published only)
router.get('/films', (req, res) => {
  const db = readLocalDB();
  const films = (db?.films || [])
    .filter((f) => f.isPublished !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));
  res.json({ success: true, data: films });
});

// Testimonials (Published only)
router.get('/testimonials', (req, res) => {
  const db = readLocalDB();
  const testimonials = (db?.testimonials || [])
    .filter((t) => t.isPublished !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));
  res.json({ success: true, data: testimonials });
});

// Submit Enquiry (Rate-Limited, Validated & Sanitized)
router.post('/enquiries', enquiryRateLimiter, (req, res) => {
  try {
    const { clientName, email, phone, weddingDate, location, weddingType, service, message, honeypot } = req.body;
    
    // Honeypot spam bot trap
    if (honeypot) {
      // Silently succeed to fool automated spam bots without polluting database
      return res.status(201).json({
        success: true,
        message: 'Enquiry received.',
        data: { id: 'enq-' + Date.now() },
      });
    }

    if (!clientName || !email) {
      return res.status(400).json({ error: 'Client name and email address are required.' });
    }

    const cleanName = sanitizeString(clientName);
    const cleanEmail = email.trim();

    if (cleanName.length < 2 || cleanName.length > 100) {
      return res.status(400).json({ error: 'Please provide a valid client name (2–100 characters).' });
    }

    if (!isValidEmail(cleanEmail)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    const cleanPhone = phone ? sanitizeString(phone).slice(0, 30) : '';
    const cleanDate = weddingDate ? sanitizeString(weddingDate).slice(0, 50) : '';
    const cleanLocation = location ? sanitizeString(location).slice(0, 120) : '';
    const cleanService = service ? sanitizeString(service).slice(0, 100) : 'Full Heritage Commission';
    const cleanMessage = message ? sanitizeString(message).slice(0, 2000) : '';

    const db = readLocalDB();
    if (!db) {
      return res.status(500).json({ error: 'Database unavailable.' });
    }

    const newEnquiry = {
      id: 'enq-' + Date.now(),
      clientName: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      weddingDate: cleanDate,
      location: cleanLocation,
      weddingType: weddingType ? sanitizeString(weddingType).slice(0, 100) : 'Wedding Photography & Cinema',
      service: cleanService,
      message: cleanMessage,
      status: 'New',
      submittedAt: new Date().toISOString(),
    };

    if (!db.enquiries) db.enquiries = [];
    db.enquiries.unshift(newEnquiry);
    writeLocalDB(db);

    res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully. Our producers will contact you within 24 hours.',
      data: newEnquiry,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to process inquiry: ' + err.message });
  }
});

export default router;
