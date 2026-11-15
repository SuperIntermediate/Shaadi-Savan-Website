import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { SiteStore, Enquiry, Story, Testimonial } from './models/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let isMongoConnected = false;
let memoryCache = null;

/**
 * Connect to MongoDB Atlas
 * Seamlessly migrates local JSON data on first connect, or pulls the latest
 * cloud state into the local cache on subsequent boots.
 */
export async function connectDB(uri) {
  if (!uri) {
    console.log('[Database] No MONGODB_URI provided. Running in resilient local JSON storage mode.');
    return false;
  }

  try {
    console.log('[Database] Connecting to MongoDB Atlas cluster...');
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });

    isMongoConnected = true;
    console.log('[Database] Connected to MongoDB Atlas successfully.');

    // Sync cloud state with local cache
    try {
      const cloudRecord = await SiteStore.findOne({ key: 'main_store' });
      if (!cloudRecord || !cloudRecord.data) {
        // First connection: Seed MongoDB Atlas with existing local data
        const localData = readLocalFile();
        if (localData) {
          console.log('[Database] Seeding MongoDB Atlas cluster with existing Shaadi-Savan content...');
          await SiteStore.findOneAndUpdate(
            { key: 'main_store' },
            { key: 'main_store', data: localData, updatedAt: new Date() },
            { upsert: true, returnDocument: 'after' }
          );

          // Seed individual collections for Atlas CRM view
          if (Array.isArray(localData.enquiries) && localData.enquiries.length > 0) {
            await Enquiry.insertMany(localData.enquiries).catch(() => {});
          }
          console.log('[Database] MongoDB Atlas cluster initialized successfully.');
          memoryCache = localData;
        }
      } else {
        // Existing cloud database: sync cloud data locally
        console.log('[Database] Loaded latest synchronized state from MongoDB Atlas.');
        memoryCache = cloudRecord.data;
        writeLocalFile(cloudRecord.data);
      }
    } catch (syncErr) {
      console.warn('[Database] Initial Atlas sync warning:', syncErr.message);
    }

    return true;
  } catch (err) {
    console.warn(`[Database] MongoDB Atlas connection failed (${err.message}). Falling back to resilient local JSON store.`);
    isMongoConnected = false;
    return false;
  }
}

export function isMongoDB() {
  return isMongoConnected;
}

// Local File Store Helpers
function readLocalFile() {
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

function writeLocalFile(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (e) {
    console.error('[Database] Failed to write db.json:', e.message);
    return false;
  }
}

/**
 * Read current database state
 * Returns high-speed cached data with fallback to disk.
 */
export function readLocalDB() {
  if (memoryCache) {
    return memoryCache;
  }
  const fileData = readLocalFile();
  if (fileData) {
    memoryCache = fileData;
  }
  return fileData;
}

/**
 * Write updated database state
 * Updates memory cache, writes to local disk, and persists to MongoDB Atlas.
 */
export function writeLocalDB(data) {
  memoryCache = data;
  const localSuccess = writeLocalFile(data);

  // Asynchronously persist to MongoDB Atlas if connected
  if (isMongoConnected) {
    SiteStore.findOneAndUpdate(
      { key: 'main_store' },
      { data, updatedAt: new Date() },
      { upsert: true }
    )
      .then(() => {
        // Sync any new enquiries to the dedicated collection
        if (Array.isArray(data.enquiries) && data.enquiries.length > 0) {
          const latest = data.enquiries[0];
          if (latest && latest.id) {
            Enquiry.findOneAndUpdate(
              { email: latest.email, submittedAt: latest.submittedAt },
              latest,
              { upsert: true }
            ).catch(() => {});
          }
        }
      })
      .catch((err) => {
        console.error('[Database] MongoDB Atlas async persistence error:', err.message);
      });
  }

  return localSuccess;
}
