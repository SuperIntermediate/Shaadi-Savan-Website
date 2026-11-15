import express from 'express';
import { readLocalDB, writeLocalDB } from '../db.js';

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

// Submit Enquiry
router.post('/enquiries', (req, res) => {
  try {
    const { clientName, email, phone, weddingDate, location, weddingType, service, message } = req.body;
    if (!clientName || !email) {
      return res.status(400).json({ error: 'Client name and email address are required.' });
    }

    const db = readLocalDB();
    if (!db) {
      return res.status(500).json({ error: 'Database unavailable.' });
    }

    const newEnquiry = {
      id: 'enq-' + Date.now(),
      clientName: clientName.trim(),
      email: email.trim(),
      phone: phone ? phone.trim() : '',
      weddingDate: weddingDate ? weddingDate.trim() : '',
      location: location ? location.trim() : '',
      weddingType: weddingType ? weddingType.trim() : 'Wedding Photography & Cinema',
      service: service || 'Full Heritage Commission',
      message: message ? message.trim() : '',
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
