const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://Aditi:fridayschildislovingandgiving9@aditi.y9fnpfp.mongodb.net/fridays_child?retryWrites=true&w=majority&appName=Aditi';

let cachedDb = null;
async function connectToDatabase() {
  if (cachedDb) return cachedDb;
  const client = await mongoose.connect(MONGO_URI);
  cachedDb = client;
  return client;
}

const likeSchema = new mongoose.Schema({
  itemId: { type: String, required: true, unique: true },
  count:  { type: Number, default: 0 }
});

const Like = mongoose.models.Like || mongoose.model('Like', likeSchema);

module.exports = async (req, res) => {
  await connectToDatabase();
  
  // URL path should be like /api/likes/poem1
  // In Vercel, req.query contains dynamic route params if configured, or we can parse req.url
  const id = req.url.split('/').pop() || req.query.id;

  if (req.method === 'GET') {
    try {
      const doc = await Like.findOne({ itemId: id });
      res.status(200).json({ count: doc ? doc.count : 0 });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else if (req.method === 'POST') {
    try {
      const doc = await Like.findOneAndUpdate(
        { itemId: id },
        { $inc: { count: 1 } },
        { upsert: true, new: true }
      );
      res.status(200).json({ count: doc.count });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
