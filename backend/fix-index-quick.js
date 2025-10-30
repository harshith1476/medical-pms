/**
 * Quick MongoDB Index Fix - Direct MongoDB Native Driver
 * 
 * This is a more direct approach that doesn't require Mongoose
 * Run: node fix-index-quick.js
 */

import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

async function fixIndexQuick() {
  let client;
  
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    
    if (!MONGODB_URI) {
      console.error('❌ Error: MONGODB_URI not found in .env file');
      process.exit(1);
    }

    console.log('🔌 Connecting to MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB');

    // Try test database first (based on error message showing test.users)
    const databases = ['test', 'prescripto'];
    let fixed = false;

    for (const dbName of databases) {
      try {
        const db = client.db(dbName);
        const collection = db.collection('users');
        
        console.log(`\n📋 Checking database: ${dbName}`);
        
        // List all indexes
        const indexes = await collection.indexes();
        console.log(`   Found ${indexes.length} index(es)`);
        
        if (indexes.length > 0) {
          indexes.forEach((index, i) => {
            console.log(`   ${i + 1}. ${index.name}:`, JSON.stringify(index.key));
          });
        }

        // Check for userId indexes
        const userIdIndexes = indexes.filter(idx => idx.key && idx.key.userId !== undefined);
        
        if (userIdIndexes.length > 0) {
          console.log(`\n🔧 Found ${userIdIndexes.length} userId-related index(es) in ${dbName} database`);
          
          for (const idx of userIdIndexes) {
            try {
              console.log(`   Dropping index: ${idx.name}...`);
              await collection.dropIndex(idx.name);
              console.log(`   ✅ Successfully dropped ${idx.name}`);
              fixed = true;
            } catch (err) {
              if (err.code === 27 || err.codeName === 'IndexNotFound') {
                console.log(`   ℹ️  Index ${idx.name} already removed`);
              } else {
                // Try dropping by key pattern
                try {
                  await collection.dropIndex(idx.key);
                  console.log(`   ✅ Successfully dropped index using key pattern`);
                  fixed = true;
                } catch (err2) {
                  console.error(`   ❌ Failed to drop ${idx.name}:`, err2.message);
                }
              }
            }
          }
        } else {
          console.log(`   ✅ No userId indexes found in ${dbName} database`);
        }
        
      } catch (err) {
        console.log(`   ⚠️  Could not access ${dbName} database:`, err.message);
      }
    }

    if (fixed) {
      console.log('\n✅ Successfully fixed the database index issue!');
      console.log('💡 You can now try creating a new account again.');
    } else {
      console.log('\nℹ️  No problematic indexes found, or indexes were already removed.');
      console.log('💡 If you\'re still getting the error, try:');
      console.log('   1. Check if you\'re using a different database name');
      console.log('   2. Connect to MongoDB directly and run: db.users.dropIndex("userId_1")');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('\n🔌 Database connection closed.');
    }
    process.exit(0);
  }
}

// Run the fix
fixIndexQuick();

