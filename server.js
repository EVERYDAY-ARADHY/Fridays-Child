const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// ── MongoDB Connection ──────────────────────────────────
const MONGO_URI = 'mongodb+srv://Aditi:fridayschildislovingandgiving9@aditi.y9fnpfp.mongodb.net/fridays_child?retryWrites=true&w=majority&appName=Aditi';

mongoose.connect(MONGO_URI)
  .then(() => console.log('[Friday\'s Child] Connected to MongoDB Atlas'))
  .catch(err => console.error('[Friday\'s Child] MongoDB connection failed (API will return errors):', err.message));

// ── Schemas ─────────────────────────────────────────────
const likeSchema = new mongoose.Schema({
  itemId: { type: String, required: true, unique: true },
  count:  { type: Number, default: 0 }
});

const commentSchema = new mongoose.Schema({
  itemId:    { type: String, required: true, index: true },
  author:    { type: String, required: true },
  text:      { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Like    = mongoose.model('Like', likeSchema);
const Comment = mongoose.model('Comment', commentSchema);

// ── API Routes ──────────────────────────────────────────

// GET likes for an item
app.get('/api/likes/:itemId', async (req, res) => {
  try {
    const doc = await Like.findOne({ itemId: req.params.itemId });
    res.json({ count: doc ? doc.count : 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST increment like
app.post('/api/likes/:itemId', async (req, res) => {
  try {
    const doc = await Like.findOneAndUpdate(
      { itemId: req.params.itemId },
      { $inc: { count: 1 } },
      { upsert: true, new: true }
    );
    res.json({ count: doc.count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET comments for an item
app.get('/api/comments/:itemId', async (req, res) => {
  try {
    const comments = await Comment.find({ itemId: req.params.itemId })
      .sort({ createdAt: 1 })
      .lean();
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new comment
app.post('/api/comments/:itemId', async (req, res) => {
  try {
    const { author, text } = req.body;
    if (!author || !text) return res.status(400).json({ error: 'author and text required' });
    const comment = await Comment.create({
      itemId: req.params.itemId,
      author,
      text
    });
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a comment
app.delete('/api/comments/:id', async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Serve static files (production) ─────────────────────
app.use(express.static(path.join(__dirname)));

// Fallback — serve index.html for unknown routes
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, 'index.html'));
  } else {
    next();
  }
});

// ── Start ───────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`[Friday's Child] API server running on http://localhost:${PORT}`);
});
