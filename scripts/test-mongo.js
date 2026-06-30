const mongoose = require('mongoose');
require('dotenv').config();
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("SUCCESS!");
    process.exit(0);
  })
  .catch(err => {
    console.error("FAILED:", err.message);
    process.exit(1);
  });
