const mongoose = require('mongoose');

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

const likeSchema = new mongoose.Schema({
  itemId: { type: String, required: true, unique: true },
  count:  { type: Number, default: 0 }
}, { bufferCommands: false });

const Like = mongoose.models.Like || mongoose.model('Like', likeSchema);

module.exports = async (req, res) => {
  await connectToDatabase();
  
  // URL path should be like /api/likes/poem1
  // In Vercel, req.query contains dynamic route params if configured, or we can parse req.url
  const id = req.url.split('/').pop() || req.query.id;

  if (req.method === 'GET') {
    try {
      const doc = await Like.findOne({ itemId: id }, { bufferCommands: false });
      res.status(200).json({ count: doc ? doc.count : 0 }, { bufferCommands: false });
    } catch (err) {
      res.status(500).json({ error: err.message }, { bufferCommands: false });
    }
  } else if (req.method === 'POST') {
    try {
      const doc = await Like.findOneAndUpdate(
        { itemId: id },
        { $inc: { count: 1 } },
        { upsert: true, new: true }
      );
      res.status(200).json({ count: doc.count }, { bufferCommands: false });
    } catch (err) {
      res.status(500).json({ error: err.message }, { bufferCommands: false });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
