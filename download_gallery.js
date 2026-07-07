const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;

// Same schema as api/items.js
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
});

const CustomItem = mongoose.models.CustomItem || mongoose.model('CustomItem', customItemSchema);

// This folder will be created in your project directory
const BACKUP_DIR = path.join(__dirname, 'gallery_backup');

async function run() {
  if (!MONGO_URI) {
    console.error("❌ No MONGO_URI found in .env file. Make sure you are running this from your project folder.");
    process.exit(1);
  }

  console.log("Connecting to Database...");
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected.");

  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR);
    console.log(`📁 Created backup directory: ${BACKUP_DIR}`);
  }

  const items = await CustomItem.find({});
  console.log(`Found ${items.length} items to backup.\n`);

  // Save the full raw JSON array for restoration purposes
  const jsonPath = path.join(BACKUP_DIR, 'database_backup.json');
  fs.writeFileSync(jsonPath, JSON.stringify(items, null, 2));
  console.log(`✅ Saved full database backup to: database_backup.json\n`);

  console.log("\n🎉 Backup Complete!");
  console.log(`All files are saved in: ${BACKUP_DIR}`);
  process.exit(0);
}

run().catch(console.error);
