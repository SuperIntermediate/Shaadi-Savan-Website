import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// Enforce strong JWT secret from environment
function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        '[CRITICAL SECURITY ERROR] JWT_SECRET must be configured in environment variables for production.'
      );
    }
    // In development only: generate a secure session key if unset
    if (!global.__DEV_JWT_SECRET) {
      console.warn(
        '[Security Warning] JWT_SECRET is unset. Generated an ephemeral in-memory secret for this session. Set JWT_SECRET in .env for persistent sessions.'
      );
      global.__DEV_JWT_SECRET = crypto.randomBytes(48).toString('hex');
    }
    return global.__DEV_JWT_SECRET;
  }
  if (secret.length < 32 && process.env.NODE_ENV === 'production') {
    throw new Error('[CRITICAL SECURITY ERROR] JWT_SECRET must be at least 32 characters long.');
  }
  return secret;
}

const JWT_ISSUER = 'shaadisavan-atelier';
const JWT_AUDIENCE = 'shaadisavan-admin';

// Account lockout tracker in memory
const failedLoginAttempts = new Map();
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export function checkAccountLockout(email) {
  const normalizedEmail = (email || '').toLowerCase().trim();
  const record = failedLoginAttempts.get(normalizedEmail);
  if (!record) return { isLocked: false, remainingMinutes: 0 };

  const now = Date.now();
  if (record.attempts >= MAX_FAILED_ATTEMPTS) {
    const elapsed = now - record.lastAttempt;
    if (elapsed < LOCKOUT_DURATION_MS) {
      const remainingMinutes = Math.ceil((LOCKOUT_DURATION_MS - elapsed) / 60000);
      return { isLocked: true, remainingMinutes };
    }
    // Lockout expired, reset
    failedLoginAttempts.delete(normalizedEmail);
  }
  return { isLocked: false, remainingMinutes: 0 };
}

export function recordFailedLogin(email) {
  const normalizedEmail = (email || '').toLowerCase().trim();
  const record = failedLoginAttempts.get(normalizedEmail) || { attempts: 0, lastAttempt: 0 };
  record.attempts += 1;
  record.lastAttempt = Date.now();
  failedLoginAttempts.set(normalizedEmail, record);
}

export function resetFailedLogin(email) {
  const normalizedEmail = (email || '').toLowerCase().trim();
  failedLoginAttempts.delete(normalizedEmail);
}

// Generate secure short-lived JWT (2 hours)
export function generateToken(payload) {
  const secret = getJwtSecret();
  // Never embed passwords or sensitive tokens in payload
  const safePayload = {
    email: payload.email,
    name: payload.name,
    role: payload.role,
    tokenVersion: payload.tokenVersion || 1,
  };

  return jwt.sign(safePayload, secret, {
    expiresIn: '2h',
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE,
  });
}

// Verify JWT with signature, issuer, audience, and expiration check
export function verifyToken(token) {
  try {
    const secret = getJwtSecret();
    return jwt.verify(token, secret, {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    });
  } catch (err) {
    return null;
  }
}

// Password verification with bcrypt
export async function comparePassword(plainPassword, hashedPassword) {
  if (!plainPassword || !hashedPassword) return false;
  return await bcrypt.compare(plainPassword, hashedPassword);
}

// Secure password hashing with work factor 12
export async function hashPassword(plainPassword) {
  if (!plainPassword || plainPassword.length < 8) {
    throw new Error('Password must be at least 8 characters long.');
  }
  const salt = await bcrypt.genSalt(12);
  return await bcrypt.hash(plainPassword, salt);
}

// Dummy hash for constant-time comparison when email is not found
const DUMMY_HASH = '$2b$12$e8iVw8Bq/8c3KzK6V4t8e.eWbQ2yJqT6.yX2yK8qT6.yX2yK8qT6.';

export async function dummyPasswordCheck(password) {
  try {
    await bcrypt.compare(password, DUMMY_HASH);
  } catch {}
}

// Authentication middleware
export function authenticateAdmin(req, res, next) {
  let token = null;

  // 1. Check Authorization Bearer header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies && req.cookies.shaadi_admin_token) {
    // 2. Fallback to HttpOnly secure cookie
    token = req.cookies.shaadi_admin_token;
  }

  if (!token) {
    return res.status(401).json({
      error: 'Access denied. No authentication session provided.',
    });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({
      error: 'Session expired or invalid. Please log in again.',
    });
  }

  // Check role authorization
  const allowedRoles = ['admin', 'Agency Owner', 'administrator'];
  const userRole = (decoded.role || '').toLowerCase();
  const isAuthorized = allowedRoles.some((r) => r.toLowerCase() === userRole);

  if (!isAuthorized) {
    return res.status(403).json({
      error: 'Access forbidden. Administrator privileges required.',
    });
  }

  req.admin = decoded;
  next();
}

// Strict role check middleware
export function requireAdminRole(req, res, next) {
  if (!req.admin) {
    return res.status(401).json({ error: 'Authentication required.' });
  }

  const allowedRoles = ['admin', 'Agency Owner', 'administrator'];
  const userRole = (req.admin.role || '').toLowerCase();
  if (!allowedRoles.some((r) => r.toLowerCase() === userRole)) {
    return res.status(403).json({ error: 'Administrative role required.' });
  }
  next();
}
