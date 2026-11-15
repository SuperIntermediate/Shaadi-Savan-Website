import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let isMongoConnected = false;

export async function connectDB(uri) {
  if (!uri) {
    console.log('[Database] No MONGODB_URI provided. Running in resilient local JSON storage mode.');
    return false;
  }
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    });
    isMongoConnected = true;
    console.log('[Database] Connected to MongoDB successfully.');
    return true;
  } catch (err) {
    console.warn('[Database] MongoDB connection failed (' + err.message + '). Falling back to resilient local JSON store.');
    isMongoConnected = false;
    return false;
  }
}

export function isMongoDB() {
  return isMongoConnected;
}

// Local File Store Helper
export function readLocalDB() {
  try {
    if (fs.existsSync(DB_FILE)) {
      let raw = fs.readFileSync(DB_FILE, 'utf-8');
      // Strip UTF-8 BOM if present
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

export function writeLocalDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (e) {
    console.error('[Database] Failed to write db.json:', e.message);
    return false;
  }
}
