import express from 'express';
import {
  generateToken,
  comparePassword,
  hashPassword,
  authenticateAdmin,
  requireAdminRole,
  checkAccountLockout,
  recordFailedLogin,
  resetFailedLogin,
  dummyPasswordCheck,
} from '../auth.js';
import { readLocalDB, writeLocalDB } from '../db.js';
import { authLimiter } from '../middleware/security.js';

const router = express.Router();

// Admin Login with Brute-Force Rate Limiting & Account Lockout
router.post('/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    // 1. Check account lockout status
    const lockout = checkAccountLockout(normalizedEmail);
    if (lockout.isLocked) {
      return res.status(429).json({
        error: `Account access is temporarily locked due to multiple failed attempts. Please retry in ${lockout.remainingMinutes} minute(s).`,
      });
    }

    const db = readLocalDB();
    if (!db || !db.admin) {
      return res.status(500).json({ error: 'Atelier database record unavailable.' });
    }

    const dbAdminEmail = (db.admin.email || '').toLowerCase().trim();

    // Prevent email enumeration via constant-time comparison
    if (normalizedEmail !== dbAdminEmail) {
      await dummyPasswordCheck(password);
      recordFailedLogin(normalizedEmail);
      return res.status(401).json({ error: 'Invalid administrative email or password.' });
    }

    const isMatch = await comparePassword(password, db.admin.password);
    if (!isMatch) {
      recordFailedLogin(normalizedEmail);
      return res.status(401).json({ error: 'Invalid administrative email or password.' });
    }

    // Login successful: reset failed attempt counter
    resetFailedLogin(normalizedEmail);

    const tokenPayload = {
      email: db.admin.email,
      name: db.admin.name,
      role: db.admin.role || 'Agency Owner',
      tokenVersion: db.admin.tokenVersion || 1,
    };

    const token = generateToken(tokenPayload);

    // Set HttpOnly Secure SameSite cookie for defense-in-depth
    res.cookie('shaadi_admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 2 * 60 * 60 * 1000, // 2 hours
      path: '/',
    });

    // Also return token in JSON response for frontend Authorization header support
    res.json({
      success: true,
      token,
      admin: {
        email: db.admin.email,
        name: db.admin.name,
        role: db.admin.role || 'Agency Owner',
      },
    });
  } catch (err) {
    console.error('[Login Error]', err);
    res.status(500).json({ error: 'Authentication service encountered an unexpected error.' });
  }
});

// Admin Session Verification
router.get('/me', authenticateAdmin, requireAdminRole, (req, res) => {
  res.json({
    success: true,
    admin: {
      email: req.admin.email,
      name: req.admin.name,
      role: req.admin.role,
    },
  });
});

// Logout and Cookie Clearing
router.post('/logout', (req, res) => {
  res.clearCookie('shaadi_admin_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
  res.json({ success: true, message: 'Logged out successfully.' });
});

// Change Password - Admin Only & Protected
router.put('/change-password', authenticateAdmin, requireAdminRole, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body || {};

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ error: 'All password fields are required.' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'New password and confirmation do not match.' });
    }

    const db = readLocalDB();
    if (!db || !db.admin) {
      return res.status(500).json({ error: 'Admin database record not found.' });
    }

    // Verify current password
    const isCurrentMatch = await comparePassword(currentPassword, db.admin.password);
    if (!isCurrentMatch) {
      return res.status(400).json({ error: 'Current master password is incorrect.' });
    }

    // Uniqueness validation: new password cannot be the same as current password
    const isSamePassword = await comparePassword(newPassword, db.admin.password);
    if (isSamePassword || newPassword === currentPassword) {
      return res.status(400).json({
        error: 'The new password must be unique and cannot be the same as your current password.',
      });
    }

    // Strong password policy
    if (newPassword.length < 10) {
      return res.status(400).json({ error: 'New password must be at least 10 characters long.' });
    }
    if (!/[A-Z]/.test(newPassword)) {
      return res.status(400).json({ error: 'New password must contain at least one uppercase letter (A-Z).' });
    }
    if (!/[a-z]/.test(newPassword)) {
      return res.status(400).json({ error: 'New password must contain at least one lowercase letter (a-z).' });
    }
    if (!/[0-9]/.test(newPassword)) {
      return res.status(400).json({ error: 'New password must contain at least one digit (0-9).' });
    }
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(newPassword)) {
      return res.status(400).json({ error: 'New password must contain at least one special character (!@#$%^&*).' });
    }

    // Hash and persist new password with work factor 12
    const newHashedPassword = await hashPassword(newPassword);
    db.admin.password = newHashedPassword;
    db.admin.passwordChangedAt = new Date().toISOString();
    db.admin.tokenVersion = (db.admin.tokenVersion || 1) + 1; // Invalidate older sessions
    writeLocalDB(db);

    // Issue refreshed token
    const freshToken = generateToken({
      email: db.admin.email,
      name: db.admin.name,
      role: db.admin.role,
      tokenVersion: db.admin.tokenVersion,
    });

    res.cookie('shaadi_admin_token', freshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 2 * 60 * 60 * 1000,
      path: '/',
    });

    res.json({
      success: true,
      message: 'Master password has been changed successfully.',
      token: freshToken,
    });
  } catch (err) {
    console.error('[Change Password Error]', err);
    res.status(500).json({ error: 'Failed to update credentials. Please try again.' });
  }
});

export default router;
