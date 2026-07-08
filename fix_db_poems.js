const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(async () => {
    console.log('Connected to DB');
    const db = mongoose.connection.db;
    
    // Find all custom items that might have this issue
    const items = await db.collection('customitems').find({
      type: { $in: ['Poem', 'Story', 'Essay'] }
    }).toArray();
    
    let updatedCount = 0;
    
    for (let i of items) {
      if (!i.content && i.description) {
        console.log(`Fixing: ${i.title}`);
        
        let newContent = '';
        let newDesc = '';
        
        const parts = i.description.split(/\n\s*\n\s*\n/);
        
        if (parts.length > 1) {
           newContent = parts[0].trim();
           newDesc = parts.slice(1).join('\n\n').trim();
           // Strip any extra quotes from the description that the user might have added
           if(newDesc.startsWith('"') && newDesc.endsWith('"')) {
               newDesc = newDesc.substring(1, newDesc.length - 1);
           }
        } else {
           newContent = i.description.trim();
           newDesc = ''; 
        }
        
        await db.collection('customitems').updateOne(
          { _id: i._id },
          { $set: { content: newContent, description: newDesc } }
        );
        updatedCount++;
      }
    }
    
    console.log(`\nFixed ${updatedCount} items in the database!`);
    process.exit(0);
  })
  .catch(err => {
    console.error('Failed:', err);
    process.exit(1);
  });
