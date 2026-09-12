// api/_mongo.js — Shared MongoDB Atlas Client Pool for Serverless & Local API
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || process.env.VITE_MONGODB_URI || '';
const options = {};

let client;
let clientPromise;

if (!uri) {
  // Graceful fallback if MONGODB_URI is not set yet
  clientPromise = null;
} else {
  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so the client is preserved across HMR reloads
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    // In production mode, create a standard client instance
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
}

export default clientPromise;
