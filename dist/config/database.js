"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
exports.getDB = getDB;
exports.closeDB = closeDB;
const mongodb_1 = require("mongodb");
let client;
let db;
async function connectDB() {
    try {
        const uri = process.env.MONGODB_URI;
        const dbName = process.env.MONGODB_DB_NAME;
        if (!uri || !dbName) {
            throw new Error('MONGODB_URI and MONGODB_DB_NAME must be defined in environment variables');
        }
        client = new mongodb_1.MongoClient(uri);
        await client.connect();
        db = client.db(dbName);
        await db.admin().ping();
        console.log('✅ Successfully connected to MongoDB');
    }
    catch (error) {
        console.error('❌ MongoDB connection error:', error);
        throw error;
    }
}
function getDB() {
    if (!db) {
        throw new Error('Database not initialized. Call connectDB() first.');
    }
    return db;
}
async function closeDB() {
    if (client) {
        await client.close();
        console.log('🔌 MongoDB connection closed');
    }
}
process.on('SIGINT', async () => {
    await closeDB();
    process.exit(0);
});
process.on('SIGTERM', async () => {
    await closeDB();
    process.exit(0);
});
