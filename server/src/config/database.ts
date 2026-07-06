import { MongoClient, Db } from 'mongodb';

let mongoClient: MongoClient | null = null;
let db: Db | null = null;

export async function connectDatabase(): Promise<Db> {
  if (db) {
    console.log('[DB] Using existing MongoDB connection');
    return db;
  }

  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    throw new Error(
      '[DB] MONGODB_URI environment variable is not set. ' +
      'Please check your .env file and ensure it contains a valid MongoDB connection string.'
    );
  }

  try {
    console.log('[DB] Connecting to MongoDB Atlas...');
    mongoClient = new MongoClient(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      retryWrites: true,
    });

    await mongoClient.connect();
    db = mongoClient.db();

    // Test the connection
    const pingResult = await db.admin().ping();
    console.log('[DB] ✓ MongoDB connection successful:', pingResult);

    return db;
  } catch (error: any) {
    const errorMessage = error?.message || String(error);
    
    // Provide helpful error diagnosis
    if (errorMessage.includes('authentication failed') || errorMessage.includes('bad auth')) {
      console.error(
        '[DB] ✗ Authentication failed.\n' +
        'Possible causes:\n' +
        '  1. MONGODB_URI contains wrong password\n' +
        '  2. Database user is not active in MongoDB Atlas\n' +
        '  3. Database user lacks required permissions\n' +
        '  4. IP address is not whitelisted in MongoDB Atlas Network Access\n' +
        '\nSolution: Go to MongoDB Atlas > Database Access > Edit User > Copy connection string with password'
      );
    } else if (errorMessage.includes('ECONNREFUSED') || errorMessage.includes('querySrv')) {
      console.error(
        '[DB] ✗ Cannot reach MongoDB cluster.\n' +
        'Possible causes:\n' +
        '  1. Cluster hostname is incorrect\n' +
        '  2. Network connectivity issue\n' +
        '  3. DNS resolution failing\n' +
        '\nVerify: mongodb+srv:// URIs require DNS SRV records. If this environment lacks SRV support,\n' +
        'use the legacy MongoDB URI format with explicit shard endpoints.'
      );
    } else if (errorMessage.includes('TIMEOUT') || errorMessage.includes('timeout')) {
      console.error(
        '[DB] ✗ Connection timeout.\n' +
        'Your IP address may not be whitelisted in MongoDB Atlas Network Access.\n' +
        'Solution: Go to MongoDB Atlas > Network Access > Add IP Address > Allow from anywhere (0.0.0.0/0) for testing'
      );
    }

    console.error('[DB] Connection error:', errorMessage);
    throw error;
  }
}

export async function disconnectDatabase(): Promise<void> {
  if (mongoClient) {
    await mongoClient.close();
    mongoClient = null;
    db = null;
    console.log('[DB] MongoDB connection closed');
  }
}

export function getDatabase(): Db {
  if (!db) {
    throw new Error('[DB] Database connection not established. Call connectDatabase() first.');
  }
  return db;
}
