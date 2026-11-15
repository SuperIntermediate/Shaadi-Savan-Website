import express from 'express';
import { generateToken, comparePassword, hashPassword, authenticateAdmin } from '../auth.js';
import { readLocalDB, writeLocalDB } from '../db.js';
import { loginRateLimiter } from '../middleware/security.js';

const router = express.Router();

router.post('/login', loginRateLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const db = readLocalDB();
    if (!db || !db.admin) {
      return res.status(500).json({ error: 'Admin database not initialized.' });
    }

    let isMatch = false;
    if (email.toLowerCase() === db.admin.email.toLowerCase()) {
      isMatch = await comparePassword(password, db.admin.password);
    } else {
      // Constant-time dummy hash comparison to prevent username enumeration timing attacks
      await comparePassword(password, '$2b$12$e85gS6W3b7xJc.dummyHashForConstantTimeVerification123');
    }

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = generateToken({
      email: db.admin.email,
      name: db.admin.name,
      role: db.admin.role,
    });

    res.json({
      success: true,
      token,
      admin: {
        email: db.admin.email,
        name: db.admin.name,
        role: db.admin.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Login server error: ' + err.message });
  }
});

router.get('/me', authenticateAdmin, (req, res) => {
  res.json({
    success: true,
    admin: req.admin,
  });
});

// Change Password - Admin Only & Protected
router.put('/change-password', authenticateAdmin, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

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
    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters long.' });
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
      return res.status(400).json({ error: 'New password must contain at least one special character (e.g. !@#$%^&*).' });
    }

    // Hash and persist new password
    const newHashedPassword = await hashPassword(newPassword);
    db.admin.password = newHashedPassword;
    db.admin.passwordChangedAt = new Date().toISOString();
    writeLocalDB(db);

    // Issue refreshed token
    const freshToken = generateToken({
      email: db.admin.email,
      name: db.admin.name,
      role: db.admin.role,
    });

    res.json({
      success: true,
      message: 'Master password has been changed successfully.',
      token: freshToken,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to change password: ' + err.message });
  }
});

router.post('/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully.' });
});

export default router;
