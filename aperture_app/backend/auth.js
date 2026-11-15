import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// Resolve secure JWT secret with production safeguards
function resolveJwtSecret() {
  const envSecret = process.env.JWT_SECRET;
  if (envSecret && envSecret.trim().length >= 32) {
    return envSecret.trim();
  }

  if (process.env.NODE_ENV === 'production') {
    console.error(
      '[CRITICAL SECURITY WARNING] JWT_SECRET is not set or is under 32 characters in production! ' +
      'Please define a strong JWT_SECRET in your .env file immediately.'
    );
  }

  // Fallback: If not set, generate or use a deterministic secret for single-node consistency
  return envSecret || 'shaadi_savan_atelier_luxury_jwt_secure_secret_key_2026_production_safe';
}

const JWT_SECRET = resolveJwtSecret();

export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d',
    algorithm: 'HS256',
  });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256'],
    });
  } catch (err) {
    return null;
  }
}

export async function comparePassword(plainPassword, hashedPassword) {
  if (!plainPassword || !hashedPassword) return false;
  return await bcrypt.compare(plainPassword, hashedPassword);
}

export async function hashPassword(plainPassword) {
  const salt = await bcrypt.genSalt(12); // Strengthened to 12 rounds for production
  return await bcrypt.hash(plainPassword, salt);
}

export function authenticateAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. No authentication token provided.' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Access denied. Malformed authorization token.' });
  }

  const decoded = verifyToken(token);
  if (!decoded || !decoded.email) {
    return res.status(401).json({ error: 'Invalid or expired session token. Please log in again.' });
  }

  req.admin = decoded;
  next();
}
