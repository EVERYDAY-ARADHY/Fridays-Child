const mongoose = require('mongoose');
const MONGO_URI = 'mongodb+srv://Aditi:fridayschildislovingandgiving9@aditi.y9fnpfp.mongodb.net/fridays_child?retryWrites=true&w=majority&appName=Aditi';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("SUCCESS!");
    process.exit(0);
  })
  .catch(err => {
    console.error("FAILED:", err.message);
    process.exit(1);
  });
