const mongoose = require('mongoose');

// ── MongoDB Connection (Shared) ─────────────────────────
require('dotenv').config();
const MONGO_URI = process.env.MONGO_URI;

async function connectToDatabase() {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  return mongoose.connect(MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
  }, { bufferCommands: false });
}

// ── Schema (Shared) ─────────────────────────────────────
const customItemSchema = new mongoose.Schema({
  id:          { type: String, required: true, unique: true },
  title:       { type: String, required: true },
  type:        { type: String, required: true },
  description: { type: String },
  content:     { type: String },
  keyword:     { type: String },
  image:       { type: String },
  isVideo:     { type: Boolean, default: false },
  creator:     { type: String },
  likes:       { type: Number, default: 0 },
  createdAt:   { type: Date, default: Date.now }
}, { bufferCommands: false });

// Avoid OverwriteModelError in serverless environments
const CustomItem = mongoose.models.CustomItem || mongoose.model('CustomItem', customItemSchema);

// ── Serverless Function Handler ─────────────────────────
module.exports = async (req, res) => {
  await connectToDatabase();

  if (req.method === 'GET') {
    try {
      // Filter out any items created by 'mysha' so they don't appear in the gallery
      const items = await CustomItem.find().sort({ createdAt: -1 }).lean();
      res.status(200).json(items);
    } catch (err) {
      res.status(500).json({ error: err.message }, { bufferCommands: false });
    }
  } else if (req.method === 'POST') {
    try {
      const itemData = req.body;
      if (!itemData.id || !itemData.title || !itemData.type) {
        return res.status(400).json({ error: 'id, title, and type are required' }, { bufferCommands: false });
      }
      
      // Force creator name to prevent anyone else from taking credit
      itemData.creator = 'Ms. Aditi';
      
      const item = await CustomItem.create(itemData);
      res.status(201).json(item);
    } catch (err) {
      res.status(500).json({ error: err.message }, { bufferCommands: false });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'id query parameter is required' });
      
      const result = await CustomItem.deleteOne({ id });
      if (result.deletedCount === 0) return res.status(404).json({ error: 'Item not found' });
      
      res.status(200).json({ message: 'Deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message }, { bufferCommands: false });
    }
  } else if (req.method === 'PUT') {
    try {
      const { id } = req.query;
      const updateData = req.body;
      if (!id) return res.status(400).json({ error: 'id query parameter is required' });
      
      const item = await CustomItem.findOneAndUpdate({ id }, { $set: updateData }, { new: true });
      if (!item) return res.status(404).json({ error: 'Item not found' });
      
      res.status(200).json(item);
    } catch (err) {
      res.status(500).json({ error: err.message }, { bufferCommands: false });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'DELETE', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
