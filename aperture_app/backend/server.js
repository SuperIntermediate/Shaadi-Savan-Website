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

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.resolve(__dirname, '../public');

const app = express();
const PORT = process.env.BACKEND_PORT || 5000;

// Middlewares
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static uploads directory
const UPLOADS_DIR = path.join(PUBLIC_DIR, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
app.use('/uploads', express.static(UPLOADS_DIR));

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
  res.json({ status: 'ok', service: 'Shaadi-Savan Backend API', time: new Date() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[Server Error]', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// Start Server
initializeDatabase().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[API Server] Live on http://localhost:${PORT}`);
  });
});
