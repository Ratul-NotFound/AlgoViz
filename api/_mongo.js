// api/_mongo.js — Safe, Lazy MongoDB Atlas Client Pool for Serverless & Local API
import { MongoClient } from 'mongodb';

let cachedClient = null;
let cachedPromise = null;

export async function getMongoClient() {
  const uri = process.env.MONGODB_URI || process.env.VITE_MONGODB_URI || '';

  if (!uri || uri.includes('<db_username>')) {
    return null;
  }

  if (cachedPromise) {
    return cachedPromise;
  }

  const options = {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 10000,
    maxPoolSize: 10,
  };

  try {
    cachedClient = new MongoClient(uri, options);
    cachedPromise = cachedClient.connect().catch((err) => {
      console.warn('[MongoDB] Connection initialization warning:', err.message);
      cachedPromise = null;
      return null;
    });
    return cachedPromise;
  } catch (err) {
    console.warn('[MongoDB] Client creation error:', err.message);
    cachedPromise = null;
    return null;
  }
}

export default getMongoClient;
