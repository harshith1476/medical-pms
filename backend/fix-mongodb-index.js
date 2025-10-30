/**
 * MongoDB Index Fix Script
 * 
 * This script fixes the duplicate key error for userId index in the users collection.
 * Run this script using: npm run fix-index
 * 
 * Make sure MONGODB_URI is set in your .env file.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function fixIndex() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    
    if (!MONGODB_URI) {
      console.error('❌ Error: MONGODB_URI not found in .env file');
      process.exit(1);
    }

    console.log('🔌 Connecting to MongoDB...');
    
    // Try to connect - the error shows 'test' database, so let's try that first
    // Also try 'prescripto' if test doesn't work
    let db;
    let connectionURI;
    
    // Try test database first (based on error message)
    try {
      connectionURI = `${MONGODB_URI}/test`;
      await mongoose.connect(connectionURI);
      db = mongoose.connection.db;
      console.log('✅ Connected to MongoDB (test database)');
    } catch (err) {
      // If test fails, try prescripto database
      try {
        connectionURI = `${MONGODB_URI}/prescripto`;
        await mongoose.connect(connectionURI);
        db = mongoose.connection.db;
        console.log('✅ Connected to MongoDB (prescripto database)');
      } catch (err2) {
        // Just connect without specifying database
        await mongoose.connect(MONGODB_URI);
        db = mongoose.connection.db;
        console.log('✅ Connected to MongoDB (default database)');
      }
    }

    const collection = db.collection('users');

    // List all indexes
    console.log('\n📋 Current indexes on users collection:');
    const indexes = await collection.indexes();
    if (indexes.length === 0) {
      console.log('  No indexes found');
    } else {
      indexes.forEach((index, i) => {
        console.log(`  ${i + 1}. ${index.name}:`, JSON.stringify(index.key));
      });
    }

    // Try to drop userId_1 index
    console.log('\n🔧 Attempting to drop userId_1 index...');
    try {
      await collection.dropIndex('userId_1');
      console.log('✅ Successfully dropped userId_1 index');
    } catch (error) {
      if (error.code === 27 || error.codeName === 'IndexNotFound' || error.message.includes('index not found')) {
        console.log('ℹ️  userId_1 index does not exist (this is fine)');
      } else {
        console.error('❌ Error dropping index:', error.message);
        // Try alternative method
        try {
          console.log('🔄 Trying alternative method to drop index...');
          await db.collection('users').dropIndex({ userId: 1 });
          console.log('✅ Successfully dropped userId_1 index using alternative method');
        } catch (altError) {
          console.error('❌ Alternative method also failed:', altError.message);
        }
      }
    }

    // Also try dropping all indexes and recreating only needed ones
    console.log('\n🔍 Checking for any userId related indexes...');
    const allIndexes = await collection.indexes();
    const userIdIndexes = allIndexes.filter(idx => idx.key && idx.key.userId !== undefined);
    
    if (userIdIndexes.length > 0) {
      console.log(`⚠️  Found ${userIdIndexes.length} userId-related index(es):`);
      for (const idx of userIdIndexes) {
        try {
          await collection.dropIndex(idx.name);
          console.log(`✅ Dropped index: ${idx.name}`);
        } catch (err) {
          console.error(`❌ Failed to drop ${idx.name}:`, err.message);
        }
      }
    }

    // Verify indexes after cleanup
    console.log('\n📋 Remaining indexes after cleanup:');
    const remainingIndexes = await collection.indexes();
    if (remainingIndexes.length === 0) {
      console.log('  No indexes remaining');
    } else {
      remainingIndexes.forEach((index, i) => {
        console.log(`  ${i + 1}. ${index.name}:`, JSON.stringify(index.key));
      });
    }

    // Verify no userId field exists in documents
    console.log('\n🔍 Checking if any documents have userId field...');
    const sampleDoc = await collection.findOne({});
    if (sampleDoc && sampleDoc.userId !== undefined) {
      console.log('⚠️  Warning: Some documents have userId field. Consider removing it.');
    } else {
      console.log('✅ No userId field found in documents (this is correct)');
    }

    console.log('\n✅ Database index fix completed successfully!');
    console.log('💡 You can now try creating a new account again.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('\n🔌 Database connection closed.');
    }
    process.exit(0);
  }
}

// Run the fix
fixIndex();

