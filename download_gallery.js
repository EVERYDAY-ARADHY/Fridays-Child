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

// Helper to download a file or save a base64 image
function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    if (url.startsWith('data:')) {
      try {
        const matches = url.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
          return reject(new Error('Invalid base64 format'));
        }
        const buffer = Buffer.from(matches[2], 'base64');
        fs.writeFileSync(dest, buffer);
        return resolve();
      } catch(err) {
        return reject(err);
      }
    }

    const client = url.startsWith('https') ? https : http;
    client.get(url, (response) => {
      if (response.statusCode === 200 || response.statusCode === 301 || response.statusCode === 302) {
        if(response.statusCode === 301 || response.statusCode === 302) {
           return downloadFile(response.headers.location, dest).then(resolve).catch(reject);
        }
        const file = fs.createWriteStream(dest);
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      } else {
        reject(new Error(`Failed to download, status code: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

function sanitizeFilename(name) {
  return name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
}

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

  for (const item of items) {
    const safeTitle = sanitizeFilename(item.title) || item.id;
    
    // 1. Save Text Content (Poem/Story/Essay)
    if (item.content || item.description) {
      let textToSave = `Title: ${item.title}\nType: ${item.type}\nCreator: @${item.creator || 'anonymous'}\nLikes: ${item.likes}\nDate: ${item.createdAt}\n\n`;
      if (item.description) textToSave += `--- Significance ---\n${item.description}\n\n`;
      if (item.content) textToSave += `--- Content ---\n${item.content}\n`;
      
      const txtPath = path.join(BACKUP_DIR, `${safeTitle}.txt`);
      fs.writeFileSync(txtPath, textToSave);
      console.log(`✅ Saved text: ${safeTitle}.txt`);
    }

    // 2. Download Media (Image/Video)
    if (item.image) {
      let ext = item.isVideo ? '.mp4' : '.jpg';
      if (item.image.includes('.png') || item.image.startsWith('data:image/png')) ext = '.png';
      if (item.image.includes('.gif')) ext = '.gif';
      
      const mediaPath = path.join(BACKUP_DIR, `${safeTitle}_media${ext}`);
      
      try {
        await downloadFile(item.image, mediaPath);
        console.log(`✅ Downloaded media: ${safeTitle}_media${ext}`);
      } catch (err) {
        console.error(`❌ Failed to download media for "${item.title}": ${err.message}`);
      }
    }
  }

  console.log("\n🎉 Backup Complete!");
  console.log(`All files are saved in: ${BACKUP_DIR}`);
  process.exit(0);
}

run().catch(console.error);
