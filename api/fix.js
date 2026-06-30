const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;

const customItemSchema = new mongoose.Schema({
  creator: { type: String }
}, { strict: false, bufferCommands: false });

const CustomItem = mongoose.models.CustomItem || mongoose.model('CustomItem', customItemSchema);

module.exports = async (req, res) => {
  if (mongoose.connection.readyState < 1) {
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 }, { bufferCommands: false });
  }

  try {
    const result = await CustomItem.updateMany({}, { $set: { creator: 'Ms. Aditi' } });
    res.status(200).json({ success: true, message: `Successfully updated all items back to Ms. Aditi! Modified ${result.modifiedCount} items.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
