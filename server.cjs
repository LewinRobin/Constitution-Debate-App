const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  aura: {
    type: Number,
    default: 0,
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model('User', userSchema);

// Auth Routes
// 1. Signup Route
app.post('/api/signup', async (req, res) => {
  try {
    const { fullName, email, username, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email
          ? 'Email already in use'
          : 'Username already taken'
      });
    }

    // Create new user
    const user = new User({
      fullName,
      email,
      username,
      password
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'Account created successfully'
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message
    });
  }
});

// 2. Login Route
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        aura: user.aura
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
});

// Middleware to verify JWT token
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Authentication failed',
      error: error.message
    });
  }
};

// Protected route example
app.get('/api/user', auth, async (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      fullName: req.user.fullName,
      username: req.user.username,
      email: req.user.email
    }
  });
});

// User profile route
app.get('/api/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      profile: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Server
const PORT = process.env.PORT;
// Article Schema
const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  summary: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  publishDate: { type: Date, default: Date.now },
  imageUrl: { type: String },
  votesFor: { type: Number, default: 0 },
  votesAgainst: { type: Number, default: 0 },
  category: { type: String, required: true },
});

const Article = mongoose.model('Article', articleSchema);

// Opinion Schema
const opinionSchema = new mongoose.Schema({
  articleId: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  userAura: { type: Number, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  dislikedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

const Opinion = mongoose.model('Opinion', opinionSchema);


// Article Routes
app.post('/api/articles', auth, async (req, res) => {
  try {
    const article = new Article(req.body);
    await article.save();
    res.status(201).json(article);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/articles', async (req, res) => {
  try {
    const articles = await Article.find();
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/articles/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found' });
    res.json(article);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Opinion Routes
app.post('/api/opinions', auth, async (req, res) => {
  try {
    const opinion = new Opinion({ ...req.body, userId: req.user._id, username: req.user.username, userAura: req.user.aura });
    await opinion.save();
    res.status(201).json(opinion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/opinions/:articleId', async (req, res) => {
  try {
    const opinions = await Opinion.find({ articleId: req.params.articleId });
    res.json(opinions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
