import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const BACKUP_DIR = path.join(DATA_DIR, 'backups');

// Ensure data and backup directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

let isMongoConnected = false;

// Connect to MongoDB Atlas with production security options
export async function connectDB(uri) {
  const isProd = process.env.NODE_ENV === 'production';

  if (!uri) {
    if (isProd) {
      console.error('[CRITICAL DATABASE ERROR] MONGODB_URI is required in production environment.');
      process.exit(1);
    }
    console.log('[Database] No MONGODB_URI provided. Running in resilient local JSON storage mode.');
    return false;
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
      maxPoolSize: 10,
      autoIndex: !isProd, // Don't build indexes on every request in production
    });
    isMongoConnected = true;
    console.log('[Database] Connected to MongoDB Atlas securely.');
    return true;
  } catch (err) {
    console.error(`[Database Error] MongoDB connection failed: ${err.message}`);
    if (isProd) {
      console.error('[CRITICAL] Aborting startup in production to prevent silent data desynchronization.');
      process.exit(1);
    }
    console.warn('[Database] Falling back to resilient local JSON store for development.');
    isMongoConnected = false;
    return false;
  }
}

export function isMongoDB() {
  return isMongoConnected;
}

// Local File Store Helper with UTF-8 BOM protection
export function readLocalDB() {
  try {
    if (fs.existsSync(DB_FILE)) {
      let raw = fs.readFileSync(DB_FILE, 'utf-8');
      if (raw.charCodeAt(0) === 0xfeff || raw.startsWith('\uFEFF')) {
        raw = raw.slice(1);
      }
      return JSON.parse(raw.trim());
    }
  } catch (e) {
    console.error('[Database] Failed to read db.json:', e.message);
  }
  return null;
}

// Atomic write with automated rolling backups
let backupCounter = 0;
export function writeLocalDB(data) {
  try {
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid data payload passed to writeLocalDB');
    }

    // Create periodic rolling backup (every 5 writes, max 10 kept)
    backupCounter++;
    if (backupCounter % 5 === 0 && fs.existsSync(DB_FILE)) {
      try {
        const backupFile = path.join(BACKUP_DIR, `db_${Date.now()}.json`);
        fs.copyFileSync(DB_FILE, backupFile);

        // Retain only last 5 backups
        const existing = fs.readdirSync(BACKUP_DIR).sort();
        if (existing.length > 5) {
          for (let i = 0; i < existing.length - 5; i++) {
            fs.unlinkSync(path.join(BACKUP_DIR, existing[i]));
          }
        }
      } catch (backupErr) {
        console.warn('[Database Backup Warning]', backupErr.message);
      }
    }

    // Atomic write via temporary file
    const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
    return true;
  } catch (e) {
    console.error('[Database Error] Failed to write db.json:', e.message);
    return false;
  }
}
