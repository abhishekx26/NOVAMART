const express = require('express');
const jwt = require('jsonwebtoken');
const { User } = require('../models/index');
const { sendEmail } = require('../config/email');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { fullName, email, phone, password } = req.body;

  if (!fullName || !email || !phone || !password) {
    return res
      .status(400)
      .json({ error: 'Please provide all required fields' });
  }

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return res.status(400).json({ error: 'Email already registered' });
  }

  const user = await User.create({
    fullName,
    email,
    phone,
    password,
  });

  // Send welcome email
  try {
    await sendEmail(
      email,
      'Welcome to NOVAMART',
      `<h1>Welcome ${fullName}!</h1><p>Thank you for registering with NOVAMART.</p>`
    );
  } catch (emailError) {
    console.warn('Failed to send welcome email:', emailError.message);
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );

  res.status(201).json({
    message: 'User registered successfully',
    token,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  });
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: 'Please provide email and password' });
  }

  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const isPasswordCorrect = await user.matchPassword(password);
  if (!isPasswordCorrect) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );

  res.json({
    message: 'Login successful',
    token,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  });
});

// Get current user profile
router.get('/me', authenticateToken, async (req, res) => {
  const user = await User.findByPk(req.user.id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      address: {
        street: user.street,
        city: user.city,
        state: user.state,
        pincode: user.pincode,
        country: user.country,
      },
      role: user.role,
    },
  });
});

// Update profile
router.put('/me', authenticateToken, async (req, res) => {
  const { fullName, phone, street, city, state, pincode, country } = req.body;

  try {
    await User.update(
      { fullName, phone, street, city, state, pincode, country },
      { where: { id: req.user.id }, returning: true }
    );

    const user = await User.findByPk(req.user.id);

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        address: {
          street: user.street,
          city: user.city,
          state: user.state,
          pincode: user.pincode,
          country: user.country,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Forgot password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const resetToken = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  try {
    await User.update(
      {
        resetPasswordToken: resetToken,
        resetPasswordExpiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
      { where: { id: user.id } }
    );

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    await sendEmail(
      email,
      'Password Reset Request',
      `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 1 hour.</p>`
    );

    res.json({
      message: 'Password reset email sent',
    });
  } catch (emailError) {
    console.error('Email error:', emailError);
    res.status(500).json({ error: 'Failed to send reset email' });
  }
});

// Reset password
router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res
      .status(400)
      .json({ error: 'Token and password are required' });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  const user = await User.findByPk(decoded.id);
  if (!user || user.resetPasswordToken !== token) {
    return res.status(401).json({ error: 'Invalid reset token' });
  }

  if (new Date() > user.resetPasswordExpiresAt) {
    return res.status(401).json({ error: 'Token expired' });
  }

  try {
    await User.update(
      {
        password,
        resetPasswordToken: null,
        resetPasswordExpiresAt: null,
      },
      { where: { id: user.id } }
    );

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

// Logout
router.post('/logout', authenticateToken, (req, res) => {
  res.json({ message: 'Logout successful' });
});

module.exports = router;
