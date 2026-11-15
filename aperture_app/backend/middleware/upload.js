import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOAD_DIR = path.resolve(__dirname, '../../public/uploads');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Initialize Cloudinary if environment credentials are provided
const hasCloudinary = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (hasCloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  console.log('[Cloudinary] Configured for secure server-side media storage.');
}

// Allowed extensions and MIME types (Explicitly excluding SVG to prevent Stored XSS)
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/avif',
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'video/x-m4v',
]);

const ALLOWED_EXTENSIONS = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.avif',
  '.mp4',
  '.webm',
  '.mov',
  '.m4v',
]);

// Magic number / file signature validator
export function validateFileSignature(buffer) {
  if (!buffer || buffer.length < 12) return null;

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { ext: '.jpg', mime: 'image/jpeg', type: 'image' };
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return { ext: '.png', mime: 'image/png', type: 'image' };
  }

  // WebP: RIFF .... WEBP
  const riff = buffer.toString('ascii', 0, 4);
  const webp = buffer.toString('ascii', 8, 12);
  if (riff === 'RIFF' && webp === 'WEBP') {
    return { ext: '.webp', mime: 'image/webp', type: 'image' };
  }

  // MP4 / MOV: ....ftyp
  const ftyp = buffer.toString('ascii', 4, 8);
  if (ftyp === 'ftyp') {
    const brand = buffer.toString('ascii', 8, 12).toLowerCase();
    if (brand.includes('qt')) {
      return { ext: '.mov', mime: 'video/quicktime', type: 'video' };
    }
    return { ext: '.mp4', mime: 'video/mp4', type: 'video' };
  }

  // WebM / MKV: 1A 45 DF A3
  if (buffer[0] === 0x1a && buffer[1] === 0x45 && buffer[2] === 0xdf && buffer[3] === 0xa3) {
    return { ext: '.webm', mime: 'video/webm', type: 'video' };
  }

  return null;
}

// Memory storage for inspection before writing to disk/Cloudinary
const memoryStorage = multer.memoryStorage();

export const uploadMiddleware = multer({
  storage: memoryStorage,
  limits: {
    fileSize: 60 * 1024 * 1024, // 60MB max
    files: 1, // 1 file per request
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const mime = file.mimetype.toLowerCase();

    // Block SVG and HTML explicitly
    if (ext === '.svg' || mime.includes('svg') || ext === '.html' || mime.includes('html')) {
      return cb(new Error('SVG and HTML files are forbidden for security. Please upload JPG, PNG, WebP, or MP4.'));
    }

    if (!ALLOWED_EXTENSIONS.has(ext) || !ALLOWED_MIME_TYPES.has(mime)) {
      return cb(new Error('Unsupported file format. Allowed formats: JPG, PNG, WebP, AVIF, MP4, WebM, MOV.'));
    }

    cb(null, true);
  },
});

// Process verified upload and persist to Cloudinary or disk
export async function processVerifiedUpload(file, customTitle) {
  // 1. Verify file signature against binary magic numbers
  const signature = validateFileSignature(file.buffer);
  if (!signature) {
    throw new Error('File content signature verification failed. The file appears to be corrupted or spoofed.');
  }

  // 2. Upload to Cloudinary if available
  if (hasCloudinary) {
    return new Promise((resolve, reject) => {
      const resourceType = signature.type === 'video' ? 'video' : 'image';
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'shaadi-savan',
          resource_type: resourceType,
          format: signature.ext.replace('.', ''),
        },
        (error, result) => {
          if (error) {
            console.error('[Cloudinary Upload Error]', error);
            return reject(new Error('Cloudinary upload failed: ' + error.message));
          }
          resolve({
            url: result.secure_url,
            mediaType: signature.type,
            publicId: result.public_id,
            bytes: result.bytes,
            format: result.format,
            isCloudinary: true,
          });
        }
      );
      uploadStream.end(file.buffer);
    });
  }

  // 3. Fallback: Save to local disk with randomized UUID filename
  const randomFilename = `ss_${crypto.randomUUID()}${signature.ext}`;
  const targetPath = path.join(UPLOAD_DIR, randomFilename);

  await fs.promises.writeFile(targetPath, file.buffer);

  return {
    url: `/uploads/${randomFilename}`,
    mediaType: signature.type,
    publicId: randomFilename,
    bytes: file.buffer.length,
    format: signature.ext.replace('.', ''),
    isCloudinary: false,
  };
}

// Safe deletion helper for media
export async function deleteMediaAsset(mediaUrl) {
  if (!mediaUrl) return;

  try {
    // If Cloudinary URL
    if (mediaUrl.includes('cloudinary.com') && hasCloudinary) {
      const parts = mediaUrl.split('/');
      const filename = parts.pop() || '';
      const folder = parts.pop() || '';
      const publicId = `${folder}/${path.parse(filename).name}`;
      await cloudinary.uploader.destroy(publicId);
      console.log(`[Media Deletion] Cloudinary asset removed: ${publicId}`);
      return;
    }

    // If Local /uploads/ URL
    if (mediaUrl.startsWith('/uploads/')) {
      const safeBasename = path.basename(mediaUrl);
      const filePath = path.join(UPLOAD_DIR, safeBasename);
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        console.log(`[Media Deletion] Local file removed: ${filePath}`);
      }
    }
  } catch (err) {
    console.warn(`[Media Deletion Warning] Failed to delete file for ${mediaUrl}:`, err.message);
  }
}
