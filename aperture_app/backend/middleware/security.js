import crypto from 'crypto';

/**
 * In-memory sliding window rate limiter
 * Tracks requests per client IP without requiring external Redis in single-instance mode.
 */
class RateLimiter {
  constructor(windowMs, maxRequests, message = 'Too many requests, please try again later.') {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
    this.message = message;
    this.hits = new Map();

    // Periodically clean up expired IPs every 2 minutes
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      for (const [ip, record] of this.hits.entries()) {
        if (now - record.resetTime > this.windowMs) {
          this.hits.delete(ip);
        }
      }
    }, 120000);

    // Prevent interval from keeping Node process alive on exit
    if (this.cleanupInterval.unref) {
      this.cleanupInterval.unref();
    }
  }

  middleware() {
    return (req, res, next) => {
      const ip =
        req.headers['x-forwarded-for']?.split(',')[0].trim() ||
        req.socket.remoteAddress ||
        'unknown_ip';

      const now = Date.now();
      let record = this.hits.get(ip);

      if (!record || now > record.resetTime) {
        record = { count: 1, resetTime: now + this.windowMs };
        this.hits.set(ip, record);
      } else {
        record.count++;
      }

      const timeLeft = Math.max(0, Math.ceil((record.resetTime - now) / 1000));
      res.setHeader('X-RateLimit-Limit', this.maxRequests);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, this.maxRequests - record.count));
      res.setHeader('X-RateLimit-Reset', timeLeft);

      if (record.count > this.maxRequests) {
        res.setHeader('Retry-After', timeLeft);
        return res.status(429).json({
          error: this.message,
          retryAfterSeconds: timeLeft,
        });
      }

      next();
    };
  }
}

/**
 * 1. Rate Limiters
 */
// General API Rate Limiter: 120 requests per minute
export const apiRateLimiter = new RateLimiter(
  60 * 1000,
  120,
  'Too many API requests from this connection. Please slow down.'
).middleware();

// Strict Login Rate Limiter: 5 failed attempts per 15 minutes
export const loginRateLimiter = new RateLimiter(
  15 * 60 * 1000,
  5,
  'Too many failed login attempts. For security, access is temporarily locked. Please wait 15 minutes.'
).middleware();

// Public Inquiry Submission Limiter: 5 submissions per 10 minutes (Anti-Spam Bot)
export const enquiryRateLimiter = new RateLimiter(
  10 * 60 * 1000,
  5,
  'Too many inquiries submitted from this device. Please wait before submitting another.'
).middleware();

/**
 * 2. HTTP Security Headers
 * Applies OWASP recommended HTTP response headers to harden against XSS, clickjacking, MIME-sniffing, etc.
 */
export function securityHeaders(req, res, next) {
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Prevent Clickjacking (framing)
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');

  // Enable XSS filter
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Control referrer information leakage
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions Policy (disables unnecessary hardware access)
  res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(), usb=()'
  );

  // Cross-Origin isolation protections
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');

  // HSTS (HTTP Strict Transport Security) in production
  if (process.env.NODE_ENV === 'production' || req.secure || req.headers['x-forwarded-proto'] === 'https') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  // Content Security Policy (allows required fonts, media, and styles)
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' https:; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com data:; " +
    "img-src 'self' data: blob: https:; " +
    "media-src 'self' data: blob: https:; " +
    "connect-src 'self' https: http:; " +
    "frame-ancestors 'self'; " +
    "base-uri 'self'; " +
    "form-action 'self';"
  );

  next();
}

/**
 * 3. Input Sanitization & Anti-XSS Helper
 * Recursively strips script tags, HTML event handlers, and dangerous javascript: URIs.
 */
export function sanitizeString(val) {
  if (typeof val !== 'string') return val;

  return val
    // Remove null bytes
    .replace(/\0/g, '')
    // Remove script tags and contents
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Strip on* event attributes (like onerror=, onclick=)
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/on\w+\s*=\s*[^>\s]+/gi, '')
    // Remove javascript: and data: URIs in input text
    .replace(/javascript\s*:/gi, 'blocked_uri:')
    // Strip dangerous tags (iframe, object, embed)
    .replace(/<\/?(iframe|object|embed|applet|meta|link)\b[^>]*>/gi, '')
    .trim();
}

export function sanitizeInput(req, res, next) {
  if (req.body && typeof req.body === 'object') {
    sanitizeObject(req.body);
  }
  if (req.query && typeof req.query === 'object') {
    sanitizeObject(req.query);
  }
  if (req.params && typeof req.params === 'object') {
    sanitizeObject(req.params);
  }
  next();
}

function sanitizeObject(obj) {
  for (const key of Object.keys(obj)) {
    // Prototype pollution prevention
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      delete obj[key];
      continue;
    }

    const val = obj[key];
    if (typeof val === 'string') {
      obj[key] = sanitizeString(val);
    } else if (val && typeof val === 'object') {
      sanitizeObject(val);
    }
  }
}

/**
 * 4. Email Validator
 */
export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  if (email.length > 120) return false;
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(email);
}

/**
 * 5. Dynamic CORS Origin Validator
 */
export function getCorsOptions() {
  const allowedOriginsEnv = process.env.ALLOWED_ORIGINS;
  const configuredOrigins = allowedOriginsEnv
    ? allowedOriginsEnv.split(',').map((o) => o.trim())
    : [];

  return {
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, same-origin, or SSR)
      if (!origin) return callback(null, true);

      // In development, allow localhost on common dev ports
      if (process.env.NODE_ENV !== 'production') {
        if (/^http:\/\/localhost(:\d+)?$/.test(origin) || /^http:\/\/127\.0\.0\.1(:\d+)?$/.test(origin)) {
          return callback(null, true);
        }
      }

      // Always allow Shaadi-Savan Netlify frontend and netlify preview deploys
      if (origin.endsWith('.netlify.app') || origin === 'https://shaadisavan-website.netlify.app') {
        return callback(null, true);
      }

      // Check configured allowed origins
      if (configuredOrigins.length > 0) {
        if (configuredOrigins.includes(origin) || configuredOrigins.includes('*')) {
          return callback(null, true);
        }
        return callback(new Error('Blocked by CORS policy: origin not allowed'));
      }

      // Default: allow origin
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    maxAge: 86400, // 24 hours preflight cache
  };
}
