import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

// Allowed origins parser
export function getCorsOrigins() {
  const envOrigins = process.env.ALLOWED_ORIGINS || process.env.CLIENT_URL;
  if (envOrigins) {
    return envOrigins.split(',').map((o) => o.trim()).filter(Boolean);
  }
  // Default development origins
  return [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:5000',
  ];
}

// Configured CORS middleware
export function configureCors() {
  const allowedOrigins = getCorsOrigins();

  return cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server) in development
      if (!origin) {
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    exposedHeaders: ['Set-Cookie'],
    maxAge: 86400, // 24 hours
  });
}

// Configured Helmet security headers
export function configureHelmet() {
  const isProd = process.env.NODE_ENV === 'production';

  return helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"], // required for Vite dev / inline hydration
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
        imgSrc: [
          "'self'",
          'data:',
          'blob:',
          'https://res.cloudinary.com',
          'https://images.unsplash.com',
        ],
        mediaSrc: ["'self'", 'blob:', 'https://res.cloudinary.com'],
        connectSrc: ["'self'", 'http://localhost:5000', 'http://localhost:3000', ...getCorsOrigins()],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        upgradeInsecureRequests: isProd ? [] : null,
      },
    },
    crossOriginEmbedderPolicy: false, // allow loading media across local dev
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // allow images/video streaming to frontend
    dnsPrefetchControl: { allow: false },
    frameguard: { action: 'deny' },
    hsts: isProd
      ? {
          maxAge: 31536000,
          includeSubDomains: true,
          preload: true,
        }
      : false,
    ieNoOpen: true,
    noSniff: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    xssFilter: true,
  });
}

// Global API rate limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // 200 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests from this IP. Please try again after 15 minutes.',
  },
});

// Authentication rate limiter (brute-force defense)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // max 5 attempts per window
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  message: {
    error: 'Too many failed login attempts. Account access is temporarily locked. Please try again in 15 minutes.',
  },
});

// Public Inquiry submission rate limiter (anti-spam)
export const enquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // max 10 inquiries per IP per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many inquiry submissions from this connection. Please wait a few minutes before submitting again.',
  },
});

// Deep recursive NoSQL injection sanitization (removes keys starting with $ or containing .)
export function sanitizeNoSql(obj) {
  if (!obj || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map(sanitizeNoSql);
  }

  const clean = {};
  for (const [key, value] of Object.entries(obj)) {
    // Strip keys starting with $ or containing . (MongoDB operator injection vectors)
    if (key.startsWith('$') || key.includes('.')) {
      console.warn(`[Security Alert] Stripped forbidden parameter key: ${key}`);
      continue;
    }
    clean[key] = sanitizeNoSql(value);
  }
  return clean;
}

// Middleware to sanitize req.body, req.query, req.params
export function sanitizeInputs(req, res, next) {
  if (req.body) {
    req.body = sanitizeNoSql(req.body);
  }
  if (req.query) {
    req.query = sanitizeNoSql(req.query);
  }
  if (req.params) {
    req.params = sanitizeNoSql(req.params);
  }
  next();
}

// Centralized safe error handler
export function secureErrorHandler(err, req, res, next) {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] [Internal Server Error]`, {
    path: req.originalUrl,
    method: req.method,
    ip: req.ip,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });

  const statusCode = err.status || err.statusCode || 500;
  const isProd = process.env.NODE_ENV === 'production';

  res.status(statusCode).json({
    error: isProd
      ? statusCode === 500
        ? 'An unexpected internal error occurred. Please contact support.'
        : err.message
      : err.message || 'Internal Server Error',
    requestId: req.headers['x-request-id'] || undefined,
  });
}
