const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
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

const BACKUP_DIR = path.join(__dirname, 'gallery_backup');
const JSON_BACKUP_PATH = path.join(BACKUP_DIR, 'database_backup.json');

async function run() {
  if (!MONGO_URI) {
    console.error("❌ No MONGO_URI found in .env file. Make sure you are running this from your project folder.");
    process.exit(1);
  }

  if (!fs.existsSync(JSON_BACKUP_PATH)) {
    console.error(`❌ No database_backup.json found in ${BACKUP_DIR}. Please run 'node download_gallery.js' first to create a backup!`);
    process.exit(1);
  }

  console.log("Connecting to Database...");
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected.");

  console.log("Reading backup file...");
  const rawData = fs.readFileSync(JSON_BACKUP_PATH, 'utf-8');
  let backupItems = [];
  try {
    backupItems = JSON.parse(rawData);
  } catch (err) {
    console.error("❌ Failed to parse database_backup.json!");
    process.exit(1);
  }

  console.log(`Found ${backupItems.length} items in the backup file.\n`);
  
  let restored = 0;
  let skipped = 0;

  for (const itemData of backupItems) {
    // Check if it already exists
    const existing = await CustomItem.findOne({ id: itemData.id });
    
    if (!existing) {
      // Restore missing item! Remove the MongoDB _id so it creates a fresh record safely
      delete itemData._id; 
      
      try {
        await CustomItem.create(itemData);
        console.log(`✅ RESTORED: "${itemData.title}"`);
        restored++;
      } catch (err) {
        console.error(`❌ Failed to restore "${itemData.title}":`, err.message);
      }
    } else {
      console.log(`⏭️  SKIPPED: "${itemData.title}" (already exists in database)`);
      skipped++;
    }
  }

  console.log("\n🎉 Restoration Complete!");
  console.log(`✅ Restored: ${restored}`);
  console.log(`⏭️  Skipped: ${skipped}`);
  process.exit(0);
}

run().catch(console.error);
