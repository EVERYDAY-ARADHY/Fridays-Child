const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://Aditi:fridayschildislovingandgiving9@aditi.y9fnpfp.mongodb.net/fridays_child?retryWrites=true&w=majority&appName=Aditi';

let cachedDb = null;
async function connectToDatabase() {
  if (cachedDb) return cachedDb;
  const client = await mongoose.connect(MONGO_URI);
  cachedDb = client;
  return client;
}

const commentSchema = new mongoose.Schema({
  itemId:    { type: String, required: true, index: true },
  author:    { type: String, required: true },
  text:      { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Comment = mongoose.models.Comment || mongoose.model('Comment', commentSchema);

module.exports = async (req, res) => {
  await connectToDatabase();
  
  const id = req.url.split('/').pop() || req.query.id;

  if (req.method === 'GET') {
    try {
      const comments = await Comment.find({ itemId: id }).sort({ createdAt: 1 }).lean();
      res.status(200).json(comments);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else if (req.method === 'POST') {
    try {
      const { author, text } = req.body;
      if (!author || !text) return res.status(400).json({ error: 'author and text required' });
      const comment = await Comment.create({ itemId: id, author, text });
      res.status(201).json(comment);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      await Comment.findByIdAndDelete(id);
      res.status(200).json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
