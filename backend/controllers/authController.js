const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Post = require('../models/Post');
const PostMetric = require('../models/PostMetric');
const UserMemory = require('../models/UserMemory');
const hindsightService = require('../services/hindsightService');

const JWT_SECRET = process.env.JWT_SECRET || 'socialpulse_super_secret_jwt_key_2026_987654321';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Generate JWT token helper
 */
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

/**
 * Password validation rule checker
 */
const validatePasswordStrength = (password) => {
  const minLength = 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const errors = [];
  if (password.length < minLength) {
    errors.push('Password must be at least 6 characters long');
  }
  if (!hasUppercase) {
    errors.push('Password must contain at least one uppercase letter (A-Z)');
  }
  if (!hasLowercase) {
    errors.push('Password must contain at least one lowercase letter (a-z)');
  }
  if (!hasNumber && !hasSpecial) {
    errors.push('Password must contain at least one number or special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Seed initial starter posts and memories for newly registered user
 */
const seedUserStarterData = async (userId, userName) => {
  try {
    // 1. Initial starter posts for LinkedIn and Instagram
    const starterPosts = [
      {
        userId,
        content: "We spent 3 weeks optimizing our AI agent's memory architecture. Here is why episodic retrieval beats standard RAG for social intelligence: 1. It preserves conversational context. 2. It tracks what hooks resonate over time. 3. It adapts to audience sentiment shifts.",
        platform: 'LinkedIn',
        topic: 'AI Architecture & Episodic Memory',
        style: 'Technical Storytelling',
        goal: 'Thought Leadership',
        hook: 'Why episodic memory beats standard RAG for social intelligence',
        status: 'analyzed',
        isSeed: true,
        metrics: {
          likes: 142,
          comments: 38,
          shares: 19,
          impressions: 4200,
          engagementRate: 4.74,
        },
      },
      {
        userId,
        content: "5 Hook frameworks that reliably stop the scroll on Instagram Carousels in 2026. Swipe to copy the templates ->",
        platform: 'Instagram',
        topic: 'Content Creation Tips',
        style: 'Visual Carousel',
        goal: 'Engagement',
        hook: '5 Hook frameworks that reliably stop the scroll',
        format: 'carousel',
        carouselSlides: [
          'Cover: 5 Hook frameworks that stop the scroll',
          'Slide 1: The Contrarian Stance',
          'Slide 2: The Direct Curiosity Gap',
          'Slide 3: The Micro-Case Study',
          'CTA: Save this for your next draft!',
        ],
        status: 'analyzed',
        isSeed: true,
        metrics: {
          likes: 284,
          comments: 67,
          shares: 52,
          impressions: 5900,
          engagementRate: 6.83,
        },
      },
    ];

    for (const item of starterPosts) {
      const { metrics, ...postData } = item;
      const post = new Post(postData);
      await post.save();

      const postMetric = new PostMetric({
        userId,
        postId: post._id,
        ...metrics,
      });
      await postMetric.save();
    }

    // 2. Initial user memory
    const userMemory = new UserMemory({
      userId,
      content: `Audience for ${userName} responds with 45% higher engagement to technical storytelling with architectural diagrams compared to generic promotional posts.`,
      topic: 'Content Strategy',
      style: 'Technical Storytelling',
      outcome: 'positive',
      tags: ['storytelling', 'architecture', 'high-engagement'],
      metrics: {
        likes: 142,
        comments: 38,
        shares: 19,
        impressions: 4200,
        engagementRate: 4.74,
      },
    });
    await userMemory.save();
  } catch (err) {
    console.warn('[Seed Starter Data Warning]:', err.message);
  }
};

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide full name, email, and password.',
      });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        error: 'Passwords do not match.',
      });
    }

    // Password validation
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        error: passwordValidation.errors[0],
        details: passwordValidation.errors,
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'An account with this email address already exists. Please log in.',
      });
    }

    // Create user (password is hashed in User pre-save hook)
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
    });

    // Seed initial user-specific starter data
    await seedUserStarterData(user._id, user.name);

    // Generate JWT token
    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('[Register Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'Registration failed. Please check your details and try again.',
      details: error.message,
    });
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please enter both email and password.',
      });
    }

    // Check for user
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.',
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.',
      });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully!',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('[Login Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'Login failed. Please try again.',
      details: error.message,
    });
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged in user
 * @access  Private (JWT protected)
 */
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to fetch user profile' });
  }
};

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Send password reset token / code
 * @access  Public
 */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: 'Please enter your email address.' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'No account found with this email address.',
      });
    }

    // Generate 6-digit reset code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash and store in user model
    user.resetPasswordToken = crypto.createHash('sha256').update(resetCode).digest('hex');
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes

    await user.save({ validateBeforeSave: false });

    console.log(`[SocialPulse Auth] Password reset code for ${user.email}: ${resetCode}`);

    return res.status(200).json({
      success: true,
      message: `Password reset code sent to ${user.email}. (For verification in demo mode, your code is: ${resetCode})`,
      resetCode, // provided directly for frictionless demo and instant validation
    });
  } catch (error) {
    console.error('[Forgot Password Error]:', error);
    return res.status(500).json({ success: false, error: 'Failed to process forgot password request.' });
  }
};

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset password using reset code/token
 * @access  Public
 */
exports.resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword, confirmPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Please provide email, verification code, and new password.',
      });
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        error: 'Passwords do not match.',
      });
    }

    // Password validation
    const passwordValidation = validatePasswordStrength(newPassword);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        error: passwordValidation.errors[0],
        details: passwordValidation.errors,
      });
    }

    // Hash provided code to compare with stored token
    const hashedCode = crypto.createHash('sha256').update(code.trim()).digest('hex');

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
      resetPasswordToken: hashedCode,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired verification code.',
      });
    }

    // Update password
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password successfully reset! You can now log in with your new password.',
    });
  } catch (error) {
    console.error('[Reset Password Error]:', error);
    return res.status(500).json({ success: false, error: 'Failed to reset password.' });
  }
};
