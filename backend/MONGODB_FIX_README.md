# MongoDB Index Fix - Resolve Duplicate Key Error

## Problem
You're experiencing this error:
```
MongoServerError: E11000 duplicate key error collection: test.users index: userId_1 dup key: { userId: null }
```

This occurs because there's a unique index on the `userId` field in the `users` collection, but the current schema doesn't use a `userId` field. This is likely a leftover index from a previous schema version.

## Solution - Quick Fix (Recommended)

### Option 1: Run the Quick Fix Script

1. Navigate to the backend directory:
   ```bash
   cd prescripto-full-stack/backend
   ```

2. Make sure your `.env` file has the correct `MONGODB_URI` set.

3. Run the quick fix script:
   ```bash
   npm run fix-index-quick
   ```
   
   Or directly:
   ```bash
   node fix-index-quick.js
   ```

This script will:
- ✅ Automatically detect which database you're using (`test` or `prescripto`)
- ✅ List all current indexes
- ✅ Drop all `userId`-related indexes
- ✅ Verify the fix was successful

### Option 2: Run the Main Fix Script

```bash
npm run fix-index
```

Or directly:
```bash
node fix-mongodb-index.js
```

### Option 3: Manual Fix via MongoDB Shell

1. Connect to your MongoDB instance:
   ```bash
   mongosh
   ```

2. Select your database (based on your error, it's `test`):
   ```javascript
   use test
   ```

3. Drop the problematic index:
   ```javascript
   db.users.dropIndex("userId_1")
   ```

4. Verify the index is removed:
   ```javascript
   db.users.getIndexes()
   ```

   You should NOT see any index with `userId` in it.

## Verification

After running the fix:

1. ✅ The script will show you if it successfully removed the index
2. ✅ Try creating a new account again - the error should be resolved
3. ✅ You should be able to create multiple accounts without any duplicate key errors

## Troubleshooting

If you're still getting the error after running the script:

1. **Check your database name**: The error shows `test.users`, so you're using the `test` database. If you want to use a different database, update your connection string.

2. **Run the script again**: Sometimes indexes need multiple attempts to remove.

3. **Try manual method**: Use the MongoDB shell method (Option 3) as it's the most direct approach.

4. **Check connection**: Make sure your `.env` file has the correct `MONGODB_URI` set.

## Note

- The fix script works with both `test` and `prescripto` databases
- The script will not delete your data, only remove the problematic index
- After fixing, you'll be able to create accounts without any issues

