import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { connectDB, readLocalDB, writeLocalDB } from './db.js';
import { getInitialSeedData } from './seedData.js';
import authRoutes from './routes/auth.js';
import publicRoutes from './routes/public.js';
import adminRoutes from './routes/admin.js';
import {
  securityHeaders,
  apiRateLimiter,
  sanitizeInput,
  getCorsOptions,
} from './middleware/security.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.resolve(__dirname, '../public');

const app = express();
const PORT = process.env.PORT || process.env.BACKEND_PORT || 5000;

// 1. Security: Disable Express fingerprinting
app.disable('x-powered-by');

// 2. Security: Apply OWASP HTTP Security Headers
app.use(securityHeaders);

// 3. Security: Hardened CORS configuration
app.use(cors(getCorsOptions()));

// 4. Security: Safe payload size limits (prevents Memory Exhaustion DoS)
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// 5. Security: Input sanitization & anti-XSS filter
app.use(sanitizeInput);

// 6. Security: Global API Rate Limiter
app.use('/api', apiRateLimiter);

// 7. Security: Static uploads directory with strict headers
const UPLOADS_DIR = path.join(PUBLIC_DIR, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
app.use(
  '/uploads',
  express.static(UPLOADS_DIR, {
    setHeaders: (res) => {
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('Content-Disposition', 'inline');
      res.setHeader('Cache-Control', 'public, max-age=86400');
    },
  })
);

// Initialize Seed Data if missing
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

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Shaadi-Savan Backend API',
    environment: process.env.NODE_ENV || 'development',
    time: new Date().toISOString(),
  });
});

// 404 Handler for undefined API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found.' });
});

// 8. Security: Production-safe Error Handling (Never leak internal stack traces)
app.use((err, req, res, next) => {
  console.error('[Server Error]', err);

  const isProduction = process.env.NODE_ENV === 'production';
  const statusCode = err.status || err.statusCode || 500;
  const message = isProduction && statusCode === 500
    ? 'Internal Server Error. Please contact support.'
    : err.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: message,
    ...(isProduction ? {} : { stack: err.stack }),
  });
});

// Start Server
initializeDatabase().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[API Server] Live on http://localhost:${PORT}`);
    console.log(`[Security] OWASP headers, rate-limiting, CORS, and sanitization active.`);
  });
});
