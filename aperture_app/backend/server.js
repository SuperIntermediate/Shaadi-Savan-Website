import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import { connectDB, readLocalDB, writeLocalDB } from './db.js';
import { getInitialSeedData } from './seedData.js';
import authRoutes from './routes/auth.js';
import publicRoutes from './routes/public.js';
import adminRoutes from './routes/admin.js';
import {
  configureCors,
  configureHelmet,
  apiLimiter,
  sanitizeInputs,
  secureErrorHandler,
} from './middleware/security.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.resolve(__dirname, '../public');

const app = express();
const PORT = process.env.BACKEND_PORT || process.env.PORT || 5000;

// Trust proxy for rate limiting behind reverse proxies (Nginx, Render, Railway, Cloudflare)
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// 1. Security Headers (Helmet with strict CSP)
app.use(configureHelmet());

// 2. Strict CORS with production allowlist
app.use(configureCors());

// 3. Cookie parser for HttpOnly session authentication
app.use(cookieParser());

// 4. Request body size limits (2MB to mitigate Denial of Service)
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// 5. NoSQL injection & input sanitization
app.use(sanitizeInputs);

// 6. Global API Rate Limiting
app.use('/api', apiLimiter);

// 7. Static uploads directory with cache control & security options
const UPLOADS_DIR = path.join(PUBLIC_DIR, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
app.use(
  '/uploads',
  express.static(UPLOADS_DIR, {
    maxAge: '7d',
    setHeaders: (res) => {
      res.setHeader('X-Content-Type-Options', 'nosniff');
    },
  })
);

// 8. Health check endpoint (Safe for uptime monitors without exposing internal infrastructure)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    environment: process.env.NODE_ENV || 'development',
  });
});

// 9. Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/admin', adminRoutes);

// 10. 404 Handler for undefined API routes
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'The requested API endpoint was not found.' });
});

// 11. Centralized Safe Error Handler
app.use(secureErrorHandler);

// Initialize Database & Seed Data
async function initializeDatabase() {
  await connectDB(process.env.MONGODB_URI);
  let db = readLocalDB();
  if (!db || !db.admin) {
    console.log('[Database] Initializing fresh database with Shaadi-Savan seed content...');
    const seed = await getInitialSeedData();
    writeLocalDB(seed);
    console.log('[Database] Database initialized successfully.');
  } else {
    console.log('[Database] Existing database verified.');
  }
}

// Start Server
initializeDatabase().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[API Server] Secure API listening on http://localhost:${PORT}`);
  });
});

export default app;
