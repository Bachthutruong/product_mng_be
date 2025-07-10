import { MongoClient, Db } from 'mongodb';

let client: MongoClient;
let db: Db;

export async function connectDB(): Promise<void> {
  try {
    const uri = process.env.MONGODB_URI;
    const dbName = process.env.MONGODB_DB_NAME;

    if (!uri || !dbName) {
      throw new Error('MONGODB_URI and MONGODB_DB_NAME must be defined in environment variables');
    }

    client = new MongoClient(uri);
    await client.connect();
    
    db = client.db(dbName);
    
    // Test the connection
    await db.admin().ping();
    
    console.log('✅ Successfully connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

export function getDB(): Db {
  if (!db) {
    throw new Error('Database not initialized. Call connectDB() first.');
  }
  return db;
}

export async function closeDB(): Promise<void> {
  if (client) {
    await client.close();
    console.log('🔌 MongoDB connection closed');
  }
}

// Handle application termination
process.on('SIGINT', async () => {
  await closeDB();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closeDB();
  process.exit(0);
}); 