const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
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

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: 'Email already registered' });
  }

  const user = new User({
    fullName,
    email,
    phone,
    password,
  });

  await user.save();

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
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );

  res.status(201).json({
    message: 'User registered successfully',
    token,
    user: {
      id: user._id,
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

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const isPasswordCorrect = await user.matchPassword(password);
  if (!isPasswordCorrect) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );

  res.json({
    message: 'Login successful',
    token,
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  });
});

// Get current user profile
router.get('/me', authenticateToken, async (req, res) => {
  const user = await User.findById(req.user.id).populate('orders');

  res.json({
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      address: user.address,
      role: user.role,
    },
  });
});

// Update profile
router.put('/me', authenticateToken, async (req, res) => {
  const { fullName, phone, address } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { fullName, phone, address },
    { new: true, runValidators: true }
  );

  res.json({
    message: 'Profile updated successfully',
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      address: user.address,
    },
  });
});

// Forgot password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const resetToken = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  user.resetPasswordToken = resetToken;
  user.resetPasswordExpiresAt = new Date(Date.now() + 60 * 60 * 1000);
  await user.save();

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  try {
    await sendEmail(
      email,
      'Password Reset Request',
      `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 1 hour.</p>`
    );
  } catch (emailError) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();
    return res
      .status(500)
      .json({ error: 'Failed to send reset email' });
  }

  res.json({
    message: 'Password reset email sent',
  });
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

  const user = await User.findById(decoded.id);
  if (!user || user.resetPasswordToken !== token) {
    return res.status(401).json({ error: 'Invalid reset token' });
  }

  if (new Date() > user.resetPasswordExpiresAt) {
    return res.status(401).json({ error: 'Token expired' });
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpiresAt = undefined;
  await user.save();

  res.json({ message: 'Password reset successfully' });
});

// Logout
router.post('/logout', authenticateToken, (req, res) => {
  res.json({ message: 'Logout successful' });
});

module.exports = router;
