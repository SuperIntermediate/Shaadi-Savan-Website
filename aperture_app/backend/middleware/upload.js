import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOAD_DIR = path.resolve(__dirname, '../../public/uploads');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Strict allowlist for file extensions
const ALLOWED_EXTENSIONS = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.avif',
  '.gif',
  '.mp4',
  '.webm',
  '.mov',
  '.m4v',
]);

// Strict allowlist for MIME types
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif',
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'video/x-m4v',
]);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    
    // Generate secure random unguessable filename
    const randomHash = crypto.randomBytes(16).toString('hex');
    const timestamp = Date.now();
    const safeFilename = `media_${timestamp}_${randomHash}${ext}`;

    cb(null, safeFilename);
  },
});

export const secureUpload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max file size
    files: 5,                  // Max 5 files per request
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const mime = file.mimetype.toLowerCase();

    // Prevent double extensions (e.g. evil.php.jpg)
    const baseName = path.basename(file.originalname);
    const dotCount = (baseName.match(/\./g) || []).length;
    if (dotCount > 1) {
      // Check if any sub-extension is dangerous
      const parts = baseName.split('.');
      const dangerous = /^(php|phtml|phar|exe|sh|cgi|pl|py|jsp|asp|aspx|js|html|htm|svg)$/i;
      for (let i = 1; i < parts.length - 1; i++) {
        if (dangerous.test(parts[i])) {
          return cb(new Error('Security violation: Dangerous file naming detected.'));
        }
      }
    }

    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return cb(new Error(`File extension ${ext} is not permitted. Only standard photo and video formats are allowed.`));
    }

    if (!ALLOWED_MIME_TYPES.has(mime)) {
      return cb(new Error(`MIME type ${mime} is not permitted.`));
    }

    cb(null, true);
  },
});
