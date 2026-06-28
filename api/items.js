const mongoose = require('mongoose');

// ── MongoDB Connection (Shared) ─────────────────────────
const MONGO_URI = 'mongodb+srv://Aditi:fridayschildislovingandgiving9@aditi.y9fnpfp.mongodb.net/fridays_child?retryWrites=true&w=majority&appName=Aditi';

let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }
  const client = await mongoose.connect(MONGO_URI);
  cachedDb = client;
  return client;
}

// ── Schema (Shared) ─────────────────────────────────────
const customItemSchema = new mongoose.Schema({
  id:          { type: String, required: true, unique: true },
  title:       { type: String, required: true },
  type:        { type: String, required: true },
  content:     { type: String },
  description: { type: String },
  image:       { type: String },
  isVideo:     { type: Boolean, default: false },
  creator:     { type: String },
  likes:       { type: Number, default: 0 },
  createdAt:   { type: Date, default: Date.now }
});

// Avoid OverwriteModelError in serverless environments
const CustomItem = mongoose.models.CustomItem || mongoose.model('CustomItem', customItemSchema);

// ── Serverless Function Handler ─────────────────────────
module.exports = async (req, res) => {
  await connectToDatabase();

  if (req.method === 'GET') {
    try {
      const items = await CustomItem.find().sort({ createdAt: -1 }).lean();
      res.status(200).json(items);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else if (req.method === 'POST') {
    try {
      const itemData = req.body;
      if (!itemData.id || !itemData.title || !itemData.type) {
        return res.status(400).json({ error: 'id, title, and type are required' });
      }
      const item = await CustomItem.create(itemData);
      res.status(201).json(item);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
