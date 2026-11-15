import express from 'express';
import { readLocalDB, writeLocalDB } from '../db.js';
import { enquiryLimiter } from '../middleware/security.js';

const router = express.Router();

// Email regex pattern for RFC-compliant basic validation
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

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
  const safeSlug = String(req.params.slug || '').replace(/[^a-zA-Z0-9_-]/g, '');
  const db = readLocalDB();
  const story = (db?.stories || []).find(
    (s) => (s.slug === safeSlug || s.id === safeSlug) && s.isPublished !== false
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

// Submit Enquiry with Rate Limiting, Input Validation, Anti-Bot Honeypot & Anti-Spam
router.post('/enquiries', enquiryLimiter, (req, res) => {
  try {
    const {
      clientName,
      email,
      phone,
      weddingDate,
      location,
      weddingType,
      service,
      message,
      website_hp, // Honeypot field: must be empty for human users
    } = req.body || {};

    // 1. Anti-bot honeypot check
    if (website_hp && String(website_hp).trim().length > 0) {
      console.warn('[Security Alert] Automated bot submission rejected via honeypot.');
      // Silently accept so bot believes it succeeded without storing spam
      return res.status(201).json({
        success: true,
        message: 'Enquiry received.',
        data: { id: 'enq-' + Date.now() },
      });
    }

    // 2. Required fields validation
    if (!clientName || !email) {
      return res.status(400).json({ error: 'Client name and email address are required.' });
    }

    const cleanName = String(clientName).trim().replace(/[\r\n\t]/g, ' ');
    const cleanEmail = String(email).trim().toLowerCase().replace(/[\r\n\t]/g, '');

    // 3. Length restrictions
    if (cleanName.length < 2 || cleanName.length > 100) {
      return res.status(400).json({ error: 'Name must be between 2 and 100 characters.' });
    }

    if (cleanEmail.length < 5 || cleanEmail.length > 120 || !EMAIL_REGEX.test(cleanEmail)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    const cleanPhone = phone ? String(phone).trim().slice(0, 30) : '';
    const cleanDate = weddingDate ? String(weddingDate).trim().slice(0, 60) : '';
    const cleanLocation = location ? String(location).trim().slice(0, 120) : '';
    const cleanWeddingType = weddingType
      ? String(weddingType).trim().slice(0, 80)
      : 'Heritage Wedding';
    const cleanService = service ? String(service).trim().slice(0, 100) : 'Full Heritage Commission';
    const cleanMessage = message ? String(message).trim().slice(0, 3000) : '';

    const db = readLocalDB();
    if (!db) {
      return res.status(500).json({ error: 'Atelier database temporarily unavailable.' });
    }

    if (!db.enquiries) db.enquiries = [];

    // 4. Duplicate submission check (prevents double clicking within 60 seconds)
    const recentDuplicate = db.enquiries.find((e) => {
      const isSameEmail = (e.email || '').toLowerCase() === cleanEmail;
      const isSameMsg = (e.message || '') === cleanMessage;
      const isRecent = Date.now() - new Date(e.submittedAt).getTime() < 60000;
      return isSameEmail && isSameMsg && isRecent;
    });

    if (recentDuplicate) {
      return res.status(200).json({
        success: true,
        message: 'Your inquiry has already been received. Our concierge will be in touch shortly.',
        data: recentDuplicate,
      });
    }

    const newEnquiry = {
      id: 'enq-' + Date.now(),
      clientName: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      weddingDate: cleanDate,
      location: cleanLocation,
      weddingType: cleanWeddingType,
      service: cleanService,
      message: cleanMessage,
      status: 'New',
      submittedAt: new Date().toISOString(),
    };

    db.enquiries.unshift(newEnquiry);
    writeLocalDB(db);

    console.log(`[Inquiry Logged] New inquiry from ${newEnquiry.clientName} (${newEnquiry.email})`);

    res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully. Our producers will contact you within 24 hours.',
      data: newEnquiry,
    });
  } catch (err) {
    console.error('[Public Enquiry Error]', err);
    res.status(500).json({ error: 'Failed to process inquiry. Please try again shortly.' });
  }
});

export default router;
